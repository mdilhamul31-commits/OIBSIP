import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  pizzaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pizza' }, // For pre-built
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }, // Price per item at time of order
  isCustom: { type: Boolean, default: false },
  customizations: {
    base: { type: String },
    sauce: { type: String },
    cheese: { type: String },
    veggies: [{ type: String }],
  }
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    deliveryInfo: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      phone: { type: String, required: true },
    },
    paymentMethod: { type: String, required: true, default: 'Razorpay' },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
    },
    itemsPrice: { type: Number, required: true },
    taxPrice: { type: Number, required: true, default: 0 },
    shippingPrice: { type: Number, required: true, default: 0 },
    totalPrice: { type: Number, required: true },
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    status: { 
      type: String, 
      required: true, 
      enum: ['Order Received', 'In Kitchen', 'Sent to Delivery', 'Delivered', 'Cancelled'],
      default: 'Order Received' 
    },
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
