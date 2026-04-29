import express from 'express';
import { revenueStats, getAIPredictions, getAdvancedStats, getTopSellingProducts } from './../controller/stats.controller.js';
import { verifyToken, requireRoles } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/revenue', verifyToken, requireRoles('admin', 'cashier', 'waiter', 'chef', 'staff'), revenueStats);
router.get('/predictions', verifyToken, requireRoles('admin', 'cashier', 'waiter', 'chef', 'staff'), getAIPredictions);
router.get('/advanced', verifyToken, requireRoles('admin', 'cashier', 'waiter', 'chef', 'staff'), getAdvancedStats);
router.get('/top-selling-products', verifyToken, requireRoles('admin', 'cashier', 'waiter', 'chef', 'staff'), getTopSellingProducts);

export default router;
