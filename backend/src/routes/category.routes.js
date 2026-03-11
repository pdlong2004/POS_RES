import express from 'express';
import { creatCategory, getCategory, updateCategory, deleteCategory } from '../controller/category.controller.js';
import { verifyToken, requireRoles } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getCategory);
router.post('/', verifyToken, requireRoles('admin'), creatCategory);
router.put('/:id', verifyToken, requireRoles('admin'), updateCategory);
router.delete('/:id', verifyToken, requireRoles('admin'), deleteCategory);

export default router;
