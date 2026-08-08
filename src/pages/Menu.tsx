import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

interface Pizza {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  ingredients: string[];
  isAvailable: boolean;
}

const Menu = () => {
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/pizzas`);
        if (res.ok) {
          const data = await res.json();
          setPizzas(data);
        }
      } catch (error) {
        toast.error('Failed to load menu');
      } finally {
        setLoading(false);
      }
    };
    fetchPizzas();
  }, []);

  const handleAdd = (pizza: Pizza) => {
    addToCart({
      id: `pizza_${pizza._id}_${Date.now()}`,
      pizzaId: pizza._id,
      name: pizza.name,
      price: pizza.price,
      quantity: 1,
      isCustom: false,
      image: pizza.image
    });
    toast.success(`${pizza.name} added to cart`);
  };

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center">Loading menu...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Menu</h1>
          <p className="text-gray-600">Choose from our signature pizzas.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pizzas.map((pizza) => (
            <div key={pizza._id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
              <div className="relative h-56 overflow-hidden">
                <img src={pizza.image} alt={pizza.name} className="w-full h-full object-cover" />
                {!pizza.isAvailable && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-bold text-lg bg-red-600 px-4 py-1 rounded-full">Out of Stock</span>
                  </div>
                )}
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{pizza.name}</h3>
                  <span className="text-lg font-bold text-orange-600">₹{pizza.price}</span>
                </div>
                <p className="text-gray-500 text-sm mb-4 flex-grow">{pizza.description}</p>
                
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Ingredients</h4>
                  <div className="flex flex-wrap gap-2">
                    {pizza.ingredients.map((ing, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md">
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => handleAdd(pizza)}
                  disabled={!pizza.isAvailable}
                  className="w-full mt-auto block text-center bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Menu;
