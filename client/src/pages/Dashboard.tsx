import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import axiosClient from '../config/axiosClient';
import { Button } from '../components/ui/button';
import { LogOut, User, Cake, Save, X, Edit, Phone, TrendingUp, Wallet, Copy, Check, Users, CreditCard } from 'lucide-react';

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

interface InfoCardProps {
  Icon: React.ComponentType<{ className: string }>;
  label: string;
  value: string | number;
  color: string;
  bgColor: string;
}

interface InputFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type: string;
  min?: string;
  max?: string;
}

function Dashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated, fetchUserProfile, updateProfile, logout, isLoading } = useAuthStore();
  
  // Profile Edit States
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Wallet States
  const [activeTab, setActiveTab] = useState('profile');
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [referralCode, setReferralCode] = useState<string>('');
  const [totalReferrals, setTotalReferrals] = useState(0);
  const [walletLoading, setWalletLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // --- 1. Authentication and Data Fetching ---
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchUserProfile();
    loadRazorpayScript();
  }, [isAuthenticated, navigate, fetchUserProfile]);

  // Load Wallet Data
  useEffect(() => {
    if (activeTab === 'wallet') {
      fetchWalletData();
    }
  }, [activeTab]);

  const loadRazorpayScript = () => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  };

  const fetchWalletData = async () => {
    setWalletLoading(true);
    try {
      const response = await axiosClient.get('/payment/wallet');
      setWalletData(response.data.wallet);
      setReferralCode(response.data.referralCode || '');
      setTotalReferrals(response.data.totalReferrals);
    } catch (error) {
      console.error('Failed to fetch wallet data:', error);
    } finally {
      setWalletLoading(false);
    }
  };

  // --- 2. Profile Edit Handlers ---
  const handleEditClick = () => {
    setName(user?.name || '');
    setAge(user?.age?.toString() || '');
    setIsEditing(true);
    setSaveError(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSaveError(null);
    setName(user?.name || '');
    setAge(user?.age?.toString() || '');
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);

    if (age && (parseInt(age) < 1 || parseInt(age) > 120)) {
      setSaveError('Age must be between 1 and 120.');
      setIsSaving(false);
      return;
    }

    const result = await updateProfile({
      name: name || undefined,
      age: age ? parseInt(age) : undefined,
    });

    if (result.success) {
      setIsEditing(false);
    } else {
      setSaveError(result.message || 'Failed to update profile. Please try again.');
    }
    setIsSaving(false);
  };

  // --- 3. Wallet Handlers ---
  const handleCopyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to request disbursement';
      alert(errorMessage);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // --- 4. Loading State ---
  if (isLoading && !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <TrendingUp className="w-10 h-10 text-emerald-500 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <nav className="bg-white shadow-md border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              <TrendingUp className="w-8 h-8 text-emerald-600" />
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                Save<span className="text-emerald-600">Money</span>
              </h1>
            </div>
            <Button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-600 hover:bg-red-50 transition-all font-semibold"
              variant="ghost"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-10 sm:py-16">
        {/* Tabs */}
        <div className="flex gap-4 mb-10 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-3 font-semibold text-lg transition-all ${
              activeTab === 'profile'
                ? 'text-emerald-600 border-b-2 border-emerald-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <User className="w-5 h-5 inline mr-2" />
            Profile
          </button>
          <button
            onClick={() => setActiveTab('wallet')}
            className={`px-6 py-3 font-semibold text-lg transition-all ${
              activeTab === 'wallet'
                ? 'text-emerald-600 border-b-2 border-emerald-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Wallet className="w-5 h-5 inline mr-2" />
            Wallet
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <>
            <div className="mb-10 border-b pb-4 border-gray-200">
              <h2 className="text-5xl font-extrabold text-gray-900 mb-2 tracking-tight">
                Hello, {user?.name ? user.name.split(' ')[0] : 'User'}!
              </h2>
              <p className="text-lg text-gray-500">Your personal account information.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
              <div className="p-6 sm:p-8 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                  <User className="w-6 h-6 text-emerald-500" />
                  Account Overview
                </h3>
                {!isEditing && (
                  <Button
                    onClick={handleEditClick}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </Button>
                )}
              </div>

              <div className="p-6 sm:p-8">
                {!isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoCard
                      Icon={Phone}
                      label="Phone Number (Login)"
                      value={user?.phoneNumber || 'N/A'}
                      color="text-emerald-600"
                      bgColor="bg-emerald-50"
                    />
                    <InfoCard
                      Icon={User}
                      label="Full Name"
                      value={user?.name || 'Not Set'}
                      color="text-teal-600"
                      bgColor="bg-teal-50"
                    />
                    <InfoCard
                      Icon={Cake}
                      label="Age"
                      value={user?.age || 'Not Set'}
                      color="text-green-600"
                      bgColor="bg-green-50"
                    />
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <label className="text-sm font-semibold text-gray-500 mb-1 block">
                        User ID (System)
                      </label>
                      <p className="text-sm font-mono text-gray-700 break-all">{user?.id || 'N/A'}</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-2xl">
                    {saveError && (
                      <div className="p-4 bg-red-100 text-red-700 rounded-lg border border-red-200 font-medium">
                        {saveError}
                      </div>
                    )}

                    <InputField
                      id="name"
                      label="Full Name"
                      value={name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      type="text"
                      min=""
                      max=""
                    />

                    <InputField
                      id="age"
                      label="Age"
                      value={age}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAge(e.target.value)}
                      placeholder="Enter your age"
                      type="number"
                      min="1"
                      max="120"
                    />

                    <div className="flex gap-4 pt-4">
                      <Button
                        type="submit"
                        disabled={isSaving}
                        className="flex-1 bg-emerald-600 text-white font-semibold py-3 rounded-lg hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isSaving ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button
                        type="button"
                        onClick={handleCancelEdit}
                        disabled={isSaving}
                        variant="outline"
                        className="flex-1 bg-gray-100 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-200 disabled:opacity-50 flex items-center justify-center gap-2 border border-gray-300"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </>
        )}

        {/* Wallet Tab */}
        {activeTab === 'wallet' && (
          <div className="space-y-6">
            {walletLoading ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 border-t-emerald-600"></div>
              </div>
            ) : (
              <>
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
                <Button
                  onClick={() => navigate('/payment')}
                  className="w-full py-6 text-lg font-semibold bg-linear-to-r from-emerald-600 to-teal-600"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Purchase Service
                </Button>

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
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

// --- Reusable Sub-Components for Professionalism ---

// Info Card Component (For Display Mode)
const InfoCard = ({ Icon, label, value, color, bgColor }: InfoCardProps) => (
    <div className={`${bgColor} rounded-xl p-6 border border-gray-100 transition-all hover:shadow-sm`}>
        <div className="flex items-center gap-4 mb-3">
            <div className={`p-3 rounded-xl ${bgColor} border-2 ${color} border-opacity-30`}>
                <Icon className={`w-6 h-6 ${color}`} />
            </div>
            <label className="text-base font-semibold text-gray-600">{label}</label>
        </div>
        <p className="text-3xl font-extrabold text-gray-900 tracking-tight">{value}</p>
    </div>
);

// Input Field Component (For Edit Mode)
const InputField = ({ id, label, value, onChange, placeholder, type, min, max }: InputFieldProps) => (
    <div>
        <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-2">
            {label}
        </label>
        <input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            min={min}
            max={max}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition duration-150 bg-white shadow-sm"
        />
    </div>
);