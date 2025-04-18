import React from 'react';
import './Testimonials.css';

const testimonialsData = [
  {
    quote: 'Sayanaro Bazaar is a game-changer! I’ve been able to trade easily and securely.',
    image: 'user1.jpg',
    name: 'User 1'
  },
  {
    quote: 'A fantastic platform! The barter system makes trading so much easier.',
    image: 'user2.jpg',
    name: 'User 2'
  },
  {
    quote: 'The bidding feature is amazing! I was able to get exactly what I wanted.',
    image: 'user3.jpg',
    name: 'User 3'
  },
  // Add more testimonials as needed
];

const Testimonials = () => (
  <section className="testimonials">
    <h2>User Testimonials</h2>
    <div className="testimonial-grid">
      {testimonialsData.map((testimonial, index) => (
        <div className="testimonial-item" key={index}>
          <p className="quote">"{testimonial.quote}"</p>
          <img
            src={testimonial.image}
            className="rounded-circle"
            alt={testimonial.name}
          />
          <p className="name">{testimonial.name}</p>
        </div>
      ))}
    </div>
  </section>
);

export default Testimonials;
