import { Gift, Users, TrendingUp, Award } from 'lucide-react';

export default function ReferralProgram() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <Gift className="w-12 h-12 text-emerald-600" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            How to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">Earn Money From Us</span>
          </h2>
          {/* <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Share the wisdom, earn the rewards. Our referral program makes it easy to help friends while boosting your earnings.
          </p> */}
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Left - How It Works */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
              How It Works
            </h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <span className="font-bold text-emerald-600">1</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Share Your Referral Code</p>
                  <p className="text-gray-600 text-sm">Send your referral link to friends</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <span className="font-bold text-emerald-600">2</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">They Enroll in Course</p>
                  <p className="text-gray-600 text-sm">Friends purchase using your link</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <span className="font-bold text-emerald-600">3</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Earn ₹200 Cashback</p>
                  <p className="text-gray-600 text-sm">Get instant cashback per referral</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Rewards */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow text-white">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Award className="w-6 h-6" />
              Earn Unlimited Cash Rewards
            </h3>
            <div className="space-y-6">
              <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-sm font-semibold opacity-90 mb-1">Per Referral</p>
                <p className="text-4xl font-bold">₹200</p>
                <p className="text-sm opacity-80 mt-1">Flat Cashback</p>
              </div>

              <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm border-2 border-white/40">
                <p className="text-sm font-semibold opacity-90 mb-1">Refer 8 Friends</p>
                <p className="text-2xl font-bold">Earn More Than Subscription Fees</p>
                <p className="text-sm opacity-80 mt-1">Save ₹1,499</p>
              </div>

              <div className="text-center pt-4">
                <p className="text-sm opacity-90">
                  <span className="font-bold">Total Earnings:</span> Unlimited, Sky is the Limit!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-600" />
            Referral Milestones
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="bg-emerald-50 rounded-xl p-4 mb-3">
                <p className="text-2xl font-bold text-emerald-600">1</p>
              </div>
              <p className="text-sm text-gray-600">1st Referral</p>
              <p className="font-semibold text-emerald-600">₹200</p>
            </div>
            <div className="text-center">
              <div className="bg-emerald-100 rounded-xl p-4 mb-3">
                <p className="text-2xl font-bold text-emerald-700">3</p>
              </div>
              <p className="text-sm text-gray-600">3 Referrals</p>
              <p className="font-semibold text-emerald-600">₹600</p>
            </div>
            <div className="text-center">
              <div className="bg-emerald-200 rounded-xl p-4 mb-3">
                <p className="text-2xl font-bold text-emerald-800">5</p>
              </div>
              <p className="text-sm text-gray-600">5 Referrals</p>
              <p className="font-semibold text-emerald-600">₹1,000</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl p-4 mb-3">
                <p className="text-2xl font-bold text-white">8+</p>
              </div>
              <p className="text-sm text-gray-600">8 Referrals</p>
              <p className="font-semibold text-emerald-600">FREE COURSE</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        {/* <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">Ready to start earning? Join thousands of students already making money through referrals.</p>
          <button className="inline-block px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:shadow-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105">
            Get Your Referral Link
          </button>
        </div> */}
      </div>
    </section>
  );
}
