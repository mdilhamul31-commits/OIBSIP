import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Truck, Clock, ShieldCheck, Star } from 'lucide-react';
import { useEffect, useState } from 'react';

const Home = () => {
  const [featuredPizzas, setFeaturedPizzas] = useState<any[]>([]);

  useEffect(() => {
    // Fetch some pizzas for the home page
    const fetchPizzas = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/pizzas`);
        if (res.ok) {
          const data = await res.json();
          setFeaturedPizzas(data.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching pizzas', error);
      }
    };
    fetchPizzas();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-orange-50 pt-20 pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
                Artisanal Pizza, <br />
                <span className="text-orange-600">Delivered Hot.</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg">
                Experience the perfect slice. From classic Margherita to fully customizable creations, we bring the finest ingredients straight to your door.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/menu" className="bg-orange-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-orange-700 transition-colors shadow-lg text-center">
                  Order Now
                </Link>
                <Link to="/builder" className="bg-white text-orange-600 border-2 border-orange-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-orange-50 transition-colors shadow-sm text-center">
                  Build Your Own
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="aspect-square rounded-full bg-orange-200 absolute -top-10 -right-10 w-full h-full -z-10 blur-3xl opacity-50"></div>
              <img 
                src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=1000" 
                alt="Delicious Pizza" 
                className="w-full h-auto rounded-full shadow-2xl object-cover aspect-square border-8 border-white"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">We don't just make pizza. We craft experiences using the finest ingredients and fastest delivery.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-2xl text-center hover:shadow-md transition-shadow">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-600">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Fast Delivery</h3>
              <p className="text-gray-600">Hot pizza delivered to your door in under 30 minutes, guaranteed.</p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-2xl text-center hover:shadow-md transition-shadow">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-600">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Fresh Ingredients</h3>
              <p className="text-gray-600">Locally sourced vegetables and premium imported cheeses.</p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-2xl text-center hover:shadow-md transition-shadow">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-600">
                <Truck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Real-time Tracking</h3>
              <p className="text-gray-600">Know exactly where your order is from the oven to your doorstep.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Pizzas */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Popular Favorites</h2>
              <p className="text-gray-600">Our most loved signature pizzas</p>
            </div>
            <Link to="/menu" className="hidden sm:block text-orange-600 font-semibold hover:text-orange-700">View Full Menu &rarr;</Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredPizzas.map((pizza) => (
              <div key={pizza._id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">
                <div className="relative h-48 overflow-hidden">
                  <img src={pizza.image} alt={pizza.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{pizza.name}</h3>
                    <span className="text-lg font-bold text-orange-600">₹{pizza.price}</span>
                  </div>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">{pizza.description}</p>
                  <Link to="/menu" className="w-full block text-center bg-orange-50 text-orange-600 py-2 rounded-lg font-medium hover:bg-orange-100 transition-colors">
                    Order Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link to="/menu" className="text-orange-600 font-semibold hover:text-orange-700">View Full Menu &rarr;</Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-orange-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Hungry yet?</h2>
          <p className="text-lg text-orange-100 mb-8 max-w-2xl mx-auto">
            Join thousands of happy customers. Create your perfect pizza or choose from our signatures.
          </p>
          <Link to="/register" className="bg-white text-orange-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg inline-block">
            Create an Account
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
