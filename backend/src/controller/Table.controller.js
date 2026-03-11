import Table from '../../models/Table.js';
import StatusTable from '../../models/StatusTable.js';

export const getAllTables = async (req, res) => {
    try {
        const tables = await Table.find().populate('statusId');
        res.status(200).json(tables);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createTable = async (req, res) => {
    try {
        const emptyStatus = await StatusTable.findOne({ name: 'empty' });

        const table = await Table.create({
            ...req.body,
            statusId: emptyStatus._id,
        });

        res.status(201).json(table);
    } catch (error) {
        console.error('Lỗi khi gọi createTable', error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};

export const updateTableStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { statusId } = req.body;

        const table = await Table.findById(id);
        if (!table) return res.status(404).json({ message: 'Table not found' });

        const status = await StatusTable.findById(statusId);
        if (!status) return res.status(400).json({ message: 'Invalid status' });

        table.statusId = status._id;
        await table.save();

        const updated = await Table.findById(id).populate('statusId');
        res.status(200).json(updated);
    } catch (error) {
        console.error('Error updating table status', error);
        res.status(500).json({ message: error.message });
    }
};
