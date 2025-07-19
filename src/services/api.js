const API_BASE_URL = 'http://localhost:3001';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.authToken = null;
  }

  setAuthToken(token) {
    this.authToken = token;
  }

  clearAuthToken() {
    this.authToken = null;
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
      
      if (!response.ok) {
        // Try to get error message from response
        let errorMessage;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
        } catch {
          errorMessage = `HTTP error! status: ${response.status}`;
        }
        throw new Error(errorMessage);
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
}

export default new ApiService(); 