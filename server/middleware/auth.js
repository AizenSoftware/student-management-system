import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Authentication kontrolü
export const auth = async (req, res, next) => {
  let token;

  // Token'ı cookie'den al
  if (req.cookies.token) {
    token = req.cookies.token;
  }

  // Token yoksa error
  if (!token || token === 'none') {
    return res.status(401).json({
      status: 'error',
      message: 'Access denied. No token provided.'
    });
  }

  try {
    // Token'ı verify et
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // User'ı database'den getir
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token. User not found.'
      });
    }

    // User'ı request'e ekle
    req.user = user;
    next();

  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid token.'
    });
  }
};

// Role kontrolü
export const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required.'
      });
    }

    if (roles.length > 0 && !roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'Access forbidden. Insufficient permissions.'
      });
    }

    next();
  };
};

// Kendi kaydına erişim kontrolü (student sadece kendi bilgilerini görebilir)
export const checkOwnership = (req, res, next) => {
  // Admin her şeye erişebilir
  if (req.user.role === 'admin') {
    return next();
  }

  // Student sadece kendi kaydına erişebilir
  if (req.user.role === 'student') {
    const resourceId = req.params.id;
    
    if (resourceId !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Access forbidden. You can only access your own resources.'
      });
    }
  }

  next();
};