import StatusTable from '../../models/StatusTable.js';

export const createStatusTable = async (req, res) => {
    try {
        const { code, name, color } = req.body;

        const exists = await StatusTable.findOne({ code });
        if (exists) {
            return res.status(400).json({ message: 'Status đã tồn tại' });
        }

        const status = await StatusTable.create({
            code,
            name,
            color,
        });

        res.status(201).json(status);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllStatusTables = async (req, res) => {
    try {
        const statuses = await StatusTable.find({ isDeleted: { $ne: true } });
        res.status(200).json(statuses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
