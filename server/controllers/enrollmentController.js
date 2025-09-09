import Enrollment from '../models/Enrollment.js';
import User from '../models/User.js';
import Lesson from '../models/Lesson.js';
import asyncHandler from '../middleware/errorHandler.js';

// Create enrollment - Admin öğrenciyi derse kayıt eder
export const createEnrollment = asyncHandler(async (req, res) => {
  const { studentId, lessonId } = req.body;

  // Student kontrolü
  const student = await User.findOne({ _id: studentId, role: 'student' });
  if (!student) {
    return res.status(404).json({ message: 'Student not found' });
  }

  // Lesson kontrolü
  const lesson = await Lesson.findById(lessonId);
  if (!lesson) {
    return res.status(404).json({ message: 'Lesson not found' });
  }

  // Kapasite kontrolü
  if (!lesson.hasCapacity()) {
    return res.status(400).json({ message: 'Lesson is full' });
  }

  // Zaten kayıtlı mı kontrol et
  const existingEnrollment = await Enrollment.isStudentEnrolled(studentId, lessonId);
  if (existingEnrollment) {
    return res.status(400).json({ message: 'Student is already enrolled in this lesson' });
  }

  // Enrollment oluştur
  const enrollment = await Enrollment.create({
    student: studentId,
    lesson: lessonId
  });

  // Lesson'ın öğrenci sayısını artır
  lesson.enrolledStudentsCount += 1;
  await lesson.save();

  // Populate ile detayları getir
  await enrollment.populate('student', 'firstName lastName email');
  await enrollment.populate('lesson', 'name code credits');

  res.status(201).json({
    success: true,
    message: 'Student enrolled successfully',
    enrollment
  });
});

// Get all enrollments with pagination
export const getEnrollments = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const enrollments = await Enrollment.find({ status: 'active' })
    .populate('student', 'firstName lastName email')
    .populate('lesson', 'name code credits instructor')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Enrollment.countDocuments({ status: 'active' });
  const totalPages = Math.ceil(total / limit);

  res.json({
    success: true,
    enrollments,
    pagination: {
      currentPage: page,
      totalPages,
      totalEnrollments: total,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  });
});

// Delete enrollment - Admin ders kaydını siler
export const deleteEnrollment = asyncHandler(async (req, res) => {
  const enrollment = await Enrollment.findById(req.params.id);

  if (!enrollment) {
    return res.status(404).json({ message: 'Enrollment not found' });
  }

  // Lesson'ın öğrenci sayısını azalt
  const lesson = await Lesson.findById(enrollment.lesson);
  if (lesson && lesson.enrolledStudentsCount > 0) {
    lesson.enrolledStudentsCount -= 1;
    await lesson.save();
  }

  // Enrollment'ı sil
  await Enrollment.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Enrollment deleted successfully'
  });
});

// Get student's all lessons
export const getStudentLessons = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  // Student kontrolü
  const student = await User.findOne({ _id: studentId, role: 'student' });
  if (!student) {
    return res.status(404).json({ message: 'Student not found' });
  }

  const enrollments = await Enrollment.getStudentLessons(studentId);

  res.json({
    success: true,
    student: {
      id: student._id,
      name: `${student.firstName} ${student.lastName}`,
      email: student.email
    },
    lessons: enrollments,
    totalLessons: enrollments.length
  });
});

// Get lesson's all students
export const getLessonStudents = asyncHandler(async (req, res) => {
  const { lessonId } = req.params;

  // Lesson kontrolü
  const lesson = await Lesson.findById(lessonId);
  if (!lesson) {
    return res.status(404).json({ message: 'Lesson not found' });
  }

  const enrollments = await Enrollment.getLessonStudents(lessonId);

  res.json({
    success: true,
    lesson: {
      id: lesson._id,
      name: lesson.name,
      code: lesson.code,
      maxCapacity: lesson.maxCapacity,
      enrolledCount: lesson.enrolledStudentsCount
    },
    students: enrollments,
    totalStudents: enrollments.length
  });
});