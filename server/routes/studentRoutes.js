import express from 'express';
import {
  createStudent,
  getStudents,
  getStudent,
  updateStudent,
  deleteStudent
} from '../controllers/studentController.js';
import { auth, authorize } from '../middleware/auth.js';

const router = express.Router();

// Tüm routes admin yetkisi gerektirir
router.use(auth, authorize(['admin']));

router.route('/')
  .get(getStudents)     // GET /api/admin/students
  .post(createStudent); // POST /api/admin/students

router.route('/:id')
  .get(getStudent)      // GET /api/admin/students/:id
  .put(updateStudent)   // PUT /api/admin/students/:id
  .delete(deleteStudent); // DELETE /api/admin/students/:id

export default router;