import express from 'express';
import {
    createProduct,
    getProducts,
    getProductsByCategorySlug,
    getProductStats,
    updateProduct,
    deleteProduct,
} from '../controller/product.controller.js';
import { verifyToken, requireRoles } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getProducts);
router.post('/', verifyToken, requireRoles('admin'), createProduct);
router.get('/category/:slug', getProductsByCategorySlug);
router.get('/stats', getProductStats);
router.put('/:id', verifyToken, requireRoles('admin'), updateProduct);
router.delete('/:id', verifyToken, requireRoles('admin'), deleteProduct);

export default router;
