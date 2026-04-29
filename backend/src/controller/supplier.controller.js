import Supplier from '../../models/Supplier.js';

export const getSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: suppliers });
    } catch (error) {
        console.error('getSuppliers Error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

export const createSupplier = async (req, res) => {
    try {
        const { name, contactPerson, phone, email, address, taxCode, status } = req.body;
        if (!name) return res.status(400).json({ success: false, message: 'Tên nhà cung cấp bắt buộc' });

        const newSupplier = await Supplier.create({ 
            name, 
            contactPerson, 
            phone, 
            email, 
            address, 
            taxCode, 
            status 
        });
        res.status(201).json({ success: true, data: newSupplier });
    } catch (error) {
        console.error('createSupplier Error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

export const updateSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, contactPerson, phone, email, address, taxCode, status } = req.body;

        const supplier = await Supplier.findByIdAndUpdate(
            id, 
            { name, contactPerson, phone, email, address, taxCode, status }, 
            { new: true }
        );
        if (!supplier) return res.status(404).json({ success: false, message: 'Nhà cung cấp không tồn tại' });
        
        res.status(200).json({ success: true, data: supplier });
    } catch (error) {
        console.error('updateSupplier Error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

export const deleteSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Supplier.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ success: false, message: 'Nhà cung cấp không tồn tại' });

        res.status(200).json({ success: true, message: 'Đã xóa nhà cung cấp' });
    } catch (error) {
        console.error('deleteSupplier Error:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};
