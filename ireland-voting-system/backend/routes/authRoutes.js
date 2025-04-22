import express from 'express';
import AuthController from '../controllers/authController.js';
import upload from '../middleware/uploadMiddleware.js'; // ✅ Must include .js extension in ESM
//import AuthController from './controllers/authController.js';


const router = express.Router();

// 🔐 LOGIN
router.post('/login', AuthController.login); // lowercase 'login' for consistency

// 📝 REGISTER — with multer for ID upload
router.post('/register', upload.single('idProof'), AuthController.register);

export default router;
