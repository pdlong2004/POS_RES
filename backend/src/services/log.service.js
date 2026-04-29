import ActivityLog from '../../models/ActivityLog.js';

class LogService {
    async record(accountId, action, entity, entityId = null, details = {}) {
        try {
            const log = new ActivityLog({
                accountId,
                action,
                entity,
                entityId,
                details
            });
            await log.save();
            return log;
        } catch (error) {
            console.error('Failed to record activity log:', error);
        }
    }

    async getLogs(filters = {}, page = 1, limit = 50) {
        const skip = (page - 1) * limit;
        return await ActivityLog.find(filters)
            .populate('accountId', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
    }
}

export default new LogService();
