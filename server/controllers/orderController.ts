import { Request, Response } from 'express';
import Order from '../models/Order';
import Inventory from '../models/Inventory';

export const createOrder = async (req: any, res: Response) => {
  try {
    const {
      items,
      deliveryInfo,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paymentResult,
    } = req.body;

    if (items && items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    } else {
      // Create the order
      const order = new Order({
        user: req.user._id,
        items,
        deliveryInfo,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        isPaid: true, // Since we call this after Razorpay success
        paidAt: Date.now(),
        paymentResult,
      });

      const createdOrder = await order.save();

      // Decrement Inventory for custom pizzas
      for (const item of items) {
        if (item.isCustom && item.customizations) {
          const { base, sauce, cheese, veggies } = item.customizations;
          
          if (base) await Inventory.findOneAndUpdate({ name: base, type: 'base' }, { $inc: { stock: -item.quantity } });
          if (sauce) await Inventory.findOneAndUpdate({ name: sauce, type: 'sauce' }, { $inc: { stock: -item.quantity } });
          if (cheese) await Inventory.findOneAndUpdate({ name: cheese, type: 'cheese' }, { $inc: { stock: -item.quantity } });
          
          if (veggies && veggies.length > 0) {
            for (const veg of veggies) {
              await Inventory.findOneAndUpdate({ name: veg, type: 'veggie' }, { $inc: { stock: -item.quantity } });
            }
          }
        }
      }

      res.status(201).json(createdOrder);
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyOrders = async (req: any, res: Response) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.status = req.body.status || order.status;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
