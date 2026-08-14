import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, subtotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please login to continue checkout');
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-6">🛒</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">Looks like you haven't added any pizzas to your cart yet.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/menu" className="bg-orange-600 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-700 transition-colors">
              Browse Menu
            </Link>
            <Link to="/builder" className="bg-white text-orange-600 border-2 border-orange-600 px-8 py-3 rounded-full font-bold hover:bg-orange-50 transition-colors">
              Build Custom Pizza
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <img 
                  src={item.image || 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&q=80&w=200'} 
                  alt={item.name} 
                  className="w-24 h-24 object-cover rounded-xl"
                />
                
                <div className="flex-grow">
                  <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                  {item.isCustom && item.customizations && (
                    <div className="text-sm text-gray-500 mt-1 space-y-1">
                      <p><span className="font-medium">Base:</span> {item.customizations.base}</p>
                      <p><span className="font-medium">Sauce:</span> {item.customizations.sauce}</p>
                      <p><span className="font-medium">Cheese:</span> {item.customizations.cheese}</p>
                      {item.customizations.veggies && item.customizations.veggies.length > 0 && (
                        <p><span className="font-medium">Veggies:</span> {item.customizations.veggies.join(', ')}</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 hover:bg-gray-50 text-gray-600 rounded-l-lg transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-medium">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 hover:bg-gray-50 text-gray-600 rounded-r-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="text-lg font-bold w-24 text-right">
                    ₹{item.price * item.quantity}
                  </div>

                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 p-2 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
              
              <div className="space-y-4 text-gray-600 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (5%)</span>
                  <span>₹{Math.round(subtotal * 0.05)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>₹40</span>
                </div>
                
                <div className="border-t border-gray-200 pt-4 flex justify-between font-bold text-lg text-gray-900">
                  <span>Total</span>
                  <span className="text-orange-600">₹{subtotal + Math.round(subtotal * 0.05) + 40}</span>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-orange-700 transition-colors shadow-md"
              >
                Proceed to Checkout <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
