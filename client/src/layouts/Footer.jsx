import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-primary text-white pt-12 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <span className="text-2xl font-bold tracking-tight">StayEase</span>
            <p className="mt-4 text-[#a9c9f2] text-sm max-w-sm leading-relaxed">
              Experience the best in hospitality. We provide seamless room booking for travelers who value efficiency, clarity, and comfort.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-accent">Quick Links</h3>
            <ul className="space-y-2 text-sm text-[#a9c9f2]">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/rooms" className="hover:text-white transition-colors">Our Rooms</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Log In</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-accent">Contact</h3>
            <ul className="space-y-2 text-sm text-[#a9c9f2]">
              <li>support@stayease.com</li>
              <li>+1 (555) 123-4567</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-[#1a3c5e] text-center text-sm text-[#a9c9f2]">
          <p>&copy; {new Date().getFullYear()} StayEase. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
