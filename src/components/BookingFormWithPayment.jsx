import { useState, useEffect } from 'react';
import ApiService from '../services/api';

const BookingFormWithPayment = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    signers: [{ name: '', email: '', phone: '' }],
    witnesses: 0,
    serviceType: 'general',
    documentCount: 1,
    preferredDate: '',
    preferredTime: '',
    specialInstructions: '',
  });

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookingData, setBookingData] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Auto-set date for today if not provided
  useEffect(() => {
    if (!formData.preferredDate) {
      setFormData(prev => ({
        ...prev,
        preferredDate: new Date().toISOString().split('T')[0],
      }));
    }
  }, [formData.preferredDate]);

  // Pricing calculator for notary services
  const calculatePrice = () => {
    const servicePrices = {
      general: 15,        // $15 per signature
      loan_signing: 175,  // $175 average for loan documents ($100-$250 range)
      estate_planning: 260, // $260 average for estate planning ($120-$400 range)
    };

    const basePrice = servicePrices[formData.serviceType] || 0;
    const signerCount = formData.signers.filter(s => s.name && s.email).length;
    const documentCount = formData.documentCount || 1;

    if (formData.serviceType === 'general') {
      // General notary: $15 per signature + $10 service fee
      return (basePrice * Math.max(documentCount, signerCount)) + 10;
    } else if (formData.serviceType === 'loan_signing') {
      // Loan documents: base price varies by complexity
      let loanPrice = basePrice;
      if (documentCount > 10) {
        loanPrice += 25; // Additional fee for complex packages
      }
      return loanPrice;
    } else if (formData.serviceType === 'estate_planning') {
      // Estate planning: base price varies by complexity
      let estatePrice = basePrice;
      if (documentCount > 5) {
        estatePrice += 50; // Additional fee for complex estate planning
      }
      return estatePrice;
    }

    return basePrice;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSignerChange = (index, field, value) => {
    const newSigners = [...formData.signers];
    newSigners[index][field] = value;
    setFormData(prev => ({ ...prev, signers: newSigners }));
  };

  const addSigner = () => {
    setFormData(prev => ({
      ...prev,
      signers: [...prev.signers, { name: '', email: '', phone: '' }]
    }));
  };

  const removeSigner = (index) => {
    if (formData.signers.length > 1) {
      const newSigners = formData.signers.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, signers: newSigners }));
    }
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1: // Signers
        return formData.signers.every(s => s.name && s.email);
      case 2: // Schedule
        return formData.preferredDate && formData.preferredTime;
      default:
        return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const submissionData = { 
        ...formData, 
        price: calculatePrice(),
        documentCount: formData.documentCount,
        signerCount: formData.signers.filter(s => s.name && s.email).length
      };
      
      const response = await ApiService.createBooking(submissionData);
      
      if (response.success) {
        setBookingData(response.data);
        setBookingId(response.data._id);
        setShowPayment(true);
      } else {
        setError(response.message || 'Failed to create booking. Please try again.');
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
                    <span className="font-semibold capitalize">{formData.serviceType.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Documents:</span>
                    <span className="font-semibold">{formData.documentCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Signers:</span>
                    <span className="font-semibold">{formData.signers.filter(s => s.name && s.email).length}</span>
                  </div>
                  {formData.serviceType === 'general' && (
                    <div className="flex justify-between text-xs text-blue-700">
                      <span>Base Price:</span>
                      <span>${15 * Math.max(formData.documentCount, formData.signers.filter(s => s.name && s.email).length)}</span>
                    </div>
                  )}
                  {formData.serviceType === 'general' && (
                    <div className="flex justify-between text-xs text-blue-700">
                      <span>Service Fee:</span>
                      <span>$10</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold text-green-600">
                    <span>Total Amount:</span>
                    <span>${calculatePrice()}</span>
                  </div>
                </div>
              </div>

              {/* Payment Form Placeholder */}
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
                      Payment system is a demo. No real charges will be made.
                    </p>
                  </div>

                  <button
                    onClick={() => handlePaymentSuccess({ status: 'succeeded' })}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors"
                  >
                    Confirm Booking (Demo)
                  </button>
                </div>
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
                <div className="bg-green-100 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Booking Confirmed!
                </h2>
                <p className="text-gray-600">
                  Your notary session has been scheduled.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                <h3 className="font-bold text-gray-900 mb-4">Booking Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booking ID:</span>
                    <span className="font-bold text-blue-600">{bookingData?.bookingId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service:</span>
                    <span className="font-semibold capitalize">{formData.serviceType.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Cost:</span>
                    <span className="font-bold text-2xl text-gray-900">${calculatePrice()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Status:</span>
                    <span className={`font-semibold ${paymentSuccess ? 'text-green-600' : 'text-orange-600'}`}>
                      {paymentSuccess ? 'Paid (Demo)' : 'Pending'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Contact:</span>
                    <span className="font-semibold">{`${formData.signers[0]?.name || 'N/A'}`}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Next Steps</h4>
                  <ul className="text-sm text-blue-700 space-y-1 text-left">
                    <li>• A confirmation email has been sent to {formData.signers[0]?.email}</li>
                    <li>• Our team will contact you to collect your documents for review.</li>
                    <li>• You will receive a link to join the video session before your appointment.</li>
                    <li>• Please have a valid ID ready for the session.</li>
                  </ul>
                </div>

                <div className="text-center">
                  <p className="text-gray-600 mb-4">Need assistance?</p>
                  <a href="tel:+1-888-NOTARY-NOW" className="btn-primary inline-block">
                    Call Support
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const steps = [
    { number: 1, title: 'Add Signers', description: 'Enter information for all signers' },
    { number: 2, title: 'Schedule Session', description: 'Choose your preferred date and time' },
    { number: 3, title: 'Review & Pay', description: 'Review details and complete payment' }
  ];

  return (
    <section id="booking" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Book Your <span className="text-gradient-blue">Notary Session</span>
            </h2>
            <p className="text-lg text-gray-600">
              Complete the form below to schedule your online notarization session. Our team will collect your documents after booking.
            </p>
          </div>

          {/* Step Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-8">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep >= step.number 
                      ? 'bg-blue-600 border-blue-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-500'
                  }`}>
                    {currentStep > step.number ? (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      step.number
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 ${
                      currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <h3 className="text-lg font-semibold text-gray-900">{steps[currentStep - 1].title}</h3>
              <p className="text-gray-600">{steps[currentStep - 1].description}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Step 1: Add Signers */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Add Signers</h3>
                  <p className="text-gray-600 mb-4">Enter information for all individuals who need to sign the documents.</p>
                  
                  {formData.signers.map((signer, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">Signer {index + 1}</h4>
                        {formData.signers.length > 1 && (
                          <button
                            onClick={() => removeSigner(index)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="grid md:grid-cols-3 gap-4">
                        <input
                          type="text"
                          placeholder="Full Name"
                          value={signer.name}
                          onChange={(e) => handleSignerChange(index, 'name', e.target.value)}
                          className="input-field"
                          required
                        />
                        <input
                          type="email"
                          placeholder="Email"
                          value={signer.email}
                          onChange={(e) => handleSignerChange(index, 'email', e.target.value)}
                          className="input-field"
                          required
                        />
                        <input
                          type="tel"
                          placeholder="Phone"
                          value={signer.phone}
                          onChange={(e) => handleSignerChange(index, 'phone', e.target.value)}
                          className="input-field"
                        />
                      </div>
                    </div>
                  ))}
                  
                  <button
                    onClick={addSigner}
                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-2"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Add Another Signer</span>
                  </button>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={nextStep}
                    disabled={!formData.signers.every(s => s.name && s.email)}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next: Schedule Session
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Schedule Session */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Schedule Your Session</h3>
                  <p className="text-gray-600 mb-4">Choose your preferred date and time for the notarization session.</p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
                      <select
                        name="serviceType"
                        value={formData.serviceType}
                        onChange={handleInputChange}
                        className="input-field"
                        required
                      >
                        <option value="general">General Notary Work ($15 per signature)</option>
                        <option value="loan_signing">Loan Documents ($100-$250)</option>
                        <option value="estate_planning">Estate Planning ($120-$400)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Number of Documents</label>
                      <input
                        type="number"
                        name="documentCount"
                        value={formData.documentCount}
                        onChange={handleInputChange}
                        className="input-field"
                        min="1"
                        max="50"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Number of Witnesses</label>
                      <input
                        type="number"
                        name="witnesses"
                        value={formData.witnesses}
                        onChange={handleInputChange}
                        className="input-field"
                        min="0"
                        max="5"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date</label>
                      <input
                        type="date"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleInputChange}
                        className="input-field"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Time</label>
                      <input
                        type="time"
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={handleInputChange}
                        className="input-field"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Special Instructions</label>
                    <textarea
                      name="specialInstructions"
                      value={formData.specialInstructions}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Any special requirements or notes for the notary..."
                      rows="3"
                    ></textarea>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button onClick={prevStep} className="btn-secondary">
                    Previous
                  </button>
                  <button
                    onClick={nextStep}
                    disabled={!formData.preferredDate || !formData.preferredTime}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next: Review & Pay
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review & Pay */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Review Your Booking</h3>
                  <p className="text-gray-600 mb-6">Please review all the details before proceeding to payment.</p>
                  
                  <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Documents ({formData.documentCount})</h4>
                        <p className="text-sm text-gray-500 italic">Documents will be collected by our team after booking</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Signers ({formData.signers.filter(s => s.name && s.email).length})</h4>
                        <ul className="space-y-1">
                          {formData.signers.filter(s => s.name && s.email).map((signer, index) => (
                            <li key={index} className="text-sm text-gray-600">
                              {signer.name} ({signer.email})
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Service Type:</span>
                        <span className="font-semibold capitalize">{formData.serviceType.replace('_', ' ')}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Date & Time:</span>
                        <span className="font-semibold">{formData.preferredDate} at {formData.preferredTime}</span>
                      </div>
                      <div className="flex justify-between items-center text-lg font-bold text-blue-600">
                        <span>Total Amount:</span>
                        <span>${calculatePrice()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button onClick={prevStep} className="btn-secondary">
                    Previous
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="btn-primary"
                  >
                    {loading ? 'Processing...' : `Proceed to Payment - $${calculatePrice()}`}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingFormWithPayment;