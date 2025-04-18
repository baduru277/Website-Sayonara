import React from 'react';
import './KeyFeatures.css';

const KeyFeatures = () => (
    <section className="key-features">
        {/*<div className="feature">*/}
        {/*  <i className="icon">🌟</i>*/}
        {/*  <h3>Celebrity Auctions</h3>*/}
        {/*  <p>Exclusive items from your favorite celebrities.</p>*/}
        {/*</div>*/}
        {/*<div className="feature">*/}
        {/*  <i className="icon">🔄</i>*/}
        {/*  <h3>Bulk Exchange</h3>*/}
        {/*  <p>Efficient trading for bulk items.</p>*/}
        {/*</div>*/}
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
    </section>
);

export default KeyFeatures;
