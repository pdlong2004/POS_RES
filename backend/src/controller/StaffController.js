import staffService from '../services/staff.service.js';

export const getAllStaff = async (req, res) => {
    try {
        const staff = await staffService.getAllStaff();
        res.json({ success: true, data: staff });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createStaff = async (req, res) => {
    try {
        const staff = await staffService.createStaff(req.user.id, req.body);
        res.status(201).json({ success: true, data: staff });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const updateStaff = async (req, res) => {
    try {
        const staff = await staffService.updateStaff(req.user.id, req.params.id, req.body);
        res.json({ success: true, data: staff });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deleteStaff = async (req, res) => {
    try {
        await staffService.deleteStaff(req.user.id, req.params.id);
        res.json({ success: true, message: 'Nhân viên đã được xóa' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
