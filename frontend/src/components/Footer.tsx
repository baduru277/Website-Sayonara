import React from 'react';

export default function Footer() {
  return (
    <footer
      style={{
        backgroundImage: 'linear-gradient(to right, #7F53AC, #647DEE)',
      }}
      className="text-white py-6 mt-10"
    >
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2">
        <span className="font-bold text-lg">© {new Date().getFullYear()} Sayonara. All rights reserved.</span>
        <div className="flex gap-4 mt-2 md:mt-0 items-center">
          <a href="mailto:contact@sayonaraa.com" className="hover:underline">contact@sayonaraa.com</a>
          <a href="/privacy" className="hover:underline">Privacy Policy</a>
          <a href="/terms" className="hover:underline">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
