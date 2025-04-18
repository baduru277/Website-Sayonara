import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';

import Footer from './components/Footer';

const Layout = ({ children }) => {
  return (
    <div className="App">
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;