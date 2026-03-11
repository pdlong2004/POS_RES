import express from 'express';
import { createImport, getImports, getImportDetails } from '../controller/imports.controller.js';
import { verifyToken, requireRoles } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', verifyToken, requireRoles('admin'), getImports);
router.post('/', verifyToken, requireRoles('admin'), createImport);
router.get('/:id', verifyToken, requireRoles('admin'), getImportDetails);

export default router;
