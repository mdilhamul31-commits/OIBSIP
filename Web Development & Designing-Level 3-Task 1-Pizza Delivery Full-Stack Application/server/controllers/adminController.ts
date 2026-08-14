import { Request, Response } from 'express';
import User from '../models/User';
import generateToken from '../utils/generateToken';

export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, role: 'admin' });

    if (user && (await (user as any).matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id.toString()),
      });
    } else {
      res.status(401).json({ message: 'Invalid admin credentials' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
