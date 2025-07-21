const API_BASE_URL = 'http://localhost:3001';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.authToken = null;
    this.refreshToken = null;
    this.isRefreshing = false;
    this.failedQueue = [];
  }

  setAuthToken(token) {
    this.authToken = token;
  }

  setRefreshToken(token) {
    this.refreshToken = token;
  }

  clearAuthToken() {
    this.authToken = null;
    this.refreshToken = null;
  }

  processQueue(error, token = null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });
    
    this.failedQueue = [];
  }

  async refreshAuthToken() {
    if (this.isRefreshing) {
      // If already refreshing, return a promise that resolves when refresh is complete
      return new Promise((resolve, reject) => {
        this.failedQueue.push({ resolve, reject });
      });
    }

    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    this.isRefreshing = true;

    try {
      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: this.refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      const { access_token, refresh_token } = data.data;

      // Update tokens
      this.setAuthToken(access_token);
      this.setRefreshToken(refresh_token);

      // Update localStorage
      localStorage.setItem('rapidwaste_token', access_token);
      localStorage.setItem('rapidwaste_refresh_token', refresh_token);

      // Process the queue with the new token
      this.processQueue(null, access_token);

      return access_token;
    } catch (error) {
      // Refresh failed, clear tokens and process queue with error
      this.clearAuthToken();
      localStorage.removeItem('rapidwaste_token');
      localStorage.removeItem('rapidwaste_refresh_token');
      localStorage.removeItem('rapidwaste_user');
      
      this.processQueue(error, null);
      
      // Trigger logout in auth context
      if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('auth-logout'));
      }
      
      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add auth token if available
    if (this.authToken) {
      headers.Authorization = `Bearer ${this.authToken}`;
    }
    
    const config = {
      headers,
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (response.status === 401 && this.refreshToken && !endpoint.includes('/auth/')) {
        // Token expired, try to refresh
        try {
          await this.refreshAuthToken();
          
          // Retry the original request with new token
          const newHeaders = {
            ...headers,
            Authorization: `Bearer ${this.authToken}`,
          };
          
          const retryResponse = await fetch(url, {
            ...config,
            headers: newHeaders,
          });
          
          if (!retryResponse.ok) {
            let errorMessage;
            try {
              const errorData = await retryResponse.json();
              errorMessage = errorData.message || `HTTP error! status: ${retryResponse.status}`;
            } catch {
              errorMessage = `HTTP error! status: ${retryResponse.status}`;
            }
            const error = new Error(errorMessage);
            error.response = { status: retryResponse.status, data: errorMessage };
            throw error;
          }
          
          return await retryResponse.json();
        } catch (refreshError) {
          // Refresh failed, throw original error
          console.error('Token refresh failed:', refreshError);
          const error = new Error('Authentication failed');
          error.response = { status: 401, data: { message: 'Authentication failed' } };
          throw error;
        }
      }
      
      if (!response.ok) {
        // Try to get error message from response
        let errorMessage;
        let errorData;
        try {
          errorData = await response.json();
          errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
        } catch {
          errorMessage = `HTTP error! status: ${response.status}`;
          errorData = { message: errorMessage };
        }
        const error = new Error(errorMessage);
        error.response = { status: response.status, data: errorData };
        throw error;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Booking methods
  async createBooking(bookingData) {
    return this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async getBookings(filters = {}) {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });

    const endpoint = queryParams.toString() 
      ? `/bookings?${queryParams.toString()}` 
      : '/bookings';

    return this.request(endpoint);
  }

  async getBookingById(id) {
    return this.request(`/bookings/${id}`);
  }



  async getBookingStats(startDate, endDate) {
    const queryParams = new URLSearchParams();
    if (startDate) queryParams.append('startDate', startDate);
    if (endDate) queryParams.append('endDate', endDate);

    const endpoint = queryParams.toString() 
      ? `/bookings/stats?${queryParams.toString()}` 
      : '/bookings/stats';

    return this.request(endpoint);
  }

  // Driver methods
  async getDriverDashboard(driverId) {
    return this.request(`/drivers/${driverId}/dashboard`);
  }

  async getDriverBookings(driverId, filters = {}) {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });

    const endpoint = queryParams.toString() 
      ? `/drivers/${driverId}/bookings?${queryParams.toString()}` 
      : `/drivers/${driverId}/bookings`;

    return this.request(endpoint);
  }

  async updateDriverStatus(driverId, status) {
    return this.request(`/drivers/${driverId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async updateDriverLocation(driverId, location) {
    return this.request(`/drivers/${driverId}/location`, {
      method: 'PATCH',
      body: JSON.stringify(location),
    });
  }

  async getAvailableDrivers() {
    return this.request('/drivers/available');
  }

  // User methods
  async getDrivers(active = true) {
    return this.request(`/users/drivers?active=${active}`);
  }

  async getUserById(id) {
    return this.request(`/users/${id}`);
  }

  // Admin-specific endpoints
  async assignDriver(bookingId, driverId) {
    return this.request(`/bookings/${bookingId}/assign-driver`, {
      method: 'PATCH',
      body: JSON.stringify({ driverId }),
    });
  }

  async updateBookingStatus(bookingId, status, additionalData = {}) {
    return this.request(`/bookings/${bookingId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ 
        status, 
        ...additionalData 
      }),
    });
  }

  async getAllBookings(params = {}) {
    const searchParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] && params[key] !== 'all') {
        searchParams.append(key, params[key]);
      }
    });
    
    const queryString = searchParams.toString();
    const url = `/bookings${queryString ? `?${queryString}` : ''}`;
    
    return this.request(url);
  }

  async getAllDrivers() {
    return this.request('/users/drivers');
  }

  async getAllUsers() {
    return this.request('/users');
  }

  // Payment methods
  async createPaymentIntent(bookingId) {
    return this.request(`/payments/create-intent/${bookingId}`, {
      method: 'POST',
    });
  }

  async confirmPayment(paymentIntentId) {
    return this.request(`/payments/confirm/${paymentIntentId}`, {
      method: 'POST',
    });
  }

  async getPaymentStatus(bookingId) {
    return this.request(`/payments/status/${bookingId}`);
  }

  async refundPayment(bookingId, amount) {
    return this.request(`/payments/refund/${bookingId}`, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  }

  async createCustomerPortalSession() {
    return this.request('/payments/customer-portal', {
      method: 'POST',
    });
  }
}

export default new ApiService(); 