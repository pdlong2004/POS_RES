import mongoose from 'mongoose';
import Table from '../../models/Table.js';
import StatusTable from '../../models/StatusTable.js';
import jwt from 'jsonwebtoken';

export const loginByQRCode = async (req, res) => {
    try {
        const { tableId } = req.body;

        if (!tableId || typeof tableId !== 'string') {
            return res.status(400).json({ message: 'Thiếu tableId' });
        }

        const id = tableId.trim();
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Mã bàn không hợp lệ' });
        }

        const table = await Table.findById(id).populate('statusId');

        if (!table || table.isDeleted) {
            return res.status(404).json({ message: 'Bàn không tồn tại' });
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error('JWT_SECRET chưa được cấu hình trong .env');
            return res.status(500).json({ message: 'Lỗi cấu hình server' });
        }

        const token = jwt.sign(
            {
                tableId: String(table._id),
                tableName: table.name || '',
                role: 'table',
            },
            secret,
            { expiresIn: '12h' },
        );

        const tablePlain = table.toObject ? table.toObject() : { _id: table._id, name: table.name };

        // mark table as occupied when a client logs in via QR
        try {
            const occupied = await StatusTable.findOne({ code: 'occupied' });
            if (occupied) {
                table.statusId = occupied._id;
                await table.save();
            }
        } catch (e) {
            console.error('Failed to set table status to occupied:', e);
        }

        res.status(200).json({
            message: 'Đăng nhập bàn thành công',
            token,
            table: tablePlain,
        });
    } catch (error) {
        console.error('QR Login error:', error);
        const message = error.message || 'Lỗi hệ thống';
        res.status(500).json({ message });
    }
};
