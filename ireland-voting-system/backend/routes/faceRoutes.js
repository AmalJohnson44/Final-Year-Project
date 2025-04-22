import express from 'express';
import FaceController from '../controllers/faceController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   POST api/face/face-login
// @desc    Face login route
// @access  Public (or adjust to Private if needed)
router.post('/face-login', FaceController.loginWithFace);

// @route   POST api/face/detect
// @desc    Detect face in image
// @access  Private
router.post('/detect', auth, FaceController.detect);

export default router;
