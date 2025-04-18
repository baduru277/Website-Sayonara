import React, { useState } from 'react';
import './FaqPage.css'; // External CSS for better styling

const FaqPage = () => {
  const [activeSection, setActiveSection] = useState(null);

  const toggleAnswer = (index) => {
    setActiveSection(activeSection === index ? null : index); // Toggle active section
  };

  const faqData = [
    {
      question: "What is this platform?",
      answer:
        "Our platform allows users to bid, barter, buy, and sell items with others. It’s a community-driven marketplace for exchanging goods and services.",
    },
    {
      question: "How do I sign up?",
      answer:
        "Click the 'Sign Up' button on the homepage, fill in your details, and confirm your email to create an account.",
    },
    {
      question: "Is there a fee to use the platform?",
      answer:
        "Signing up and browsing is free. However, transaction fees may apply depending on the type of activity. Check our Pricing page for details.",
    },
    {
      question: "How do I list an item for sale?",
      answer:
        "Go to your dashboard and click on 'List an Item.' Fill in the details, upload photos, set a price, and publish the listing.",
    },
    {
      question: "How can I find items to buy?",
      answer:
        "Use the search bar or browse through categories. You can also filter results by price, location, or item condition.",
    },
    {
      question: "How does bidding work?",
      answer:
        "Bidding allows buyers to place offers on items. Sellers can accept the highest bid or choose the best offer. Auctions have a set end date and time.",
    },
    {
      question: "What is bartering?",
      answer:
        "Bartering allows users to exchange goods or services directly without using money. Simply select 'Barter' when listing your item.",
    },
    {
      question: "How do I reset my password?",
      answer:
        "Click 'Forgot Password' on the login page and follow the instructions to reset your password.",
    },
    {
      question: "How do I report a suspicious user or item?",
      answer:
        "Use the 'Report' button on the user's profile or listing page. Our team will review the report promptly.",
    },
    {
      question: "How can I protect myself from scams?",
      answer: (
        <ul>
          <li>Always communicate through the platform.</li>
          <li>Avoid sharing personal contact details.</li>
          <li>Review user ratings and feedback before transactions.</li>
          <li>Use secure payment methods offered by the platform.</li>
        </ul>
      ),
    },
    // Add more questions and answers here
  ];

  return (
    <div className="faq-container">
      <h1>Frequently Asked Questions (FAQ)</h1>

      {faqData.map((faq, index) => (
        <section key={index} className="faq-section">
          <article className={`faq-item ${activeSection === index ? 'active' : ''}`}>
            <div className="question" onClick={() => toggleAnswer(index)}>
              <span className="question-mark">Q:</span> {faq.question}
            </div>
            {activeSection === index && (
              <div className="answer">
                <span className="answer-mark">A:</span> {faq.answer}
              </div>
            )}
          </article>
        </section>
      ))}
    </div>
  );
};

export default FaqPage;