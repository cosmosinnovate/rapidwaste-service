import { useState, useEffect } from 'react';
import ApiService from '../services/api';

const BookingForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    specialInstructions: '',
    urgentPickup: false
  });

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookingData, setBookingData] = useState(null);

  // Pricing calculator
  const calculatePrice = () => {
    const basePrice = 50; // Standard price for a notary session
    const urgentFee = formData.urgentPickup ? 25 : 0; // Extra fee for urgent requests
    return basePrice + urgentFee;
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
      // Prepare form data with proper date formatting
      const submissionData = { ...formData };
      
      // Handle date formatting - only include if not empty
      if (submissionData.preferredDate && submissionData.preferredDate.trim() !== '') {
        // If it's a valid date string, convert to ISO format
        const dateObj = new Date(submissionData.preferredDate);
        if (!isNaN(dateObj.getTime())) {
          submissionData.preferredDate = dateObj.toISOString().split('T')[0]; // YYYY-MM-DD format
        } else {
          // If invalid date, remove the field
          delete submissionData.preferredDate;
        }
      } else {
        // Remove empty preferredDate
        delete submissionData.preferredDate;
      }
      
      // Remove empty preferredTime if exists
      if (!submissionData.preferredTime || submissionData.preferredTime.trim() === '') {
        delete submissionData.preferredTime;
      }

      const response = await ApiService.createBooking(submissionData);
      
      if (response.success) {
        setBookingData(response.data);
        setBookingId(response.data.bookingId);
        setShowConfirmation(true);
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
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
                <p className="text-gray-600">Your notary appointment has been scheduled.</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                <h3 className="font-bold text-gray-900 mb-4">Booking Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booking ID:</span>
                    <span className="font-bold text-primary-600">{bookingId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service:</span>
                    <span className="font-semibold capitalize">Notary Appointment</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Cost:</span>
                    <span className="font-bold text-2xl text-gray-900">${bookingData?.estimatedPrice || calculatePrice()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Contact:</span>
                    <span className="font-semibold">{bookingData?.customerName || `${formData.firstName} ${formData.lastName}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-semibold capitalize text-green-600">{bookingData?.status || 'Confirmed'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Next Steps</h4>
                  <ul className="text-sm text-blue-700 space-y-1 text-left">
                    <li>• An email confirmation with the session link will be sent to {formData.email}</li>
                    <li>• Please join the session 5 minutes before your scheduled time.</li>
                    <li>• Ensure you have a stable internet connection and a valid ID.</li>
                  </ul>
                </div>

                <div className="text-center">
                  <p className="text-gray-600 mb-4">Need to make a change?</p>
                  <a href="mailto:support@notaryapp.com" className="btn-secondary inline-block">
                    Contact Support
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
              Book Your <span className="text-gradient">Notary Session</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Your Information</h3>
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
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Appointment Details</h3>
                  <div className="space-y-4">
                    {/* Appointment Date and Time */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Preferred Date
                        </label>
                        <input
                          type="date"
                          name="preferredDate"
                          value={formData.preferredDate}
                          onChange={handleInputChange}
                          className="input-field"
                          min={new Date().toISOString().split('T')[0]} // Prevent past dates
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Preferred Time
                        </label>
                        <select
                          name="preferredTime"
                          value={formData.preferredTime}
                          onChange={handleInputChange}
                          className="input-field"
                          required
                        >
                          <option value="">Select a time slot</option>
                          <option value="09:00">9:00 AM - 10:00 AM</option>
                          <option value="10:00">10:00 AM - 11:00 AM</option>
                          <option value="11:00">11:00 AM - 12:00 PM</option>
                          <option value="13:00">1:00 PM - 2:00 PM</option>
                          <option value="14:00">2:00 PM - 3:00 PM</option>
                          <option value="15:00">3:00 PM - 4:00 PM</option>
                          <option value="16:00">4:00 PM - 5:00 PM</option>
                        </select>
                      </div>
                    </div>

                    <textarea
                      name="specialInstructions"
                      value={formData.specialInstructions}
                      onChange={handleInputChange}
                      rows={4}
                      className="input-field"
                      placeholder="Special Instructions for the Notary (e.g., number of documents)"
                    />

                    <div className="flex items-center">
                      <input
                        id="urgentPickup"
                        name="urgentPickup"
                        type="checkbox"
                        checked={formData.urgentPickup}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor="urgentPickup" className="ml-2 block text-sm text-gray-900">
                        This is an urgent request (session within 24 hours, +$25 fee)
                      </label>
                    </div>
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
                      : 'bg-primary-600 hover:bg-primary-700 text-white'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </div>
                  ) : `Book Appointment - $${calculatePrice()}`}
                </button>
              </form>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-24">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h3>
                <ul className="space-y-4 text-gray-600">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold mr-3">1</div>
                    <span>Fill out your details and desired appointment time.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold mr-3">2</div>
                    <span>Upload your documents securely after booking.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold mr-3">3</div>
                    <span>Receive a confirmation email with your virtual session link.</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold mr-3">4</div>
                    <span>Meet the notary online to get your documents signed!</span>
                  </li>
                </ul>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">We Support</h4>
                  <div className="flex justify-around items-center text-gray-500">
                    <span>Oaths</span>
                    <span>Affidavits</span>
                    <span>Deeds</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingForm;