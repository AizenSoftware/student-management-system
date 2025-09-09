import express from 'express';
import {auth} from '../middleware/auth.js';
import { getProfile, login, logout, register } from '../controllers/authController.js';


const router = express.Router();


router.post("/register",register);
router.post("/login",login);
router.get("/profile",auth ,getProfile);
router.post("/logout",auth,logout)


export default router;