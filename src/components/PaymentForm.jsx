import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { api } from '../services/api';

// Load Stripe with fallback for development
const getStripePromise = () => {
  const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  if (key && key !== 'pk_test_your_key_here') {
    return loadStripe(key);
  }
  // Return a mock promise for development
  return Promise.resolve(null);
};

const stripePromise = getStripePromise();

const PaymentFormContent = ({ bookingId, amount, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    // Create payment intent when component mounts
    createPaymentIntent();
  }, [bookingId]);

  const createPaymentIntent = async () => {
    try {
      setLoading(true);
      const response = await api.post(`/payments/create-intent/${bookingId}`);
      
      if (response.data.success) {
        setClientSecret(response.data.data.clientSecret);
      } else {
        setError('Failed to create payment intent');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create payment intent');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      setError('Payment system not available');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message);
      } else if (paymentIntent.status === 'succeeded') {
        // Confirm payment with backend
        const confirmResponse = await api.post(`/payments/confirm/${paymentIntent.id}`);
        
        if (confirmResponse.data.success) {
          onSuccess(paymentIntent);
        } else {
          setError('Payment confirmed but failed to update booking');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  // If Stripe is not available, show a message
  if (!stripe) {
    return (
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Payment Details
          </h3>
          
          <div className="mb-4">
            <div className="text-sm text-gray-600 mb-2">Amount to Pay</div>
            <div className="text-2xl font-bold text-green-600">
              ${amount?.toFixed(2) || '0.00'}
            </div>
          </div>

          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-700">
              Payment system is not configured. Please contact support or pay on delivery.
            </p>
          </div>

          <button
            onClick={() => onSuccess({ status: 'succeeded' })}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors"
          >
            Continue with Cash on Delivery
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Payment Details
        </h3>
        
        <div className="mb-4">
          <div className="text-sm text-gray-600 mb-2">Amount to Pay</div>
          <div className="text-2xl font-bold text-green-600">
            ${amount?.toFixed(2) || '0.00'}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Information
          </label>
          <div className="border border-gray-300 rounded-md p-3 bg-white">
            <CardElement options={cardElementOptions} />
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={!stripe || loading}
          className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Processing Payment...' : `Pay $${amount?.toFixed(2) || '0.00'}`}
        </button>
      </div>
    </form>
  );
};

const PaymentForm = ({ bookingId, amount, onSuccess, onError }) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentFormContent
        bookingId={bookingId}
        amount={amount}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  );
};

export default PaymentForm; 