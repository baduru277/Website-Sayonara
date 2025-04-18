import React from 'react';
import './CallToAction.css'; // Create a separate CSS file for styles

function CallToAction() {
  return (
    <section className="call-to-action">
      <div className="cta-content">
        <h2>Join Our Community</h2>
        <p>Sign up today to start bidding, exchanging, and experience the future of trade.</p>
        <button className="btn-cta">Join Now</button>
      </div>
    </section>
  );
}

export default CallToAction;
