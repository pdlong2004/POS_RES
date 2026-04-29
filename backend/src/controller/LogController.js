import logService from '../services/log.service.js';

export const getLogs = async (req, res) => {
    try {
        const { page, limit, action, entity, userId } = req.query;
        const filters = {};
        if (action) filters.action = action;
        if (entity) filters.entity = entity;
        if (userId) filters.accountId = userId;
        
        const logs = await logService.getLogs(filters, parseInt(page) || 1, parseInt(limit) || 50);
        res.json({ success: true, data: logs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
