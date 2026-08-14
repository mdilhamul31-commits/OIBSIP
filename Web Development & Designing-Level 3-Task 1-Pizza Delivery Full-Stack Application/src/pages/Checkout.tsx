import React from "react";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Checkout = () => {
  const { cart, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    loadRazorpayScript().then(res => setScriptLoaded(res as boolean));
  }, []);

  const taxPrice = Math.round(subtotal * 0.05);
  const shippingPrice = 40;
  const totalPrice = subtotal + taxPrice + shippingPrice;

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!scriptLoaded) {
      toast.error('Razorpay SDK failed to load. Are you online?');
      return;
    }

    setLoading(true);

    try {
      // 1. Create order on our server
      const orderRes = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/payments/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`
        },
        body: JSON.stringify({ amount: totalPrice })
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.message);

      // 1.5 Fetch Razorpay Key
      const configRes = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/payments/config`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      const { keyId } = await configRes.json();

      // 2. Initialize Razorpay Checkout
      const options = {
        key: keyId, 
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Slice Haven",
        description: "Test Transaction for Pizza Delivery",
        order_id: orderData.id,
        handler: async function (response: any) {
          // 3. Verify Payment
          try {
            const verifyRes = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/payments/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user?.token}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            if (!verifyRes.ok) throw new Error('Payment verification failed');

            // 4. Save Final Order to DB
            const saveOrderRes = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/orders`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user?.token}`
              },
              body: JSON.stringify({
                items: cart,
                deliveryInfo: { address, city, phone },
                paymentMethod: 'Razorpay',
                itemsPrice: subtotal,
                taxPrice,
                shippingPrice,
                totalPrice,
                paymentResult: {
                  id: response.razorpay_payment_id,
                  status: 'Success',
                  update_time: new Date().toISOString()
                }
              })
            });

            if (saveOrderRes.ok) {
              toast.success('Payment successful! Order placed.');
              clearCart();
              navigate('/dashboard'); // or order history
            } else {
              throw new Error('Failed to save order');
            }
          } catch (err: any) {
            toast.error(err.message || 'Payment processing failed');
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: phone
        },
        theme: {
          color: "#ea580c" // orange-600
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        toast.error(`Payment Failed: ${response.error.description}`);
      });
      rzp.open();

    } catch (error: any) {
      toast.error(error.message || 'Error initializing payment');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Checkout</h1>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <form onSubmit={handlePayment} className="space-y-8">
            <div>
              <h2 className="text-xl font-bold mb-4">Delivery Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                    placeholder="123 Pizza Street, Apt 4B"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-8">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div className="space-y-2 text-gray-600 mb-4">
                  <div className="flex justify-between">
                    <span>Items Total ({cart.length})</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>₹{taxPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span>₹{shippingPrice}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center border-t pt-4 font-bold text-xl">
                  <span>Total Amount</span>
                  <span className="text-orange-600">₹{totalPrice}</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-700 transition-colors shadow-md disabled:opacity-50"
            >
              {loading ? 'Processing...' : `Pay ₹${totalPrice} (Test Mode)`}
            </button>
            <p className="text-center text-xs text-gray-400">Do not use real payment details. This is a sandbox environment.</p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
