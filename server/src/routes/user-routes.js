import express from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  getProfile,
  updateProfile,
} from '../controllers/user-controller.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// GET /api/user/profile
router.get('/profile', getProfile);

// PUT /api/user/profile
router.put(
  '/profile',
  [
    body('phoneNumber').optional().isMobilePhone(),
    body('dncRegistered').optional().isBoolean(),
  ],
  validate,
  updateProfile
);

export default router;
