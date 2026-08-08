import { Request, Response } from 'express';
import Inventory from '../models/Inventory';

export const getInventory = async (req: Request, res: Response) => {
  try {
    const inventory = await Inventory.find({});
    res.json(inventory);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateInventory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { stock, price } = req.body;

    const item = await Inventory.findById(id);
    if (!item) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    if (stock !== undefined && stock < 0) {
      return res.status(400).json({ message: 'Stock cannot be negative' });
    }

    if (stock !== undefined) item.stock = stock;
    if (price !== undefined) item.price = price;

    await item.save();
    res.json(item);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const addInventory = async (req: Request, res: Response) => {
  try {
    const { name, type, price, stock, lowStockThreshold } = req.body;
    
    if (stock < 0) {
      return res.status(400).json({ message: 'Stock cannot be negative' });
    }

    const newItem = await Inventory.create({
      name, type, price, stock, lowStockThreshold
    });

    res.status(201).json(newItem);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
