import express from 'express';
import { getAllStaff, createStaff, updateStaff, deleteStaff } from '../controller/StaffController.js';
import { verifyToken, requireRoles } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(verifyToken);

router.get('/', requireRoles('admin', 'cashier', 'waiter', 'chef', 'staff'), getAllStaff);
router.post('/', requireRoles('admin'), createStaff);
router.put('/:id', requireRoles('admin'), updateStaff);
router.delete('/:id', requireRoles('admin'), deleteStaff);

export default router;
