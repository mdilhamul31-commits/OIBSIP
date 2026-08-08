import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/orders`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/orders/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}` 
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        toast.success('Order status updated');
        fetchOrders();
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      toast.error('Network error');
    }
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center">Loading Orders...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Orders</h1>

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b gap-4">
                <div>
                  <p className="font-bold text-lg">Order #{order._id}</p>
                  <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                  <p className="text-sm font-medium mt-1">Customer: {order.user?.name} ({order.user?.email})</p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <span className="font-bold text-lg">Total: ₹{order.totalPrice}</span>
                  <select 
                    value={order.status}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg text-sm font-medium bg-gray-50 focus:outline-none focus:border-orange-500"
                  >
                    <option value="Order Received">Order Received</option>
                    <option value="In Kitchen">In Kitchen</option>
                    <option value="Sent to Delivery">Sent to Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-bold mb-2">Items</h4>
                  <ul className="space-y-2">
                    {order.items.map((item: any, idx: number) => (
                      <li key={idx} className="text-sm flex justify-between bg-gray-50 p-2 rounded">
                        <span>
                          <span className="font-bold">{item.quantity}x</span> {item.name}
                          {item.isCustom && item.customizations && (
                            <span className="block text-xs text-gray-500 mt-1">
                              {item.customizations.base}, {item.customizations.sauce}, {item.customizations.cheese}
                              {item.customizations.veggies?.length > 0 && `, ${item.customizations.veggies.join(', ')}`}
                            </span>
                          )}
                        </span>
                        <span className="font-medium text-gray-700">₹{item.price * item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-bold mb-2">Delivery Details</h4>
                  <div className="bg-gray-50 p-4 rounded text-sm text-gray-700">
                    <p className="font-medium mb-1">Address:</p>
                    <p>{order.deliveryInfo.address}</p>
                    <p>{order.deliveryInfo.city}</p>
                    <p className="mt-2"><span className="font-medium">Phone:</span> {order.deliveryInfo.phone}</p>
                    <p className="mt-2"><span className="font-medium">Payment ID:</span> <span className="font-mono text-xs">{order.paymentResult?.id}</span></p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {orders.length === 0 && <p className="text-center text-gray-500">No orders found.</p>}
        </div>
      </div>
    </div>
  );
};

export default Orders;
