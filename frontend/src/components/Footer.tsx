import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-purple-700 text-white pt-12 pb-6 w-full">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-10 mb-10">
          {/* Brand */}
          <div className="mb-8 md:mb-0 flex-1 min-w-[220px] text-center md:text-left">
            <span className="text-2xl font-extrabold text-white drop-shadow-lg">Sayonara</span>
            <p className="text-white/80 mb-6 max-w-md mt-4">
              The sustainable marketplace where you can trade, barter, and resell items. Join our community and give new life to your belongings.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex-1 min-w-[180px] text-center md:text-left">
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-white hover:underline transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/features" className="text-white hover:underline transition-colors">Features</Link>
              </li>
              <li>
                <Link href="/about" className="text-white hover:underline transition-colors">About</Link>
              </li>
              <li>
                <Link href="/contact" className="text-white hover:underline transition-colors">Contact</Link>
              </li>
              <li>
                <Link href="/faq" className="text-white hover:underline transition-colors">FAQ</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-purple-400 pt-8 text-center mt-8">
          <p className="text-white/80">
            © 2025 Sayonara. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
} 