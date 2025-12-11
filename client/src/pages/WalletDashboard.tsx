import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import axiosClient from '../config/axiosClient';
import { Button } from '../components/ui/button';
import { Wallet, TrendingUp, Users, Copy, Check, CreditCard } from 'lucide-react';

declare global {
  interface Window {
    Razorpay: {
      new (options: Record<string, unknown>): { open: () => void };
      [key: string]: unknown;
    };
  }
}

interface WalletData {
  balance: number;
  totalEarned: number;
  totalDisbursed: number;
  referralEarnings: Array<{
    amount: number;
    earnedAt: string;
    referredUserId: {
      name: string;
      phoneNumber: string;
    };
  }>;
}

function WalletDashboard() {
  const { user } = useAuthStore();
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [referralCode, setReferralCode] = useState<string>('');
  const [totalReferrals, setTotalReferrals] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [serviceName, setServiceName] = useState('Premium Service');
  const [amount, setAmount] = useState(999);
  const [referralCodeInput, setReferralCodeInput] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchWalletData();
    loadRazorpayScript();
  }, []);

  const loadRazorpayScript = () => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  };

  const fetchWalletData = async () => {
    try {
      const response = await axiosClient.get('/payment/wallet');
      setWalletData(response.data.wallet);
      setReferralCode(response.data.referralCode || '');
      setTotalReferrals(response.data.totalReferrals);
    } catch (error) {
      console.error('Failed to fetch wallet data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePayment = async () => {
    if (!amount || amount < 1) {
      alert('Please enter a valid amount');
      return;
    }

    setProcessing(true);

    try {
      // Create order
      const orderResponse = await axiosClient.post('/payment/create-order', {
        amount,
        serviceName,
        referralCode: referralCodeInput || undefined,
      });

      const { order, transactionId } = orderResponse.data;

      // Initialize Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'SaveMoney',
        description: serviceName,
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
            setShowPayment(false);
            setReferralCodeInput('');
            fetchWalletData();
          } catch (error) {
            alert('Payment verification failed');
          }
        },
        prefill: {
          name: user?.name || '',
          contact: user?.phoneNumber || '',
        },
        theme: {
          color: '#10b981',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to create order');
    } finally {
      setProcessing(false);
    }
  };

  const handleRequestDisbursement = async () => {
    if (!walletData || walletData.balance < 1000) {
      alert('Minimum balance of ₹1000 required for disbursement');
      return;
    }

    try {
      const response = await axiosClient.post('/payment/request-disbursement');
      alert(response.data.message);
      fetchWalletData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to request disbursement');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 border-t-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Wallet Balance Card */}
      <div className="bg-linear-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <Wallet className="w-8 h-8" />
          <h2 className="text-2xl font-bold">Wallet Balance</h2>
        </div>
        <div className="text-5xl font-bold mb-6">₹{walletData?.balance || 0}</div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-emerald-100 text-sm">Total Earned</p>
            <p className="text-2xl font-semibold">₹{walletData?.totalEarned || 0}</p>
          </div>
          <div>
            <p className="text-emerald-100 text-sm">Total Disbursed</p>
            <p className="text-2xl font-semibold">₹{walletData?.totalDisbursed || 0}</p>
          </div>
        </div>
        <Button
          onClick={handleRequestDisbursement}
          disabled={!walletData || walletData.balance < 1000}
          className="w-full bg-white text-emerald-600 hover:bg-emerald-50 font-semibold"
        >
          {walletData && walletData.balance >= 1000
            ? 'Request Disbursement'
            : `₹${1000 - (walletData?.balance || 0)} more to withdraw`}
        </Button>
      </div>

      {/* Referral Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Referral Code Card */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-emerald-100 p-2 rounded-lg">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Your Referral Code</h3>
          </div>
          {referralCode ? (
            <div className="bg-emerald-50 rounded-lg p-4 mb-4 border-2 border-emerald-200">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-emerald-700">{referralCode}</span>
                <button
                  onClick={handleCopyReferralCode}
                  className="p-2 hover:bg-emerald-100 rounded-lg transition"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Copy className="w-5 h-5 text-emerald-600" />
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4 mb-4 text-center">
              <p className="text-gray-600">Purchase a service to get your referral code</p>
            </div>
          )}
          <p className="text-sm text-gray-600">
            Share this code with friends. Earn ₹200 for each successful referral!
          </p>
        </div>

        {/* Referral Stats Card */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-teal-100 p-2 rounded-lg">
              <Users className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Referral Stats</h3>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Referrals</p>
              <p className="text-4xl font-bold text-gray-900">{totalReferrals}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Earnings per Referral</p>
              <p className="text-2xl font-semibold text-emerald-600">₹200</p>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Service Button */}
      {!showPayment && (
        <Button
          onClick={() => setShowPayment(true)}
          className="w-full py-6 text-lg font-semibold bg-linear-to-r from-emerald-600 to-teal-600"
        >
          <CreditCard className="w-5 h-5 mr-2" />
          Purchase Service
        </Button>
      )}

      {/* Payment Form */}
      {showPayment && (
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Purchase Service</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Name
              </label>
              <input
                type="text"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (₹)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                min="1"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Referral Code (Optional)
              </label>
              <input
                type="text"
                value={referralCodeInput}
                onChange={(e) => setReferralCodeInput(e.target.value.toUpperCase())}
                placeholder="Enter referral code"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 outline-none uppercase"
              />
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handlePayment}
                disabled={processing}
                className="flex-1 bg-linear-to-r from-emerald-600 to-teal-600"
              >
                {processing ? 'Processing...' : 'Pay Now'}
              </Button>
              <Button
                onClick={() => setShowPayment(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Referral Earnings History */}
      {walletData && walletData.referralEarnings.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Referral Earnings History</h3>
          <div className="space-y-3">
            {walletData.referralEarnings.map((earning, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-4 bg-emerald-50 rounded-lg"
              >
                <div>
                  <p className="font-semibold text-gray-900">
                    {earning.referredUserId?.name || 'User'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(earning.earnedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-emerald-600">+₹{earning.amount}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default WalletDashboard;
