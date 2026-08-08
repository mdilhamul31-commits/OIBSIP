import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './db';
import User from './models/User';
import Pizza from './models/Pizza';
import Inventory from './models/Inventory';

dotenv.config();

const seedData = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.warn('MONGODB_URI is not defined. Skipping database seeding.');
      process.exit(0);
    }
    
    mongoose.set('bufferCommands', false);
    await connectDB();

    if (mongoose.connection.readyState !== 1) {
      console.error('Database connection failed. Seeding aborted.');
      process.exit(1);
    }

    // Clear existing data
    await User.deleteMany();
    await Pizza.deleteMany();
    await Inventory.deleteMany();

    // Create Admin User
    await User.create({
      name: 'Admin User',
      email: 'admin@pizza.com',
      password: 'admin123',
      role: 'admin',
      isVerified: true
    });

    // Create Sample Pizzas
    const pizzas = [
      {
        name: 'Margherita',
        description: 'Classic cheese and tomato pizza',
        price: 299,
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=800',
        ingredients: ['Cheese', 'Tomato Sauce', 'Basil'],
      },
      {
        name: 'Pepperoni',
        description: 'Spicy pepperoni with extra cheese',
        price: 399,
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=800',
        ingredients: ['Cheese', 'Tomato Sauce', 'Pepperoni'],
      },
      {
        name: 'Veggie Supreme',
        description: 'Loaded with fresh vegetables',
        price: 349,
        image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&q=80&w=800',
        ingredients: ['Cheese', 'Tomato Sauce', 'Onions', 'Bell Peppers', 'Olives'],
      }
    ];
    await Pizza.insertMany(pizzas);

    // Create Inventory
    const inventory = [
      // Bases
      { name: 'Thin Crust', type: 'base', price: 0, stock: 100, lowStockThreshold: 20 },
      { name: 'Thick Crust', type: 'base', price: 20, stock: 100, lowStockThreshold: 20 },
      { name: 'Cheese Burst', type: 'base', price: 50, stock: 50, lowStockThreshold: 10 },
      { name: 'Wheat Base', type: 'base', price: 10, stock: 80, lowStockThreshold: 15 },
      { name: 'Gluten Free', type: 'base', price: 40, stock: 30, lowStockThreshold: 5 },
      
      // Sauces
      { name: 'Tomato Basil', type: 'sauce', price: 0, stock: 150, lowStockThreshold: 30 },
      { name: 'Spicy Garlic', type: 'sauce', price: 10, stock: 120, lowStockThreshold: 20 },
      { name: 'BBQ Sauce', type: 'sauce', price: 15, stock: 90, lowStockThreshold: 15 },
      { name: 'Pesto', type: 'sauce', price: 25, stock: 60, lowStockThreshold: 10 },
      { name: 'White Sauce', type: 'sauce', price: 20, stock: 100, lowStockThreshold: 20 },
      
      // Cheeses
      { name: 'Mozzarella', type: 'cheese', price: 30, stock: 200, lowStockThreshold: 40 },
      { name: 'Cheddar', type: 'cheese', price: 40, stock: 100, lowStockThreshold: 20 },
      { name: 'Parmesan', type: 'cheese', price: 50, stock: 80, lowStockThreshold: 15 },
      { name: 'Vegan Cheese', type: 'cheese', price: 60, stock: 40, lowStockThreshold: 10 },
      
      // Veggies
      { name: 'Onions', type: 'veggie', price: 10, stock: 300, lowStockThreshold: 50 },
      { name: 'Bell Peppers', type: 'veggie', price: 15, stock: 250, lowStockThreshold: 40 },
      { name: 'Mushrooms', type: 'veggie', price: 25, stock: 150, lowStockThreshold: 30 },
      { name: 'Olives', type: 'veggie', price: 20, stock: 120, lowStockThreshold: 25 },
      { name: 'Jalapenos', type: 'veggie', price: 15, stock: 200, lowStockThreshold: 40 },
      { name: 'Sweet Corn', type: 'veggie', price: 15, stock: 200, lowStockThreshold: 40 },
    ];
    await Inventory.insertMany(inventory);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

seedData();
