import express from 'express';
import { getShifts, createShift, assignShift, getSchedule, checkIn, checkOut, autoSchedule } from '../controller/ShiftController.js';
import { verifyToken, requireRoles } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(verifyToken);

router.get('/', getShifts);
router.post('/', requireRoles('admin'), createShift);
router.post('/assign', requireRoles('admin'), assignShift);
router.get('/schedule', getSchedule);
router.post('/auto-generate', requireRoles('admin'), autoSchedule);
router.post('/check-in/:id', checkIn);
router.post('/check-out/:id', checkOut);

export default router;
