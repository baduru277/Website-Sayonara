const steps = [
  {
    number: 1,
    title: "List Your Item",
    description: "Upload photos and describe what you're offering. Be honest about the condition and specify what you'd like to trade for.",
    icon: "📸",
    color: "bg-blue-100 text-blue-600",
    details: [
      "Take clear photos from multiple angles",
      "Write an honest, detailed description",
      "Set your trade preferences",
      "Choose your location for meetups"
    ]
  },
  {
    number: 2,
    title: "Find Matches",
    description: "Browse items from other users in your area. Use filters to find exactly what you're looking for.",
    icon: "🔍",
    color: "bg-green-100 text-green-600",
    details: [
      "Search by category, location, or keywords",
      "Filter by condition and trade preferences",
      "Save items you're interested in",
      "Get notified about new matches"
    ]
  },
  {
    number: 3,
    title: "Propose a Trade",
    description: "Send a trade offer with what you're willing to exchange. Include a message to explain your offer.",
    icon: "💬",
    color: "bg-purple-100 text-purple-600",
    details: [
      "Describe what you're offering",
      "Add a personal message",
      "Negotiate terms if needed",
      "Agree on meeting location and time"
    ]
  },
  {
    number: 4,
    title: "Meet & Trade",
    description: "Meet in a safe, public location to inspect items and complete your trade. Both parties should be satisfied.",
    icon: "🤝",
    color: "bg-orange-100 text-orange-600",
    details: [
      "Choose a safe, public meeting spot",
      "Inspect items thoroughly",
      "Complete the exchange",
      "Leave reviews for each other"
    ]
  }
];

const features = [
  {
    title: "Safe Trading",
    description: "Meet in public places, verify items, and use our rating system to ensure safe trades.",
    icon: "🛡️"
  },
  {
    title: "No Fees",
    description: "Sayonara is completely free to use. No listing fees, no transaction fees, no hidden costs.",
    icon: "💰"
  },
  {
    title: "Local Community",
    description: "Connect with people in your area for convenient meetups and building local relationships.",
    icon: "🏘️"
  },
  {
    title: "Sustainable",
    description: "Give items a second life instead of throwing them away. Reduce waste and save money.",
    icon: "🌱"
  },
  {
    title: "Easy Communication",
    description: "Built-in messaging system to negotiate trades and arrange meetups safely.",
    icon: "💬"
  },
  {
    title: "Trust System",
    description: "User ratings and reviews help you trade with confidence and build reputation.",
    icon: "⭐"
  }
];

const safetyTips = [
  {
    title: "Meet in Public",
    description: "Always meet in well-lit, public places like coffee shops, malls, or police station parking lots.",
    icon: "🏢"
  },
  {
    title: "Inspect Items",
    description: "Thoroughly examine items before agreeing to trade. Test electronics and check for damage.",
    icon: "🔍"
  },
  {
    title: "Trust Your Instincts",
    description: "If something feels off, don't proceed with the trade. Your safety comes first.",
    icon: "🧠"
  },
  {
    title: "Bring a Friend",
    description: "Consider bringing a friend or family member, especially for high-value trades.",
    icon: "👥"
  },
  {
    title: "Use Our Platform",
    description: "Keep all communication on Sayonara so we can help if issues arise.",
    icon: "📱"
  },
  {
    title: "Report Issues",
    description: "Report any suspicious activity or safety concerns immediately.",
    icon: "🚨"
  }
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 to-green-50 py-20">
          <div className="container text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              How Sayonara Works
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Join thousands of people who are trading items sustainably. 
              It&#39;s simple, safe, and completely free.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="sayonara-btn text-lg px-8 py-4">
                Start Trading Now
              </button>
              <button className="sayonara-btn text-lg px-8 py-4">
                Browse Items
              </button>
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-16 bg-white">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                The Trading Process
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Follow these simple steps to start trading on Sayonara
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <div key={step.number} className="relative">
                  <div className="text-center">
                    <div className={`w-20 h-20 ${step.color} rounded-full flex items-center justify-center mx-auto mb-4 text-3xl`}>
                      {step.icon}
                    </div>
                    
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                      {step.number}
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4">
                      {step.description}
                    </p>
                    
                    <ul className="text-left space-y-2">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="text-blue-600 mt-1">•</span>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Connector line */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gray-200 transform -translate-y-1/2 z-0"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Why Choose Sayonara?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Discover the benefits of sustainable trading
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Safety Section */}
        <section className="py-16 bg-white">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Safety First
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Your safety is our top priority. Follow these guidelines for secure trading.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {safetyTips.map((tip, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl mb-4">{tip.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {tip.title}
                  </h3>
                  <p className="text-gray-600">
                    {tip.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-green-600 text-white">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Sayonara by the Numbers
              </h2>
              <p className="text-xl opacity-90">
                Join our growing community of sustainable traders
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">10K+</div>
                <div className="text-blue-100">Active Traders</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">50K+</div>
                <div className="text-blue-100">Items Traded</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">95%</div>
                <div className="text-blue-100">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">$2M+</div>
                <div className="text-blue-100">Value Traded</div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gray-50">
          <div className="container max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-6">
              {[
                {
                  question: "Is Sayonara really free to use?",
                  answer: "Yes! Sayonara is completely free. There are no listing fees, transaction fees, or hidden costs. We believe sustainable trading should be accessible to everyone."
                },
                {
                  question: "How do I know if someone is trustworthy?",
                  answer: "We have a rating and review system. Check user profiles for their rating, number of trades, and reviews from other users. Always meet in public places and trust your instincts."
                },
                {
                  question: "What if I'm not satisfied with a trade?",
                  answer: "Communication is key. If you're not satisfied, discuss it with the other person. If you can't resolve it, you can report the issue to our support team."
                },
                {
                  question: "Can I trade for cash instead of items?",
                  answer: "Yes! Many users are open to cash offers. Just make sure to specify this in your trade proposal and agree on the amount before meeting."
                },
                {
                  question: "How do I report a problem?",
                  answer: "You can report issues through our support system. We take all reports seriously and will investigate any concerns about safety or platform misuse."
                }
              ].map((faq, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-white">
          <div className="container text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Start Trading?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of people who are already trading sustainably on Sayonara
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="sayonara-btn text-lg px-8 py-4">
                Create Account
              </button>
              <button className="sayonara-btn text-lg px-8 py-4">
                Browse Items
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
} 