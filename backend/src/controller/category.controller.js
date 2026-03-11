import Category from '../../models/Category.js';

export const getCategory = async (req, res) => {
    try {
        const category = await Category.find();
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const creatCategory = async (req, res) => {
    try {
        const category = await Category.create(req.body);
        res.status(201).json(category);
    } catch (error) {
        console.error('Lỗi khi gọi creatCategory', error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedCategory = await Category.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!updatedCategory) {
            return res.status(404).json({ message: 'Không tìm thấy danh mục' });
        }
        res.status(200).json(updatedCategory);
    } catch (error) {
        console.error('Lỗi khi gọi updateCategory', error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCategory = await Category.findByIdAndDelete(id);
        if (!deletedCategory) {
            return res.status(404).json({ message: 'Không tìm thấy danh mục' });
        }
        res.status(200).json({ message: 'Xóa danh mục thành công' });
    } catch (error) {
        console.error('Lỗi khi gọi deleteCategory', error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};
