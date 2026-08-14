import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

interface InventoryItem {
  _id: string;
  name: string;
  type: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
}

const Inventory = () => {
  const { user } = useAuth();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStock, setEditStock] = useState<number>(0);

  const fetchInventory = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/inventory`);
      if (res.ok) {
        const data = await res.json();
        setInventory(data);
      }
    } catch (error) {
      toast.error('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleUpdate = async (id: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/inventory/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`
        },
        body: JSON.stringify({ stock: editStock })
      });
      
      if (res.ok) {
        toast.success('Stock updated');
        setEditingId(null);
        fetchInventory();
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed to update stock');
      }
    } catch (error) {
      toast.error('Network error');
    }
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center">Loading Inventory...</div>;

  const renderTable = (type: string, title: string) => {
    const items = inventory.filter(i => i.type === type);
    return (
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4 capitalize text-gray-800">{title}</h3>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Item Name</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Current Stock</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {items.map(item => (
                <tr key={item._id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === item._id ? (
                      <input 
                        type="number" 
                        value={editStock} 
                        onChange={(e) => setEditStock(Number(e.target.value))}
                        className="w-20 px-2 py-1 border rounded text-sm"
                        min="0"
                      />
                    ) : (
                      <span className="text-lg">{item.stock}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.stock <= 0 ? (
                      <span className="px-2 py-1 text-xs font-bold bg-red-100 text-red-800 rounded-full">Out of Stock</span>
                    ) : item.stock <= item.lowStockThreshold ? (
                      <span className="px-2 py-1 text-xs font-bold bg-yellow-100 text-yellow-800 rounded-full">Low Stock</span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-bold bg-green-100 text-green-800 rounded-full">In Stock</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {editingId === item._id ? (
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => handleUpdate(item._id)} className="text-green-600 font-medium">Save</button>
                        <button onClick={() => setEditingId(null)} className="text-gray-500 font-medium">Cancel</button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => { setEditingId(item._id); setEditStock(item.stock); }} 
                        className="text-orange-600 font-medium hover:text-orange-900"
                      >
                        Update Stock
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Inventory Management</h1>
        {renderTable('base', 'Pizza Bases')}
        {renderTable('sauce', 'Sauces')}
        {renderTable('cheese', 'Cheese')}
        {renderTable('veggie', 'Vegetables')}
      </div>
    </div>
  );
};

export default Inventory;
