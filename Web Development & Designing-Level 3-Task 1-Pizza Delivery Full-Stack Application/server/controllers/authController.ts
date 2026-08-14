import { Request, Response } from 'express';
import crypto from 'crypto';
import User from '../models/User';
import Token from '../models/Token';
import generateToken from '../utils/generateToken';
import { sendEmail } from '../services/mailer';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      // Create verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');
      await Token.create({
        userId: user._id,
        token: verificationToken,
        type: 'verification'
      });

      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const verifyUrl = `${frontendUrl}/verify-email/${verificationToken}`;
      
      await sendEmail(
        user.email,
        'Verify Your Email',
        `<p>Please verify your email by clicking the link below:</p><p><a href="${verifyUrl}">${verifyUrl}</a></p>`
      );

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        token: generateToken(user._id.toString()),
        message: 'Registration successful. Please check your email to verify your account.'
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await (user as any).matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        token: generateToken(user._id.toString()),
      });
    } else {
      // Do not reveal whether email or password was specifically incorrect
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const tokenDoc = await Token.findOne({ token, type: 'verification' });

    if (!tokenDoc) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    const user = await User.findById(tokenDoc.userId);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    user.isVerified = true;
    await user.save();
    await tokenDoc.deleteOne();

    res.json({ message: 'Email verified successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete existing reset tokens
    await Token.deleteMany({ userId: user._id, type: 'reset' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    await Token.create({
      userId: user._id,
      token: resetToken,
      type: 'reset'
    });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;
    
    await sendEmail(
      user.email,
      'Password Reset Request',
      `<p>You requested a password reset. Click the link below to reset it:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`
    );

    res.json({ message: 'Password reset link sent to email' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const tokenDoc = await Token.findOne({ token, type: 'reset' });

    if (!tokenDoc) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    const user = await User.findById(tokenDoc.userId);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    user.password = password;
    await user.save();
    await tokenDoc.deleteOne();

    res.json({ message: 'Password reset successful' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserProfile = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
