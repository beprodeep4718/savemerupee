import { Star, Quote } from 'lucide-react';

const reviews = [
  {
    name: 'Priya Sharma',
    role: 'Software Engineer',
    income: '₹35,000/month',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200',
    rating: 5,
    text: 'I always thought I earned too little to invest. WealthWise showed me how to save ₹5,000 monthly and invest smartly. In 8 months, I have built an emergency fund and started my SIP journey!',
    savings: '₹40,000 saved'
  },
  {
    name: 'Rahul Verma',
    role: 'Small Business Owner',
    income: '₹50,000/month',
    image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200',
    rating: 5,
    text: 'My credit card debt was killing me with 42% interest. My mentor helped me create a repayment plan. Cleared ₹1.2L debt in 9 months and now I\'m debt-free and investing regularly!',
    savings: 'Debt-free in 9 months'
  },
  {
    name: 'Anjali Reddy',
    role: 'Teacher',
    income: '₹28,000/month',
    image: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=200',
    rating: 5,
    text: 'Planning my sister wedding seemed impossible with my salary. WealthWise helped me plan for 18 months and I contributed ₹2 lakhs without taking a loan. Best decision ever!',
    savings: '₹2L for wedding'
  },
  {
    name: 'Vikram Singh',
    role: 'Delivery Executive',
    income: '₹22,000/month',
    image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200',
    rating: 5,
    text: 'Nobody taught me about money. WealthWise explained everything from basic savings to mutual funds. Now I invest ₹3,000 monthly and I am building wealth for my family future.',
    savings: 'Investing consistently'
  },
  {
    name: 'Meera Patel',
    role: 'Marketing Executive',
    income: '₹42,000/month',
    image: 'https://images.pexels.com/photos/1024311/pexels-photo-1024311.jpeg?auto=compress&cs=tinysrgb&w=200',
    rating: 5,
    text: 'I was spending everything I earned. My mentor helped me track expenses and cut unnecessary costs. Now I save 30% of my income and I am planning to buy my own car in 2 years!',
    savings: '30% monthly savings'
  },
  {
    name: 'Arjun Kumar',
    role: 'Freelance Designer',
    income: '₹38,000/month',
    image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=200',
    rating: 5,
    text: 'Irregular income made planning difficult. WealthWise taught me to budget for variable income. I now have 6 months emergency fund and invest in equity and gold consistently.',
    savings: '6-month emergency fund'
  }
];

export default function Reviews() {
  return (
    <section id="reviews" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Success Stories
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Real People, Real Results
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of Indians who transformed their financial lives, regardless of income level.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-50 to-emerald-50 rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition-all duration-300 relative"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-emerald-200" />

              <div className="flex items-center space-x-4 mb-6">
                <img
                  src={review.image}
                  alt={review.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-emerald-300"
                />
                <div>
                  <h4 className="font-bold text-gray-900">{review.name}</h4>
                  <p className="text-sm text-gray-600">{review.role}</p>
                  <p className="text-xs text-emerald-600 font-semibold">{review.income}</p>
                </div>
              </div>

              <div className="flex mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                ))}
              </div>

              <p className="text-gray-700 leading-relaxed mb-4">
                "{review.text}"
              </p>

              <div className="inline-block bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold">
                {review.savings}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
