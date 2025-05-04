// lib/middleware.js
import jwt from 'jsonwebtoken';

export const authMiddleware = (handler) => async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    req.user = decoded;
    
    return handler(req, res);
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const adminMiddleware = (handler) => async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  return handler(req, res);
};