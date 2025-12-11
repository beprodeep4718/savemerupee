import { CreditCard, Phone, FileText, Video, MessageCircle, Trophy } from 'lucide-react';

const steps = [
  {
    icon: CreditCard,
    title: 'Make Your Payment',
    description: 'Invest in your financial future with a simple, secure payment.',
  },
  {
    icon: Phone,
    title: 'We Call You Back', 
    description: "Within 24 hours, we'll reach out to schedule your onboarding.",
  },
  {
    icon: FileText,
    title: 'Share Your Financial Story',
    description: 'Tell us about your income, expenses, goals, and challenges. Everything stays confidential.',
  },
  {
    icon: Video,
    title: 'Video Consultation',
    description: 'Get a personalized financial plan crafted specifically for your situation.',
  },
  {
    icon: MessageCircle,
    title: 'Year-Long Support',
    description: '10+ video meetings + unlimited chat with mentors and CAs whenever you need guidance.',
  },
  {
    icon: Trophy,
    title: 'Achieve Financial Freedom',
    description: 'Watch your savings grow, debts disappear, and confidence soar.',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-linear-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Your Journey to Financial Freedom
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Simple, proven process. Real results in 6 months.
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-linear-to-b from-emerald-200 via-emerald-300 z-1 to-emerald-200"></div>

          <div className="space-y-16">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex flex-col lg:flex-row items-center gap-8 ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}
              >
                <div className="flex-1 lg:text-right lg:pr-12">
                  {index % 2 === 0 && (
                    <div className="lg:block hidden">
                      <StepContent step={step} index={index} />
                    </div>
                  )}
                </div>

                <div className="relative z-10 shrink-0">
                  <div className="w-20 h-20 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-110 transition-transform">
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center font-bold text-emerald-800 text-sm">
                    {index + 1}
                  </div>
                </div>

                <div className="flex-1 z-10 lg:pl-12">
                  <div className="lg:hidden block">
                    <StepContent step={step} index={index} />
                  </div>
                  {index % 2 !== 0 && (
                    <div className="lg:block hidden">
                      <StepContent step={step} index={index} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StepContent({ step }: { step: typeof steps[0]; index: number }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
      <h3 className="text-2xl font-bold text-gray-900 mb-3">
        {step.title}
      </h3>
      <p className="text-gray-600 leading-relaxed text-lg">
        {step.description}
      </p>
    </div>
  );
}
