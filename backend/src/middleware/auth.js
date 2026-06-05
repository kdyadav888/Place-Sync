import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: 'Server configuration error: JWT_SECRET not set' });
    }
    
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    const decoded = jwt.verify(token, secret);
    req.user = await User.findById(decoded.id);
    
    if (!req.user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Ensure id property is set for compatibility (MongoDB uses _id)
    if (!req.user.id && req.user._id) {
      req.user.id = req.user._id.toString();
    }
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorized to perform this action' });
    }
    next();
  };
};

export { protect, authorize };

