import Role from '../../models/Role.js';
import Permission from '../../models/Permission.js';
import RolePermission from '../../models/RolePermission.js';
import mongoose from 'mongoose';

export const getRoles = async (req, res) => {
    try {
        const roles = await Role.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: roles });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
    }
};

export const createRole = async (req, res) => {
    try {
        const { name, description } = req.body;
        const roleName = (name || '').toString().trim();
        if (!roleName) return res.status(400).json({ message: 'Thiếu tên role' });

        const exists = await Role.findOne({ name: roleName });
        if (exists) return res.status(409).json({ message: 'Role đã tồn tại' });

        const role = await Role.create({ name: roleName, description: description || '' });
        res.status(201).json({ success: true, data: role });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
    }
};

export const updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'RoleId không hợp lệ' });

        const { name, description } = req.body;
        const payload = {};
        if (name !== undefined) payload.name = String(name).trim();
        if (description !== undefined) payload.description = String(description);

        const role = await Role.findByIdAndUpdate(id, payload, { new: true });
        if (!role) return res.status(404).json({ message: 'Không tìm thấy role' });

        res.status(200).json({ success: true, data: role });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
    }
};

export const deleteRole = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'RoleId không hợp lệ' });

        const role = await Role.findByIdAndDelete(id);
        if (!role) return res.status(404).json({ message: 'Không tìm thấy role' });

        await RolePermission.deleteMany({ roleId: id });

        res.status(200).json({ success: true, message: 'Đã xóa role' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
    }
};

export const getPermissions = async (req, res) => {
    try {
        const permissions = await Permission.find().sort({ code: 1 });
        res.status(200).json({ success: true, data: permissions });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
    }
};

export const upsertPermission = async (req, res) => {
    try {
        const { code, description } = req.body;
        const c = (code || '').toString().trim();
        if (!c) return res.status(400).json({ message: 'Thiếu code permission' });

        const perm = await Permission.findOneAndUpdate(
            { code: c },
            { $set: { description: description || '' } },
            { new: true, upsert: true },
        );
        res.status(200).json({ success: true, data: perm });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
    }
};

export const getRolePermissions = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'RoleId không hợp lệ' });

        const mappings = await RolePermission.find({ roleId: id }).populate('permissionId');
        const permissionIds = mappings.map((m) => m.permissionId?._id).filter(Boolean);
        const permissionCodes = mappings.map((m) => m.permissionId?.code).filter(Boolean);

        res.status(200).json({ success: true, data: { permissionIds, permissionCodes } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
    }
};

export const setRolePermissions = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'RoleId không hợp lệ' });

        const { permissionIds = [], permissionCodes = [] } = req.body || {};

        let ids = [];
        if (Array.isArray(permissionIds) && permissionIds.length > 0) {
            ids = permissionIds.filter((x) => mongoose.Types.ObjectId.isValid(x)).map((x) => new mongoose.Types.ObjectId(x));
        } else if (Array.isArray(permissionCodes) && permissionCodes.length > 0) {
            const perms = await Permission.find({ code: { $in: permissionCodes.map((c) => String(c).trim()) } });
            ids = perms.map((p) => p._id);
        }

        await RolePermission.deleteMany({ roleId: id });
        if (ids.length > 0) {
            await RolePermission.insertMany(ids.map((pid) => ({ roleId: id, permissionId: pid })));
        }

        res.status(200).json({ success: true, message: 'Cập nhật quyền cho role thành công' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
    }
};

