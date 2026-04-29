import express from 'express';
import { getLogs } from '../controller/LogController.js';
import { verifyToken, requireRoles } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(verifyToken);
router.get('/', requireRoles('admin'), getLogs);

export default router;
