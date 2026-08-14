import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/orders/myorders`, {
          headers: {
            Authorization: `Bearer ${user?.token}`
          }
        });
        
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        } else {
          toast.error('Failed to fetch orders');
        }
      } catch (error) {
        toast.error('Network error while fetching orders');
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Order Received': return 'bg-yellow-100 text-yellow-800';
      case 'In Kitchen': return 'bg-blue-100 text-blue-800';
      case 'Sent to Delivery': return 'bg-purple-100 text-purple-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center">Loading dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="bg-white p-8 rounded-2xl shadow-sm mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600">Email: {user?.email}</p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Order History</h2>

        {orders.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
            <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
            <a href="/menu" className="text-orange-600 font-bold hover:underline">Order some pizza now!</a>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b">
                  <div>
                    <p className="text-sm text-gray-500">Order #{order._id}</p>
                    <p className="text-sm font-medium text-gray-900">{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</p>
                  </div>
                  <div className="mt-4 sm:mt-0 flex items-center gap-4">
                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    <span className="font-bold text-lg">₹{order.totalPrice}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {order.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-sm">
                      <div>
                        <span className="font-bold">{item.quantity}x</span> {item.name}
                        {item.isCustom && item.customizations && (
                          <p className="text-xs text-gray-500 ml-5 mt-1">
                            {item.customizations.base}, {item.customizations.sauce}, {item.customizations.cheese}
                            {item.customizations.veggies?.length > 0 && `, ${item.customizations.veggies.join(', ')}`}
                          </p>
                        )}
                      </div>
                      <span className="text-gray-600">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;
