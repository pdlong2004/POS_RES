import express from 'express';
import { getAllTables, createTable, updateTableStatus } from '../controller/Table.controller.js';
import { verifyToken, requireRoles } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getAllTables);
router.post('/', verifyToken, requireRoles('admin'), createTable);
router.put('/:id/status', verifyToken, requireRoles('admin'), updateTableStatus);

export default router;
