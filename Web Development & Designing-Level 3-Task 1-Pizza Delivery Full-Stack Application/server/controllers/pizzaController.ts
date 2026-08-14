import { Request, Response } from 'express';
import Pizza from '../models/Pizza';

export const getPizzas = async (req: Request, res: Response) => {
  try {
    const pizzas = await Pizza.find({});
    res.json(pizzas);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
