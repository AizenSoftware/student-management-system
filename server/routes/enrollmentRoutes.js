import express from 'express';
import {
  createEnrollment,
  getEnrollments,
  deleteEnrollment,
  getStudentLessons,
  getLessonStudents
} from '../controllers/enrollmentController.js';
import { auth, authorize } from '../middleware/auth.js';

const router = express.Router();

// Tüm routes admin yetkisi gerektirir
router.use(auth, authorize(['admin']));

router.route('/')
  .get(getEnrollments)      // GET /api/admin/enrollments
  .post(createEnrollment);  // POST /api/admin/enrollments

router.delete('/:id', deleteEnrollment); // DELETE /api/admin/enrollments/:id

// Öğrencilerin derslerini getir
router.get('/student/:studentId', getStudentLessons); // GET /api/admin/enrollments/student/:studentId

// Dersin öğrencilerini getir
router.get('/lesson/:lessonId', getLessonStudents); // GET /api/admin/enrollments/lesson/:lessonId

export default router;