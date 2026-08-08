import { Pizza } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Pizza className="h-8 w-8 text-orange-500" />
              <span className="font-bold text-xl">Slice Haven</span>
            </div>
            <p className="text-gray-400 text-sm">
              Delivering the best artisanal pizzas straight to your door. Fresh ingredients, perfect crust.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/menu" className="hover:text-orange-500 transition-colors">Our Menu</a></li>
              <li><a href="/builder" className="hover:text-orange-500 transition-colors">Custom Builder</a></li>
              <li><a href="/login" className="hover:text-orange-500 transition-colors">Login / Register</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>123 Pizza Street, Food City</li>
              <li>Phone: +1 234 567 8900</li>
              <li>Email: hello@slicehaven.com</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Hours</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Mon - Fri: 11:00 AM - 10:00 PM</li>
              <li>Sat - Sun: 11:00 AM - 11:00 PM</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Slice Haven. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
