import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Hero from './components/Hero';
import FeaturedListings from './components/FeaturedListings';
import CallToAction from './components/CallToAction';
import Testimonials from './components/Testimonials';
import ItemList from './components/ItemList';
import ExchangePage from "./pages/ExchangePage";
import BiddingPage from "./pages/BiddingPage";
import About from "./pages/About";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import FaqPage from "./components/FaqPage";
import DashboardPage from "./pages/DashboardPage"; // Imported DashboardPage
import Layout from './Layout';
import AuthPage from "./pages/AuthPage"; // Corrected import path for Layout component

function App() {
  return (
    <Router>
      <Routes>
        {/* Home Route */}
        <Route
          path="/"
          element={
            <Layout>
              <Hero />
              <ItemList />
              <FeaturedListings />
              <Testimonials />
              <CallToAction />
            </Layout>
          }
        />

        {/* Dashboard Route */}
        <Route path="/dashboard" element={<Layout><DashboardPage /></Layout>} />

        {/* Other Routes */}
        <Route path="/exchange" element={<Layout><ExchangePage /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/bidding" element={<Layout><BiddingPage /></Layout>} />
        <Route path="/faq" element={<Layout><FaqPage /></Layout>} />
        <Route path="/login" element={<Layout><LoginPage /></Layout>} />
        <Route path="/register" element={<Layout><RegisterPage /></Layout>} />
        <Route path="/authpage" element={<Layout><AuthPage /></Layout>} />


        {/* Catch-all Route for undefined paths */}
        <Route path="*" element={<Layout><div>404 - Page Not Found</div></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;