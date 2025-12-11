import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import axiosClient from '../config/axiosClient';
import { Button } from '../components/ui/button';
import { ArrowLeft, CreditCard, Copy, Check } from 'lucide-react';

declare global {
  interface Window {
    Razorpay: {
      new (options: Record<string, unknown>): { open: () => void };
      [key: string]: unknown;
    };
  }
}

const AMOUNT = 1499;
const SERVICE_NAME = 'Premium Service';

export default function Payment() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [referralCode, setReferralCode] = useState('');
  const [processing, setProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // Redirect if not authenticated
  if (!isAuthenticated || !user) {
    navigate('/login');
    return null;
  }

  const handleCopyAmount = () => {
    navigator.clipboard.writeText(AMOUNT.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePayment = async () => {
    setProcessing(true);

    try {
      // Create order
      const orderResponse = await axiosClient.post('/payment/create-order', {
        amount: AMOUNT,
        serviceName: SERVICE_NAME,
        referralCode: referralCode.trim() || undefined,
      });

      const { order, transactionId } = orderResponse.data;

      // Initialize Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'SaveMoney',
        description: SERVICE_NAME,
        order_id: order.id,
        handler: async function (response: any) {
          try {
            // Verify payment
            await axiosClient.post('/payment/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              transactionId,
            });

            alert('Payment successful! Your referral code has been generated.');
            navigate('/dashboard?tab=wallet');
          } catch (error) {
            alert('Payment verification failed');
            setProcessing(false);
          }
        },
        prefill: {
          name: user.name || '',
          contact: user.phoneNumber || '',
        },
        theme: {
          color: '#10b981',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to create order');
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold transition"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Complete Your Purchase</h1>
            <div className="w-16" /> {/* Spacer for alignment */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Order Summary */}
          <div className="bg-linear-to-r from-emerald-600 to-teal-600 px-8 py-10 text-white">
            <h2 className="text-3xl font-bold mb-2">Order Summary</h2>
            <p className="text-emerald-100">Complete your payment to access premium features</p>
          </div>

          <div className="p-8 space-y-8">
            {/* Service Details */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">Premium Service</h3>
              <div className="bg-gray-50 rounded-lg p-6 space-y-3 border border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Service Name</span>
                  <span className="text-gray-900 font-semibold">{SERVICE_NAME}</span>
                </div>
                <div className="h-px bg-gray-200"></div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Amount</span>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold text-emerald-600">₹{AMOUNT}</span>
                    <button
                      onClick={handleCopyAmount}
                      className="p-2 hover:bg-gray-200 rounded-lg transition"
                      title="Copy amount"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="h-px bg-gray-200"></div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-gray-600 font-medium">Total</span>
                  <span className="text-2xl font-bold text-gray-900">₹{AMOUNT}</span>
                </div>
              </div>
            </div>

            {/* User Information */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">Billing Information</h3>
              <div className="bg-gray-50 rounded-lg p-6 space-y-4 border border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
                  <p className="text-gray-900 font-semibold">{user.name || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
                  <p className="text-gray-900 font-semibold">{user.phoneNumber}</p>
                </div>
              </div>
            </div>

            {/* Referral Code */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">Referral Code (Optional)</h3>
              <div>
                <label htmlFor="referral" className="block text-sm font-medium text-gray-600 mb-2">
                  Do you have a referral code?
                </label>
                <input
                  id="referral"
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                  placeholder="Enter referral code (e.g., REF123456)"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition uppercase"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Enter a referral code to get ₹200 credited to the referrer's account
                </p>
              </div>
            </div>

            {/* Terms */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                By proceeding with this payment, you agree to our terms and conditions. Your payment will be processed securely through Razorpay.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                onClick={() => navigate(-1)}
                variant="outline"
                className="flex-1 border-2 border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </Button>
              <Button
                onClick={handlePayment}
                disabled={processing}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <CreditCard className="w-5 h-5" />
                {processing ? 'Processing...' : 'Pay Now'}
              </Button>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            🔒 Your payment is secure and encrypted with industry-standard SSL encryption
          </p>
        </div>
      </div>
    </div>
  );
}
