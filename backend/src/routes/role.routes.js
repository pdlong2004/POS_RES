import express from 'express';
import { verifyToken, requireRoles } from '../middleware/auth.middleware.js';
import {
    getRoles,
    createRole,
    updateRole,
    deleteRole,
    getPermissions,
    upsertPermission,
    getRolePermissions,
    setRolePermissions,
} from '../controller/role.controller.js';

const router = express.Router();

router.get('/', verifyToken, requireRoles('admin'), getRoles);
router.post('/', verifyToken, requireRoles('admin'), createRole);
router.put('/:id', verifyToken, requireRoles('admin'), updateRole);
router.delete('/:id', verifyToken, requireRoles('admin'), deleteRole);

router.get('/permissions/all', verifyToken, requireRoles('admin'), getPermissions);
router.post('/permissions', verifyToken, requireRoles('admin'), upsertPermission);

router.get('/:id/permissions', verifyToken, requireRoles('admin'), getRolePermissions);
router.put('/:id/permissions', verifyToken, requireRoles('admin'), setRolePermissions);

export default router;

