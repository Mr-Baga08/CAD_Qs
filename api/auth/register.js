// api/auth/register.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from '../../lib/db';
import User from '../../lib/models/user';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();
    
    const { name, rollNumber, email, phone, password } = req.body;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate phone number
    if (phone.length !== 10 || !/^\d+$/.test(phone)) {
      return res.status(400).json({ message: 'Phone must be 10 digits' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { rollNumber }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email or roll number already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      name,
      rollNumber,
      email,
      phone,
      password: hashedPassword
    });

    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}