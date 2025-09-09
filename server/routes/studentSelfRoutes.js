import express from 'express';
import {
  getMyProfile,
  updateMyProfile,
  getAvailableLessons,
  getMyLessons,
  enrollInLesson,
  dropFromLesson
} from '../controllers/studentSelfController.js';
import { auth, authorize } from '../middleware/auth.js';

const router = express.Router();

// Tüm routes student yetkisi gerektirir
router.use(auth, authorize(['student']));

// Profile routes
router.route('/profile')
  .get(getMyProfile)      // GET /api/student/profile
  .put(updateMyProfile);  // PUT /api/student/profile

// Lesson routes
router.get('/lessons/available', getAvailableLessons); // GET /api/student/lessons/available
router.get('/lessons/my', getMyLessons);               // GET /api/student/lessons/my

// Enrollment routes
router.post('/enroll', enrollInLesson);                // POST /api/student/enroll
router.delete('/drop/:lessonId', dropFromLesson);      // DELETE /api/student/drop/:lessonId

export default router;