import express from 'express';
import { body, param } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  listCalls,
  createCall,
  getCall,
  updateCall,
  deleteCall,
  updateCallStatus,
} from '../controllers/call-controller.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// GET /api/calls
router.get('/', listCalls);

// POST /api/calls
router.post(
  '/',
  [
    body('callerNumber').notEmpty(),
    body('date').isISO8601(),
    body('callerName').optional().isString(),
    body('callerCompany').optional().isString(),
    body('callerID').optional().isString(),
    body('callType').optional().isIn(['ROBOCALL', 'LIVE_TELEMARKETER', 'TEXT_MESSAGE', 'FAX']),
    body('time').optional().isString(),
    body('state').optional().isString(),
    body('registeredOnDNC').optional().isIn(['yes', 'no']),
    body('consentGiven').optional().isIn(['yes', 'no']),
    body('existingRelationship').optional().isIn(['yes', 'no']),
    body('notes').optional().isString(),
  ],
  validate,
  createCall
);

// GET /api/calls/:id
router.get(
  '/:id',
  [
    param('id').isUUID(),
  ],
  validate,
  getCall
);

// PUT /api/calls/:id
router.put(
  '/:id',
  [
    param('id').isUUID(),
    body('callerNumber').optional().notEmpty(),
    body('date').optional().isISO8601(),
    body('callerName').optional().isString(),
    body('callerCompany').optional().isString(),
    body('callerID').optional().isString(),
    body('callType').optional().isIn(['ROBOCALL', 'LIVE_TELEMARKETER', 'TEXT_MESSAGE', 'FAX']),
    body('time').optional().isString(),
    body('state').optional().isString(),
    body('registeredOnDNC').optional().isIn(['yes', 'no']),
    body('consentGiven').optional().isIn(['yes', 'no']),
    body('existingRelationship').optional().isIn(['yes', 'no']),
    body('notes').optional().isString(),
  ],
  validate,
  updateCall
);

// DELETE /api/calls/:id
router.delete(
  '/:id',
  [
    param('id').isUUID(),
  ],
  validate,
  deleteCall
);

// PATCH /api/calls/:id/status
router.patch(
  '/:id/status',
  [
    param('id').isUUID(),
    body('status').isIn(['LOGGED', 'COMPLAINT_FILED', 'CLAIM_FILED', 'RESOLVED']),
  ],
  validate,
  updateCallStatus
);

export default router;
