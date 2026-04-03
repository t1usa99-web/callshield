import express from 'express';
import { body, param } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  listClaims,
  createClaim,
  getClaim,
  updateClaim,
} from '../controllers/claim-controller.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// GET /api/claims
router.get('/', listClaims);

// POST /api/claims
router.post(
  '/',
  [
    body('callId').isUUID(),
    body('claimAmount').optional().isFloat({ min: 0 }),
    body('courtName').optional().isString(),
    body('notes').optional().isString(),
  ],
  validate,
  createClaim
);

// GET /api/claims/:id
router.get(
  '/:id',
  [
    param('id').isUUID(),
  ],
  validate,
  getClaim
);

// PUT /api/claims/:id
router.put(
  '/:id',
  [
    param('id').isUUID(),
    body('claimAmount').optional().isFloat({ min: 0 }),
    body('courtName').optional().isString(),
    body('filingDate').optional().isISO8601(),
    body('caseNumber').optional().isString(),
    body('status').optional().isIn(['PREPARING', 'FILED', 'HEARING_SCHEDULED', 'RESOLVED']),
    body('notes').optional().isString(),
  ],
  validate,
  updateClaim
);

export default router;
