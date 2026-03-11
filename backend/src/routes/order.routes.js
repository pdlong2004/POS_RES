import express from 'express';
import {
    createOrder,
    getOrders,
    getTotalOrders,
    getOrderById,
    updateOrdersStatus,
} from '../controller/order.controller.js';
import { verifyToken, requireRoles } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', createOrder);
router.get('/total', verifyToken, requireRoles('admin'), getTotalOrders);
router.put('/status', verifyToken, requireRoles('admin'), updateOrdersStatus);
router.get('/:id', verifyToken, requireRoles('admin'), getOrderById);
router.get('/', verifyToken, requireRoles('admin'), getOrders);

export default router;
