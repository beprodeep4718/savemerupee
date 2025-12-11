import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Button } from '@/components/ui/button';

const countryCodes = [
  { code: '+1', country: 'US/CA', flag: '🇺🇸' },
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+86', country: 'China', flag: '🇨🇳' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
];

function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard';

  const { sendOTP, verifyOTP, isLoading, error, clearError, isAuthenticated } = useAuthStore();

  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectPath]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!phoneNumber) {
      return;
    }

    const fullPhoneNumber = countryCode + phoneNumber;
    const result = await sendOTP(fullPhoneNumber);
    if (result.success) {
      setStep('otp');
      setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    const otpCode = otpDigits.join('');
    if (otpCode.length !== 6) {
      return;
    }

    const fullPhoneNumber = countryCode + phoneNumber;
    const result = await verifyOTP(fullPhoneNumber, otpCode);
    if (result.success) {
      navigate(redirectPath, { replace: true });
    }
  };

  const handleBack = () => {
    setStep('phone');
    setOtpDigits(['', '', '', '', '', '']);
    clearError();
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }

    if (!/^\d*$/.test(value)) {
      return;
    }

    const newOtpDigits = [...otpDigits];
    newOtpDigits[index] = value;
    setOtpDigits(newOtpDigits);

    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtpDigits = [...otpDigits];
    pastedData.split('').forEach((char, idx) => {
      if (idx < 6) newOtpDigits[idx] = char;
    });
    setOtpDigits(newOtpDigits);

    const nextEmpty = newOtpDigits.findIndex(d => !d);
    if (nextEmpty !== -1) {
      otpInputRefs.current[nextEmpty]?.focus();
    } else {
      otpInputRefs.current[5]?.focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 to-green-100 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-emerald-600 mb-2">Welcome Back</h1>
            <p className="text-gray-600">
              {step === 'phone'
                ? 'Enter your phone number to continue'
                : 'Enter the verification code'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {step === 'phone' ? (
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="px-3 py-3 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition bg-white text-sm font-medium"
                    disabled={isLoading}
                  >
                    {countryCodes.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.flag} {country.code}
                      </option>
                    ))}
                  </select>
                  <input
                    id="phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="5551234567"
                    className="flex-1 px-4 py-3 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                    required
                    disabled={isLoading}
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Enter your phone number without country code
                </p>
              </div>

              <Button
                type="submit"
                className="w-full py-6 text-lg font-semibold"
                disabled={isLoading || !phoneNumber}
              >
                {isLoading ? 'Sending...' : 'Send Verification Code'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                  Verification Code
                </label>
                <div className="flex gap-2 justify-center mb-2">
                  {otpDigits.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        otpInputRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      onPaste={index === 0 ? handleOtpPaste : undefined}
                      className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                      disabled={isLoading}
                    />
                  ))}
                </div>
                <p className="mt-3 text-sm text-gray-500 text-center">
                  Code sent to {countryCode} {phoneNumber}
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  type="submit"
                  className="w-full py-6 text-lg font-semibold"
                  disabled={isLoading || otpDigits.join('').length !== 6}
                >
                  {isLoading ? 'Verifying...' : 'Verify & Login'}
                </Button>

                <button
                  type="button"
                  onClick={handleBack}
                  className="w-full py-3 text-gray-600 hover:text-gray-900 font-medium transition"
                  disabled={isLoading}
                >
                  Change Phone Number
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-emerald-600 hover:text-emerald-700 font-medium transition"
            >
              ← Back to Home
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}

export default Login;
