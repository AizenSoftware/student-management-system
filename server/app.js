import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import cookieParser from 'cookie-parser';

// Routes 
import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import lessonRoutes from './routes/lessonRoutes.js';
import enrollmentRoutes from './routes/enrollmentRoutes.js';
import studentSelfRoutes from './routes/studentSelfRoutes.js';
dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration for cookies
app.use(cors({
  origin: 'http://localhost:3000' || process.env.FRONTEND_URL,
  credentials: true // Cookies için gerekli
}));

app.use(express.json());
app.use(cookieParser()); // Cookie parser middleware

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Student Management System API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin/students', studentRoutes);
app.use('/api/admin/lessons', lessonRoutes);
app.use('/api/admin/enrollments', enrollmentRoutes);
app.use('/api/student', studentSelfRoutes);


app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

