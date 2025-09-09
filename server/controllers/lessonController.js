import Lesson from '../models/Lesson.js';
import asyncHandler from '../middleware/errorHandler.js';

// Create lesson (Admin only)
export const createLesson = asyncHandler(async (req, res) => {
  const { name, description, code, credits, instructor, maxCapacity } = req.body;

  const lesson = await Lesson.create({
    name,
    description,
    code: code.toUpperCase(), // Otomatik uppercase
    credits,
    instructor,
    maxCapacity
  });

  res.status(201).json({
    success: true,
    message: 'Lesson created successfully',
    lesson
  });
});

// Get all lessons with pagination and search (Admin only)
export const getLessons = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';
  const skip = (page - 1) * limit;

  // Search query oluştur
  let query = { isActive: true };

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { code: { $regex: search, $options: 'i' } },
      { instructor: { $regex: search, $options: 'i' } }
    ];
  }

  const lessons = await Lesson.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Lesson.countDocuments(query);
  const totalPages = Math.ceil(total / limit);

  res.json({
    success: true,
    lessons,
    pagination: {
      currentPage: page,
      totalPages,
      totalLessons: total,
      hasNext: page < totalPages,
      hasPrev: page > 1
    },
    search: search || null
  });
});

// Get single lesson (Admin only)
export const getLesson = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findById(req.params.id);

  if (!lesson) {
    return res.status(404).json({ message: 'Lesson not found' });
  }

  res.json({
    success: true,
    lesson
  });
});

// Update lesson (Admin only)
export const updateLesson = asyncHandler(async (req, res) => {
  const { name, description, code, credits, instructor, maxCapacity } = req.body;

  const lesson = await Lesson.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      code: code?.toUpperCase(), // Eğer code varsa uppercase yap
      credits,
      instructor,
      maxCapacity
    },
    { new: true, runValidators: true }
  );

  if (!lesson) {
    return res.status(404).json({ message: 'Lesson not found' });
  }

  res.json({
    success: true,
    message: 'Lesson updated successfully',
    lesson
  });
});

// Delete lesson (Admin only)
export const deleteLesson = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findById(req.params.id);

  if (!lesson) {
    return res.status(404).json({ message: 'Lesson not found' });
  }

  // Soft delete - isActive false yap
  lesson.isActive = false;
  await lesson.save();

  res.json({
    success: true,
    message: 'Lesson deleted successfully'
  });
});

// Get lesson statistics (Admin only)
export const getLessonStats = asyncHandler(async (req, res) => {
  const totalLessons = await Lesson.countDocuments({ isActive: true });
  const totalCapacity = await Lesson.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: null, total: { $sum: '$maxCapacity' } } }
  ]);
  const totalEnrollments = await Lesson.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: null, total: { $sum: '$enrolledStudentsCount' } } }
  ]);

  res.json({
    success: true,
    stats: {
      totalLessons,
      totalCapacity: totalCapacity[0]?.total || 0,
      totalEnrollments: totalEnrollments[0]?.total || 0,
      availableSpots: (totalCapacity[0]?.total || 0) - (totalEnrollments[0]?.total || 0)
    }
  });
});