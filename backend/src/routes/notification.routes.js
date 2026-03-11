import express from 'express';
import { getNotifications, markAsRead, markAllAsRead } from '../controller/notification.controller.js';
import { verifyToken, requireRoles } from '../middleware/auth.middleware.js';

const router = express.Router();

// Chỉ admin mới xem và đánh dấu đọc được thông báo
router.get('/', verifyToken, requireRoles('admin'), getNotifications);
router.put('/mark-all-read', verifyToken, requireRoles('admin'), markAllAsRead);
router.put('/:id/read', verifyToken, requireRoles('admin'), markAsRead);

export default router;
