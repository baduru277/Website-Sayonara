import React from 'react';
import './About.css'; // Make sure to style the page using a dedicated CSS file

const Page = () => (
    <section className="about-page">
        <div className="about-section">
            <h2>About Us</h2>
            <p>
                Welcome to <strong>[Your Platform Name]</strong>, a dynamic and innovative marketplace designed to revolutionize
                the way people trade, bid, and connect. Whether you’re looking to exchange goods, participate in exciting auctions,
                or simply buy and sell, our platform provides a seamless, secure, and user-friendly experience.
            </p>
            <p>
                Our mission is to empower individuals and communities by creating a transparent and flexible trading ecosystem.
                By combining traditional bartering with modern e-commerce and bidding technology, we make trading simple, effective,
                and accessible for everyone.
            </p>
            <p>
                Join us today and experience the future of trading—where innovation meets tradition, and every transaction creates a story.
            </p>
        </div>

        <div className="key-features">
            <h2>Key Features</h2>
            <div className="feature">
                <i className="icon">🔒</i>
                <h3>Secure Bidding</h3>
                <p>Transparent and secure bidding process.</p>
            </div>
            <div className="feature">
                <i className="icon">🤝</i>
                <h3>Barter System</h3>
                <p>Exchange items with ease.</p>
            </div>
            <div className="feature">
                <i className="icon">🛒</i>
                <h3>Buy/Sell</h3>
                <p>Seamlessly list, browse, and purchase items with a secure and user-friendly experience.</p>
            </div>
        </div>
    </section>
);

export default Page;
