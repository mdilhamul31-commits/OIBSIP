import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';

interface InventoryItem {
  _id: string;
  name: string;
  type: string;
  price: number;
  stock: number;
}

const CustomPizzaBuilder = () => {
  const [step, setStep] = useState(1);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Selections
  const [selectedBase, setSelectedBase] = useState<InventoryItem | null>(null);
  const [selectedSauce, setSelectedSauce] = useState<InventoryItem | null>(null);
  const [selectedCheese, setSelectedCheese] = useState<InventoryItem | null>(null);
  const [selectedVeggies, setSelectedVeggies] = useState<InventoryItem[]>([]);

  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
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
    fetchInventory();
  }, []);

  const bases = inventory.filter(i => i.type === 'base');
  const sauces = inventory.filter(i => i.type === 'sauce');
  const cheeses = inventory.filter(i => i.type === 'cheese');
  const veggies = inventory.filter(i => i.type === 'veggie');

  const toggleVeggie = (veg: InventoryItem) => {
    if (selectedVeggies.find(v => v._id === veg._id)) {
      setSelectedVeggies(selectedVeggies.filter(v => v._id !== veg._id));
    } else {
      setSelectedVeggies([...selectedVeggies, veg]);
    }
  };

  const calculateTotal = () => {
    let total = 200; // Base price for custom pizza
    if (selectedBase) total += selectedBase.price;
    if (selectedSauce) total += selectedSauce.price;
    if (selectedCheese) total += selectedCheese.price;
    selectedVeggies.forEach(v => total += v.price);
    return total;
  };

  const handleAddToCart = () => {
    if (!selectedBase || !selectedSauce || !selectedCheese) {
      toast.error('Please complete all required steps');
      return;
    }

    addToCart({
      id: `custom_${Date.now()}`,
      name: 'Custom Built Pizza',
      price: calculateTotal(),
      quantity: 1,
      isCustom: true,
      image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&q=80&w=800', // Generic custom pizza image
      customizations: {
        base: selectedBase.name,
        sauce: selectedSauce.name,
        cheese: selectedCheese.name,
        veggies: selectedVeggies.map(v => v.name)
      }
    });

    toast.success('Custom pizza added to cart!');
    navigate('/cart');
  };

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center">Loading builder...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Build Your Own Pizza</h1>
          <p className="text-gray-600">Choose your favorite ingredients to create the perfect slice.</p>
        </div>

        {/* Progress Tracker */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -mt-px w-full h-1 bg-gray-200 -z-10"></div>
            <div className={`absolute left-0 top-1/2 -mt-px h-1 bg-orange-600 -z-10 transition-all duration-500`} style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
            
            {[1, 2, 3, 4].map((num) => (
              <div 
                key={num} 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 ${step >= num ? 'bg-orange-600 border-white text-white' : 'bg-gray-200 border-white text-gray-500'}`}
              >
                {num}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm font-medium text-gray-500">
            <span>Base</span>
            <span>Sauce</span>
            <span>Cheese</span>
            <span>Veggies</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 min-h-[400px]">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-2xl font-bold mb-6">Step 1: Choose Your Base</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {bases.map(base => (
                    <button
                      key={base._id}
                      disabled={base.stock <= 0}
                      onClick={() => setSelectedBase(base)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        selectedBase?._id === base._id 
                          ? 'border-orange-600 bg-orange-50' 
                          : base.stock <= 0 ? 'border-gray-200 opacity-50 cursor-not-allowed' : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <h3 className="font-bold">{base.name}</h3>
                      <p className="text-sm text-gray-500">{base.price > 0 ? `+₹${base.price}` : 'Included'}</p>
                      {base.stock <= 0 && <p className="text-xs text-red-500 mt-1">Out of stock</p>}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-2xl font-bold mb-6">Step 2: Choose Your Sauce</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {sauces.map(sauce => (
                    <button
                      key={sauce._id}
                      disabled={sauce.stock <= 0}
                      onClick={() => setSelectedSauce(sauce)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        selectedSauce?._id === sauce._id 
                          ? 'border-orange-600 bg-orange-50' 
                          : sauce.stock <= 0 ? 'border-gray-200 opacity-50 cursor-not-allowed' : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <h3 className="font-bold">{sauce.name}</h3>
                      <p className="text-sm text-gray-500">{sauce.price > 0 ? `+₹${sauce.price}` : 'Included'}</p>
                      {sauce.stock <= 0 && <p className="text-xs text-red-500 mt-1">Out of stock</p>}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-2xl font-bold mb-6">Step 3: Choose Your Cheese</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {cheeses.map(cheese => (
                    <button
                      key={cheese._id}
                      disabled={cheese.stock <= 0}
                      onClick={() => setSelectedCheese(cheese)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        selectedCheese?._id === cheese._id 
                          ? 'border-orange-600 bg-orange-50' 
                          : cheese.stock <= 0 ? 'border-gray-200 opacity-50 cursor-not-allowed' : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <h3 className="font-bold">{cheese.name}</h3>
                      <p className="text-sm text-gray-500">+₹{cheese.price}</p>
                      {cheese.stock <= 0 && <p className="text-xs text-red-500 mt-1">Out of stock</p>}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-2xl font-bold mb-6">Step 4: Load Up On Veggies</h2>
                <p className="text-gray-500 mb-4">Select as many as you like.</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {veggies.map(veg => {
                    const isSelected = selectedVeggies.find(v => v._id === veg._id);
                    return (
                      <button
                        key={veg._id}
                        disabled={veg.stock <= 0}
                        onClick={() => toggleVeggie(veg)}
                        className={`p-3 rounded-xl border-2 text-center transition-all ${
                          isSelected 
                            ? 'border-orange-600 bg-orange-50' 
                            : veg.stock <= 0 ? 'border-gray-200 opacity-50 cursor-not-allowed' : 'border-gray-200 hover:border-orange-300'
                        }`}
                      >
                        <h3 className="font-bold text-sm">{veg.name}</h3>
                        <p className="text-xs text-gray-500">+₹{veg.price}</p>
                        {veg.stock <= 0 && <p className="text-xs text-red-500 mt-1">Out of stock</p>}
                      </button>
                    );
                  })}
                </div>
                
                {/* Summary Box */}
                <div className="mt-8 bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <h3 className="font-bold text-lg mb-4">Your Custom Pizza Summary</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between"><span>Base: {selectedBase?.name}</span> <span>{selectedBase?.price ? `₹${selectedBase.price}` : '₹0'}</span></li>
                    <li className="flex justify-between"><span>Sauce: {selectedSauce?.name}</span> <span>{selectedSauce?.price ? `₹${selectedSauce.price}` : '₹0'}</span></li>
                    <li className="flex justify-between"><span>Cheese: {selectedCheese?.name}</span> <span>₹{selectedCheese?.price || 0}</span></li>
                    {selectedVeggies.map(v => (
                      <li key={v._id} className="flex justify-between text-gray-600"><span>Veggie: {v.name}</span> <span>₹{v.price}</span></li>
                    ))}
                    <li className="flex justify-between pt-2 border-t font-bold text-lg">
                      <span>Total</span>
                      <span className="text-orange-600">₹{calculateTotal()}</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between">
          <button 
            onClick={() => setStep(step - 1)} 
            disabled={step === 1}
            className="px-6 py-3 rounded-full font-bold text-gray-700 bg-white border border-gray-300 disabled:opacity-50 hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          
          {step < 4 ? (
            <button 
              onClick={() => {
                if (step === 1 && !selectedBase) return toast.error('Please select a base');
                if (step === 2 && !selectedSauce) return toast.error('Please select a sauce');
                if (step === 3 && !selectedCheese) return toast.error('Please select cheese');
                setStep(step + 1);
              }} 
              className="px-8 py-3 rounded-full font-bold text-white bg-orange-600 hover:bg-orange-700 transition-colors shadow-md"
            >
              Next Step
            </button>
          ) : (
            <button 
              onClick={handleAddToCart}
              className="px-8 py-3 rounded-full font-bold text-white bg-green-600 hover:bg-green-700 transition-colors shadow-md"
            >
              Add to Cart - ₹{calculateTotal()}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomPizzaBuilder;
