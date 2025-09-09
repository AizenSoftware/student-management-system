import User from '../models/User.js';
import { sendTokenResponse } from '../utils/createToken.js';
import asyncHandler from '../middleware/errorHandler.js';

// Register kullanıcı
export const register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, dateOfBirth, role } = req.body;

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    dateOfBirth,
    role: role || 'student'
  });

  sendTokenResponse(user, 201, res, 'User registered successfully');
});

// Login kullanıcı
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  sendTokenResponse(user, 200, res, 'Login successful');
});

// Logout kullanıcı
export const logout = asyncHandler(async (req, res) => {
  // Cookie'yi temizle
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000), // 10 saniye sonra expire
    httpOnly: true
  });

  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Profil bilgisi getir
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  res.json({
    success: true,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      dateOfBirth: user.dateOfBirth,
      createdAt: user.createdAt
    }
  });
});