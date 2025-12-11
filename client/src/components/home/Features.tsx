import { Shield, TrendingUp, Users, CreditCard, Target, Lightbulb, Calculator, Award } from 'lucide-react';

const features = [
  {
    icon: Target,
    title: 'Fix Spending Habits',
    description: 'We closely monitor your financial patterns and help you build sustainable, wealth-building habits that stick.',
  },
  {
    icon: CreditCard,
    title: 'Smart Money Management',
    description: 'Master your UPI and credit card usage with real-time guidance to prevent overspending and maximize rewards.',
  },
  {
    icon: Lightbulb,
    title: 'Big Decision Support',
    description: 'Buying a car? Planning a wedding? Get expert advice before making costly financial decisions.',
  },
  {
    icon: Shield,
    title: 'Escape Loan Traps',
    description: "Already drowning in debt? We'll create a personalized strategy to break free and regain control.",
  },
  {
    icon: TrendingUp,
    title: 'Wealth Building Guidance',
    description: 'Learn proven strategies to save consistently, invest wisely, and build long-term wealth.',
  },
  {
    icon: Calculator,
    title: 'Maximize Tax Returns',
    description: 'Year-round tax planning with expert CAs ensures you keep more of what you earn, legally.',
  },
  {
    icon: Award,
    title: 'Expert CA Support',
    description: 'Access professional chartered accountants for tax filing at the best possible rates.',
  },
  {
    icon: Users,
    title: 'Lifetime Community',
    description: 'Join a thriving community of financially educated individuals. Learn together, grow together.',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            What Makes Us Different?
          </h2>
          {/* <p className="text-xl text-gray-600 leading-relaxed">
            We don't just give advice and disappear. We walk alongside you for an entire year, ensuring you build lasting financial habits and achieve real results.
          </p> */}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:border-emerald-200 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-5 group-hover:bg-emerald-600 transition-colors">
                <feature.icon className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
