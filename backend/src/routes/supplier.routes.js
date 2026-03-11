import express from 'express';
import { getSuppliers, createSupplier, updateSupplier, deleteSupplier } from '../controller/supplier.controller.js';
import { verifyToken, requireRoles } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', verifyToken, requireRoles('admin'), getSuppliers);
router.post('/', verifyToken, requireRoles('admin'), createSupplier);
router.put('/:id', verifyToken, requireRoles('admin'), updateSupplier);
router.delete('/:id', verifyToken, requireRoles('admin'), deleteSupplier);

export default router;
