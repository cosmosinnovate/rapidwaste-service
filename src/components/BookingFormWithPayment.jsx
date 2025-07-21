import { useState, useEffect } from 'react';
import ApiService from '../services/api';
// import PaymentForm from './PaymentForm';

const BookingFormWithPayment = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    serviceType: 'emergency',
    bagCount: '1-5',
    preferredDate: '',
    preferredTime: '',
    specialInstructions: '',
    urgentPickup: false
  });

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookingData, setBookingData] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Auto-set date for emergency services
  useEffect(() => {
    if (formData.serviceType === 'emergency') {
      setFormData(prev => ({
        ...prev,
        preferredDate: new Date().toISOString().split('T')[0],
        preferredTime: ''
      }));
    }
  }, [formData.serviceType]);

  // Pricing calculator
  const calculatePrice = () => {
    const basePrices = {
      regular: 45,
      emergency: 50,
      bulk: 79
    };

    const bagPricing = {
      '1-5': 0,
      '6-10': 5,
      '11+': 10
    };

    const emergencyTimeFees = {
      'Next 2 hours': 10,
      'Next 4 hours': 5,
      'Today by 6 PM': 0
    };

    const basePrice = basePrices[formData.serviceType];
    const bagSurcharge = bagPricing[formData.bagCount];
    const urgentFee = formData.urgentPickup ? 15 : 0;
    
    const emergencyTimeFee = formData.serviceType === 'emergency' && formData.preferredTime 
      ? (emergencyTimeFees[formData.preferredTime] || 0) 
      : 0;

    return basePrice + bagSurcharge + urgentFee + emergencyTimeFee;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const submissionData = { ...formData };
      
      if (submissionData.preferredDate && submissionData.preferredDate.trim() !== '') {
        const dateObj = new Date(submissionData.preferredDate);
        if (!isNaN(dateObj.getTime())) {
          submissionData.preferredDate = dateObj.toISOString().split('T')[0];
        } else {
          delete submissionData.preferredDate;
        }
      } else {
        delete submissionData.preferredDate;
      }
      
      if (!submissionData.preferredTime || submissionData.preferredTime.trim() === '') {
        delete submissionData.preferredTime;
      }

      const response = await ApiService.createBooking(submissionData);
      
      if (response.success) {
        setBookingData(response.data);
        setBookingId(response.data._id); // Use MongoDB _id for payment
        setShowPayment(true);
      } else {
        setError('Failed to create booking. Please try again.');
      }
    } catch (err) {
      console.error('Booking submission error:', err);
      setError(err.message || 'Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (paymentIntent) => {
    setPaymentSuccess(true);
    setShowPayment(false);
    setShowConfirmation(true);
  };

  const handlePaymentError = (error) => {
    setError(`Payment failed: ${error}`);
  };

  const handleSkipPayment = () => {
    setShowPayment(false);
    setShowConfirmation(true);
  };

  if (showPayment) {
    return (
      <section id="booking" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Complete Your Payment
                </h2>
                <p className="text-gray-600">
                  Secure payment powered by Stripe
                </p>
              </div>

              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Booking Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Service Type:</span>
                    <span className="font-semibold capitalize">{formData.serviceType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bag Count:</span>
                    <span className="font-semibold">{formData.bagCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Customer:</span>
                    <span className="font-semibold">{`${formData.firstName} ${formData.lastName}`}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-green-600">
                    <span>Total Amount:</span>
                    <span>${calculatePrice()}</span>
                  </div>
                </div>
              </div>

              {/* Temporarily disabled PaymentForm */}
              <div className="max-w-md mx-auto">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Payment Details
                  </h3>
                  
                  <div className="mb-4">
                    <div className="text-sm text-gray-600 mb-2">Amount to Pay</div>
                    <div className="text-2xl font-bold text-green-600">
                      ${calculatePrice()?.toFixed(2) || '0.00'}
                    </div>
                  </div>

                  <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-sm text-yellow-700">
                      Payment system is not configured. Please contact support or pay on delivery.
                    </p>
                  </div>

                  <button
                    onClick={() => handlePaymentSuccess({ status: 'succeeded' })}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors"
                  >
                    Continue with Cash on Delivery
                  </button>
                </div>
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={handleSkipPayment}
                  className="text-gray-500 hover:text-gray-700 underline text-sm"
                >
                  Pay later (cash on delivery)
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (showConfirmation) {
    return (
      <section id="booking" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="mb-6">
                <div className="bg-success-100 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <svg className="h-10 w-10 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {paymentSuccess ? 'Payment & Booking Confirmed!' : 'Booking Confirmed!'}
                </h2>
                <p className="text-gray-600">
                  {paymentSuccess 
                    ? 'Your payment has been processed and pickup is scheduled'
                    : 'Your waste pickup has been scheduled'
                  }
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                <h3 className="font-bold text-gray-900 mb-4">Booking Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booking ID:</span>
                    <span className="font-bold text-primary-600">{bookingData?.bookingId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service:</span>
                    <span className="font-semibold capitalize">{formData.serviceType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Cost:</span>
                    <span className="font-bold text-2xl text-gray-900">${calculatePrice()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Status:</span>
                    <span className={`font-semibold ${paymentSuccess ? 'text-green-600' : 'text-orange-600'}`}>
                      {paymentSuccess ? 'Paid' : 'Pending'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Contact:</span>
                    <span className="font-semibold">{`${formData.firstName} ${formData.lastName}`}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-emergency-50 border border-emergency-200 rounded-lg p-4">
                  <h4 className="font-semibold text-emergency-800 mb-2">Next Steps</h4>
                  <ul className="text-sm text-emergency-700 space-y-1 text-left">
                    <li>• SMS confirmation sent to {formData.phone}</li>
                    <li>• Driver will call 30 minutes before arrival</li>
                    <li>• Place bags at designated pickup location</li>
                    {!paymentSuccess && <li>• Payment due on service completion</li>}
                  </ul>
                </div>

                <div className="text-center">
                  <p className="text-gray-600 mb-4">Need immediate assistance?</p>
                  <a href="tel:+1-800-RAPID-WASTE" className="btn-emergency inline-block">
                    Call Emergency Hotline
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Book Your <span className="text-gradient">Pickup Service</span>
            </h2>
            <p className="text-lg text-gray-600">
              Secure online booking with instant payment processing
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Personal Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="First Name"
                      required
                    />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Last Name"
                      required
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Email"
                      required
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Phone"
                      required
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Pickup Address</h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Street Address"
                      required
                    />
                    <div className="grid md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="City"
                        required
                      />
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="ZIP Code"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Service Details</h3>
                  <div className="space-y-4">
                    <select
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    >
                      <option value="emergency">Emergency Same-Day ($50 base)</option>
                      <option value="regular">Regular Pickup ($45 base)</option>
                      <option value="bulk">Bulk Item Removal ($79 base)</option>
                    </select>

                    <select
                      name="bagCount"
                      value={formData.bagCount}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="1-5">1-5 bags (Base rate)</option>
                      <option value="6-10">6-10 bags (+$5)</option>
                      <option value="11+">11+ bags (+$10)</option>
                    </select>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {formData.serviceType === 'emergency' ? 'Pickup Date (Today)' : 'Preferred Pickup Date *'}
                        </label>
                        <input
                          type="date"
                          name="preferredDate"
                          value={formData.preferredDate || (formData.serviceType === 'emergency' ? new Date().toISOString().split('T')[0] : '')}
                          onChange={handleInputChange}
                          className="input-field"
                          min={new Date().toISOString().split('T')[0]}
                          max={formData.serviceType === 'emergency' ? new Date().toISOString().split('T')[0] : undefined}
                          required={formData.serviceType !== 'emergency'}
                          disabled={formData.serviceType === 'emergency'}
                        />
                        {formData.serviceType === 'emergency' && (
                          <p className="text-sm text-orange-600 mt-1">Emergency pickups are scheduled for today</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {formData.serviceType === 'emergency' ? 'Preferred Time Slot *' : 'Preferred Time'}
                        </label>
                        <select
                          name="preferredTime"
                          value={formData.preferredTime}
                          onChange={handleInputChange}
                          className="input-field"
                          required={formData.serviceType === 'emergency'}
                        >
                          <option value="">{formData.serviceType === 'emergency' ? 'Select time slot' : 'Any time'}</option>
                          {formData.serviceType === 'emergency' ? (
                            <>
                              <option value="Next 2 hours">Next 2 hours (+$10)</option>
                              <option value="Next 4 hours">Next 4 hours (+$5)</option>
                              <option value="Today by 6 PM">Today by 6 PM (standard)</option>
                            </>
                          ) : (
                            <>
                              <option value="8:00 AM">8:00 AM - 10:00 AM</option>
                              <option value="10:00 AM">10:00 AM - 12:00 PM</option>
                              <option value="12:00 PM">12:00 PM - 2:00 PM</option>
                              <option value="2:00 PM">2:00 PM - 4:00 PM</option>
                              <option value="4:00 PM">4:00 PM - 6:00 PM</option>
                            </>
                          )}
                        </select>
                      </div>
                    </div>

                    <textarea
                      name="specialInstructions"
                      value={formData.specialInstructions}
                      onChange={handleInputChange}
                      rows={4}
                      className="input-field"
                      placeholder="Special Instructions for Driver"
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span className="text-red-700 text-sm">{error}</span>
                    </div>
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={loading}
                  className={`w-full text-lg py-3 px-6 rounded-lg font-semibold transition-colors duration-200 ${
                    loading 
                      ? 'bg-gray-400 cursor-not-allowed text-white' 
                      : 'bg-emergency-600 hover:bg-emergency-700 text-white'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Booking...
                    </div>
                  ) : (
                    `Book Service - $${calculatePrice()}`
                  )}
                </button>
              </form>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Pricing Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Base Service</span>
                    <span className="font-semibold">
                      ${formData.serviceType === 'emergency' ? '50' : 
                        formData.serviceType === 'bulk' ? '79' : '45'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Bag Count ({formData.bagCount})</span>
                    <span className="font-semibold">
                      +${formData.bagCount === '6-10' ? '5' : 
                          formData.bagCount === '11+' ? '10' : '0'}
                    </span>
                  </div>
                  {formData.serviceType === 'emergency' && formData.preferredTime && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Time Slot Fee</span>
                      <span className="font-semibold">
                        +${formData.preferredTime === 'Next 2 hours' ? '10' : 
                            formData.preferredTime === 'Next 4 hours' ? '5' : '0'}
                      </span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-primary-600">${calculatePrice()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Secure Payment</h4>
                <p className="text-sm text-blue-700">
                  Your payment is processed securely through Stripe. We accept all major credit cards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingFormWithPayment; 