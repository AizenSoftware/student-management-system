import jwt from 'jsonwebtoken';

// JWT token oluştur
export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE || '7d'
    }
  );
};

// Token'ı cookie ile gönder
export const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  const token = generateToken(user);

  // Cookie options
  const options = {
    expires: new Date(
      Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 gün
    ),
    httpOnly: true, // XSS koruması
    secure: process.env.NODE_ENV === 'production', // Production'da HTTPS zorunlu
    sameSite: 'strict' // CSRF koruması
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      message,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
};