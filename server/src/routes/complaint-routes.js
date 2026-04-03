import express from 'express';
import { body, param } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  listComplaints,
  createComplaint,
  getComplaint,
} from '../controllers/complaint-controller.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// GET /api/complaints
router.get('/', listComplaints);

// POST /api/complaints
router.post(
  '/',
  [
    body('callId').isUUID(),
    body('agency').isIn(['FTC', 'FCC']),
    body('confirmationNumber').optional().isString(),
    body('notes').optional().isString(),
  ],
  validate,
  createComplaint
);

// GET /api/complaints/:id
router.get(
  '/:id',
  [
    param('id').isUUID(),
  ],
  validate,
  getComplaint
);

export default router;
