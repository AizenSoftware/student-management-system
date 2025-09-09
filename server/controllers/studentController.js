import User from '../models/User.js';
import asyncHandler from '../middleware/errorHandler.js';

// Create student (Admin only)
export const createStudent = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, dateOfBirth } = req.body;

  const student = await User.create({
    firstName,
    lastName,
    email,
    password,
    dateOfBirth,
    role: 'student'
  });

  res.status(201).json({
    success: true,
    message: 'Student created successfully',
    student: {
      id: student._id,
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      dateOfBirth: student.dateOfBirth,
      role: student.role,
      createdAt: student.createdAt
    }
  });
});

// Get all students with pagination and search (Admin only)
export const getStudents = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';
  const skip = (page - 1) * limit;

  // Search query oluştur
  let query = { role: 'student' };

  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  const students = await User.find(query)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments(query);
  const totalPages = Math.ceil(total / limit);

  res.json({
    success: true,
    students,
    pagination: {
      currentPage: page,
      totalPages,
      totalStudents: total,
      hasNext: page < totalPages,
      hasPrev: page > 1
    },
    search: search || null
  });
});

// Get single student (Admin only)
export const getStudent = asyncHandler(async (req, res) => {
  const student = await User.findOne({ 
    _id: req.params.id, 
    role: 'student' 
  }).select('-password');

  if (!student) {
    return res.status(404).json({ message: 'Student not found' });
  }

  res.json({
    success: true,
    student
  });
});

// Update student (Admin only)
export const updateStudent = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, dateOfBirth } = req.body;

  const student = await User.findOneAndUpdate(
    { _id: req.params.id, role: 'student' },
    { firstName, lastName, email, dateOfBirth },
    { new: true, runValidators: true }
  ).select('-password');

  if (!student) {
    return res.status(404).json({ message: 'Student not found' });
  }

  res.json({
    success: true,
    message: 'Student updated successfully',
    student
  });
});

// Delete student (Admin only)
export const deleteStudent = asyncHandler(async (req, res) => {
  const student = await User.findOneAndDelete({ 
    _id: req.params.id, 
    role: 'student' 
  });

  if (!student) {
    return res.status(404).json({ message: 'Student not found' });
  }

  res.json({
    success: true,
    message: 'Student deleted successfully'
  });
});