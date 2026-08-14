import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { Users, ShoppingBag, DollarSign, Package } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/orders`, {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        
        if (res.ok) {
          const orders = await res.json();
          const totalRevenue = orders.reduce((acc: number, o: any) => acc + o.totalPrice, 0);
          const pendingOrders = orders.filter((o: any) => o.status !== 'Delivered' && o.status !== 'Cancelled').length;
          
          setStats({
            totalOrders: orders.length,
            totalRevenue,
            pendingOrders
          });
        }
      } catch (error) {
        toast.error('Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAdminData();
  }, [user]);

  if (loading) return <div className="min-h-screen flex justify-center items-center">Loading Admin...</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
            <div className="bg-blue-100 p-4 rounded-full text-blue-600"><ShoppingBag className="w-8 h-8" /></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Orders</p>
              <p className="text-2xl font-bold">{stats.totalOrders}</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
            <div className="bg-green-100 p-4 rounded-full text-green-600"><DollarSign className="w-8 h-8" /></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
              <p className="text-2xl font-bold">₹{stats.totalRevenue}</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
            <div className="bg-orange-100 p-4 rounded-full text-orange-600"><Package className="w-8 h-8" /></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Active Orders</p>
              <p className="text-2xl font-bold">{stats.pendingOrders}</p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/admin/orders" className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow group">
            <h3 className="text-xl font-bold mb-2 group-hover:text-orange-600">Manage Orders &rarr;</h3>
            <p className="text-gray-600">View and update customer order statuses.</p>
          </Link>
          
          <Link to="/admin/inventory" className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow group">
            <h3 className="text-xl font-bold mb-2 group-hover:text-orange-600">Manage Inventory &rarr;</h3>
            <p className="text-gray-600">Update stock levels for bases, sauces, cheese, and veggies.</p>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
