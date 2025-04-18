import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import Header from './components/Header';
import Hero from './components/Hero';
import KeyFeatures from './components/KeyFeatures';
import FeaturedListings from './components/FeaturedListings';
import CallToAction from './components/CallToAction';
import Testimonials from './components/Testimonials';
import ItemList from './components/ItemList';
import Footer from './components/Footer';

const Home = () => {
  return (
    <div className="Home">
      <Header />
      <Hero />
      <KeyFeatures />
      <FeaturedListings />
      <ItemList />

      {/* Link to ExchangePage */}
      <div className="mt-6">
        <Link to="/ExchangePage">
          <button className="px-4 py-2 bg-blue-500 text-white rounded">Go to Exchange Page</button>
        </Link>
          <Link to="/DashboardPage">
          <button className="px-4 py-2 bg-blue-500 text-white rounded">Go to Dashboard Page</button>
        </Link>
      </div>

      <CallToAction />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Home;