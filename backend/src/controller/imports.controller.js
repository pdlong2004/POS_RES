import Import from '../../models/Import.js';
import ImportDetail from '../../models/ImportDetail.js';
import Product from '../../models/Product.js';
import { io } from '../server.js';

export const createImport = async (req, res) => {
    try {
        const { supplierId, items } = req.body;
        // employeeId should typically come from req.user._id if auth middleware stores it.
        // Assuming req.user is populated by verifyToken
        const employeeId = req.user ? req.user.id : null; 

        if (!supplierId || !items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ success: false, message: 'Dữ liệu không hợp lệ' });
        }

        // 1. Tính toán tổng tiền
        const totalPrice = items.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity) || 0), 0);

        // 2. Tạo Import record
        const newImport = await Import.create({
            supplierId,
            employeeId,
            totalPrice
        });

        // 3. Tạo ImportDetail records & Tăng số lượng kho
        const importData = items.map(item => ({
            importId: newImport._id,
            productId: item.productId,
            quantity: Number(item.quantity),
            price: Number(item.price)
        }));

        await ImportDetail.insertMany(importData);

        for (const item of items) {
            await Product.findByIdAndUpdate(item.productId, {
                $inc: { stock_quantity: Number(item.quantity) }
            });
            // Emit real-time update
            io.emit('stockUpdated', { productId: item.productId, quantityAdded: Number(item.quantity) });
        }

        res.status(201).json({ success: true, message: 'Nhập hàng thành công', data: newImport });
    } catch (error) {
        console.error('createImport Error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

export const getImports = async (req, res) => {
    try {
        const imports = await Import.find()
            .populate('supplierId', 'name phone')
            .sort({ createdAt: -1 });
            
        res.status(200).json({ success: true, data: imports });
    } catch (error) {
        console.error('getImports Error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

export const getImportDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const imp = await Import.findById(id).populate('supplierId', 'name phone address');
        if (!imp) return res.status(404).json({ success: false, message: 'Không tìm thấy phiếu nhập' });

        const details = await ImportDetail.find({ importId: id }).populate('productId', 'name image categoryId');
        
        res.status(200).json({ success: true, data: { import: imp, details } });
    } catch (error) {
        console.error('getImportDetails Error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};
