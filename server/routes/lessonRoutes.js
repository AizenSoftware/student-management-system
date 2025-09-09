import express from 'express';
import {
  createLesson,
  getLessons,
  getLesson,
  updateLesson,
  deleteLesson,
  getLessonStats
} from '../controllers/lessonController.js';
import { auth, authorize } from '../middleware/auth.js';

const router = express.Router();

// Tüm routes admin yetkisi gerektirir
router.use(auth, authorize(['admin']));

router.route('/')
  .get(getLessons)     // GET /api/admin/lessons
  .post(createLesson); // POST /api/admin/lessons

router.get('/stats', getLessonStats); // GET /api/admin/lessons/stats

router.route('/:id')
  .get(getLesson)      // GET /api/admin/lessons/:id
  .put(updateLesson)   // PUT /api/admin/lessons/:id
  .delete(deleteLesson); // DELETE /api/admin/lessons/:id

export default router;