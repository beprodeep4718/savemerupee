import { Flame, AlertCircle, Rocket, Zap } from 'lucide-react';

export default function IdealStudent() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Who should take this <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">Subscription ?</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            If any of these describe your situation, you're in the right place. This subscription is designed for people ready to transform their financial future.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Card 1 */}
          <div className="group bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 border-2 border-orange-200 hover:border-orange-400 hover:shadow-xl transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 group-hover:scale-110 transition-transform">
                  <Flame className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Want to Fix Bad Financial Habits?
                </h3>
                <p className="text-gray-700 mb-4">
                  Overspending, impulsive purchases, no savings plan? We'll help you break the cycle and build sustainable financial discipline that lasts a lifetime.
                </p>
                <div className="text-sm text-orange-600 font-semibold flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-orange-600 rounded-full"></span>
                  Stop the bleeding, start building wealth
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-8 border-2 border-red-200 hover:border-red-400 hover:shadow-xl transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 group-hover:scale-110 transition-transform">
                  <AlertCircle className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Trapped in Loans & Debt?
                </h3>
                <p className="text-gray-700 mb-4">
                  Credit cards, personal loans, EMIs suffocating your income? Learn the exact strategies to escape debt traps and create breathing room for your future.
                </p>
                <div className="text-sm text-red-600 font-semibold flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-red-600 rounded-full"></span>
                  Break free from the debt cycle
                </div>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 border-2 border-emerald-200 hover:border-emerald-400 hover:shadow-xl transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 group-hover:scale-110 transition-transform">
                  <Rocket className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Looking to save lakhs in tax?
                </h3>
                <p className="text-gray-700 mb-4">
                  Our expert CAs guide you throughout the year with smart tax-saving decisions and help you file your ITR so you save more in tax and stress less.
                </p>
                <div className="text-sm text-emerald-600 font-semibold flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-emerald-600 rounded-full"></span>
                  Freedom is just one strategy away
                </div>
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="group bg-gradient-to-br from-violet-50 to-indigo-50 rounded-2xl p-8 border-2 border-violet-200 hover:border-violet-400 hover:shadow-xl transition-all duration-300">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 group-hover:scale-110 transition-transform">
                  <Zap className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Want Crores Through Systematic Investment and dream of retiring early?
                </h3>
                <p className="text-gray-700 mb-4">
                  Build generational wealth through proven, systematic investment strategies and retire much earlier than you ever imagined.
                </p>
                <div className="text-sm text-violet-600 font-semibold flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-violet-600 rounded-full"></span>
                  Small steps, massive wealth accumulation
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
