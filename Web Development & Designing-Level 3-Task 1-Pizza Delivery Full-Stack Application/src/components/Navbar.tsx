import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Pizza, ShoppingCart, User, LogOut, Menu as MenuIcon, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Pizza className="h-8 w-8 text-orange-600" />
              <span className="font-bold text-xl text-gray-900">Slice Haven</span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/menu" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">Menu</Link>
            <Link to="/builder" className="text-gray-700 hover:text-orange-600 transition-colors font-medium">Custom Builder</Link>
            
            <Link to="/cart" className="relative text-gray-700 hover:text-orange-600 transition-colors">
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                <Link to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} className="flex items-center gap-1 text-gray-700 hover:text-orange-600 transition-colors font-medium">
                  <User className="h-5 w-5" />
                  <span>{user.name}</span>
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-1 text-gray-700 hover:text-orange-600 transition-colors font-medium">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex gap-4">
                <Link to="/login" className="text-gray-700 hover:text-orange-600 font-medium pt-2">Login</Link>
                <Link to="/register" className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors font-medium">Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            <Link to="/cart" className="relative text-gray-700">
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-700">
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/menu" className="block px-3 py-2 text-gray-700 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Menu</Link>
            <Link to="/builder" className="block px-3 py-2 text-gray-700 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Custom Builder</Link>
            {user ? (
              <>
                <Link to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} className="block px-3 py-2 text-gray-700 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
                <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-gray-700 font-medium">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-2 text-gray-700 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                <Link to="/register" className="block px-3 py-2 text-orange-600 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
