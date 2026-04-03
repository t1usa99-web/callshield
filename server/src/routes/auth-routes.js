import express from 'express';
import { body } from 'express-validator';
import { register, login, refresh } from '../controllers/auth-controller.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// POST /api/auth/register
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('phoneNumber').optional().isMobilePhone(),
    body('dncRegistered').optional().isBoolean(),
  ],
  validate,
  register
);

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').exists(),
  ],
  validate,
  login
);

// POST /api/auth/refresh
router.post(
  '/refresh',
  [
    body('refreshToken').exists(),
  ],
  validate,
  refresh
);

export default router;
