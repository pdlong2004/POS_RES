import express from 'express';
import { createStatusTable, getAllStatusTables } from '../controller/statusTable.controller.js';
import { verifyToken, requireRoles } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getAllStatusTables);
router.post('/', verifyToken, requireRoles('admin'), createStatusTable);

export default router;
