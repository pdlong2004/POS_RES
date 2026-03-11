import express from 'express';
import { revenueStats, getAIPredictions } from './../controller/stats.controller.js';
import { verifyToken, requireRoles } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/revenue', verifyToken, requireRoles('admin'), revenueStats);
router.get('/predictions', verifyToken, requireRoles('admin'), getAIPredictions);

export default router;
