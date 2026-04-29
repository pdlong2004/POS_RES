import shiftService from '../services/shift.service.js';

export const getShifts = async (req, res) => {
    try {
        const shifts = await shiftService.getShifts();
        res.json({ success: true, data: shifts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const autoSchedule = async (req, res) => {
    try {
        const { startDate, endDate } = req.body;
        const result = await shiftService.autoSchedule(req.user.id, { startDate, endDate });
        res.status(201).json({ success: true, count: result.length, message: 'Tạo lịch tự động thành công' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const createShift = async (req, res) => {
    try {
        const shift = await shiftService.createShift(req.user.id, req.body);
        res.status(201).json({ success: true, data: shift });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const assignShift = async (req, res) => {
    try {
        const assignment = await shiftService.assignShift(req.user.id, req.body);
        res.status(201).json({ success: true, data: assignment });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getSchedule = async (req, res) => {
    try {
        const schedule = await shiftService.getSchedule(req.query);
        res.json({ success: true, data: schedule });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const checkIn = async (req, res) => {
    try {
        const result = await shiftService.checkIn(req.user.id, req.params.id);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const checkOut = async (req, res) => {
    try {
        const result = await shiftService.checkOut(req.user.id, req.params.id);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
