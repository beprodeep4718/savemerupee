import { Check, ArrowRight } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const benefits = [
  "10 personalized video consultations with expert mentors",
  "Unlimited chat support for urgent financial questions",
  "Year-long tax saving strategies and planning",
  "Professional CA support for tax filing (nominal extra charge)",
  "Permanent access to exclusive financial community",
  "Proven strategies to escape debt and build wealth",
];

export default function CTA() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  const targetPath = "/payment";

  const handleGetStarted = async () => {
    setProcessing(true);
    if (!isAuthenticated) {
      const redirectPath = encodeURIComponent(targetPath);
      navigate(`/login?redirect=${redirectPath}`);
      setProcessing(false);
      return;
    }
    navigate(targetPath);
    setProcessing(false);
  };

  return (
    <section className="py-24 bg-linear-to-br from-emerald-600 via-emerald-700 to-teal-700 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Financial Life?
          </h2>
          <p className="text-xl text-emerald-50 leading-relaxed">
            Join hundreds of Indians who've already taken control of their
            finances and built lasting wealth with our proven mentorship
            program.
          </p>
        </div>
        <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-8 lg:p-12">
          <div className="text-center mb-10">
            <div className="inline-flex items-baseline gap-2 mb-4">
              <span className="text-5xl font-bold text-gray-900">₹1,499</span>
              <span className="text-xl text-gray-500 line-through">₹2,999</span>
            </div>
            <p className="text-emerald-600 font-semibold text-lg">
              Limited Time Offer - 50% Off
            </p>
            <p className="text-emerald-600 font-semibold text-lg">
              125/ month - half of your monthly mobile bill
            </p>
          </div>
          <div className="space-y-4 mb-10">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mt-0.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-gray-700 leading-relaxed">{benefit}</span>
              </div>
            ))}
          </div>
          <button
            onClick={handleGetStarted}
            disabled={processing}
            className="w-full bg-emerald-600 text-white px-8 py-5 rounded-xl text-lg font-semibold hover:bg-emerald-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? "Processing..." : "Get Started Now"}
            {!processing && (
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            )}
          </button>
        </div>
        <div className="mt-16 text-center">
          <p className="text-emerald-50 text-lg">
            Have questions? email{" "}
            <span className="font-semibold">hello@yourcompany.com</span>
          </p>
        </div>
      </div>
    </section>
  );
}
