import mongoose from 'mongoose';

const pizzaSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    ingredients: [{ type: String }],
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Pizza = mongoose.model('Pizza', pizzaSchema);
export default Pizza;
