import User from '../models/User.js';
import Lesson from '../models/Lesson.js';
import Enrollment from '../models/Enrollment.js';
import asyncHandler from '../middleware/errorHandler.js';

// Get own profile
export const getMyProfile = asyncHandler(async (req, res) => {
  const student = await User.findById(req.user.id);

  res.json({
    success: true,
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

// Update own profile
export const updateMyProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, dateOfBirth } = req.body;

  const student = await User.findByIdAndUpdate(
    req.user.id,
    { firstName, lastName, dateOfBirth },
    { new: true, runValidators: true }
  ).select('-password');

  res.json({
    success: true,
    message: 'Profile updated successfully',
    student
  });
});

// Get available lessons (that student can enroll)
export const getAvailableLessons = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';
  const skip = (page - 1) * limit;

  // Öğrencinin zaten kayıtlı olduğu dersleri getir
  const enrolledLessons = await Enrollment.find({
    student: req.user.id,
    status: 'active'
  }).select('lesson');

  const enrolledLessonIds = enrolledLessons.map(enrollment => enrollment.lesson);

  // Search query oluştur
  let query = {
    isActive: true,
    _id: { $nin: enrolledLessonIds } // Kayıtlı olmadığı dersler
  };

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { code: { $regex: search, $options: 'i' } },
      { instructor: { $regex: search, $options: 'i' } }
    ];
  }

  // Kayıtlı olmadığı aktif dersleri getir
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

// Get my enrolled lessons
export const getMyLessons = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find({
    student: req.user.id,
    status: 'active'
  })
    .populate('lesson', 'name code credits instructor maxCapacity enrolledStudentsCount')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    enrollments,
    totalEnrollments: enrollments.length
  });
});

// Enroll in a lesson
export const enrollInLesson = asyncHandler(async (req, res) => {
  const { lessonId } = req.body;

  // Lesson kontrolü
  const lesson = await Lesson.findById(lessonId);
  if (!lesson || !lesson.isActive) {
    return res.status(404).json({ message: 'Lesson not found or inactive' });
  }

  // Kapasite kontrolü
  if (!lesson.hasCapacity()) {
    return res.status(400).json({ message: 'Lesson is full' });
  }

  // Zaten kayıtlı mı kontrol et
  const existingEnrollment = await Enrollment.isStudentEnrolled(req.user.id, lessonId);
  if (existingEnrollment) {
    return res.status(400).json({ message: 'You are already enrolled in this lesson' });
  }

  // Enrollment oluştur
  const enrollment = await Enrollment.create({
    student: req.user.id,
    lesson: lessonId
  });

  // Lesson'ın öğrenci sayısını artır
  lesson.enrolledStudentsCount += 1;
  await lesson.save();

  // Populate ile detayları getir
  await enrollment.populate('lesson', 'name code credits instructor');

  res.status(201).json({
    success: true,
    message: 'Successfully enrolled in lesson',
    enrollment
  });
});

// Drop from a lesson (withdraw enrollment)
export const dropFromLesson = asyncHandler(async (req, res) => {
  const { lessonId } = req.params;

  // Enrollment kontrolü
  const enrollment = await Enrollment.findOne({
    student: req.user.id,
    lesson: lessonId,
    status: 'active'
  });

  if (!enrollment) {
    return res.status(404).json({ 
      message: 'You are not enrolled in this lesson' 
    });
  }

  // Lesson'ın öğrenci sayısını azalt
  const lesson = await Lesson.findById(lessonId);
  if (lesson && lesson.enrolledStudentsCount > 0) {
    lesson.enrolledStudentsCount -= 1;
    await lesson.save();
  }

  // Enrollment'ı sil
  await Enrollment.findByIdAndDelete(enrollment._id);

  res.json({
    success: true,
    message: 'Successfully dropped from lesson'
  });
});