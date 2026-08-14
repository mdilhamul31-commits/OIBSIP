import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { 
      type: String, 
      required: true,
      enum: ['base', 'sauce', 'cheese', 'veggie']
    },
    price: { type: Number, required: true }, // Extra cost if added
    stock: { type: Number, required: true, default: 0 },
    lowStockThreshold: { type: Number, default: 20 },
  },
  { timestamps: true }
);

const Inventory = mongoose.model('Inventory', inventorySchema);
export default Inventory;
