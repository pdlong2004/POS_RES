import Category from '../../models/Category.js';
import Products from '../../models/Product.js';
import { io } from '../server.js';

export const getProducts = async (req, res) => {
    try {
        const product = await Products.find().populate('categoryId');
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createProduct = async (req, res) => {
    try {
        const product = await Products.create(req.body);
        res.status(201).json(product);
    } catch (error) {
        console.error('Loi khi goi createProduct', error);
        res.status(500).json({ message: 'Loi he thong' });
    }
};

export const getProductsByCategorySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const category = await Category.findOne({ slug });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category không tồn tại',
            });
        }

        const products = await Products.find({
            categoryId: category._id,
        }).populate('categoryId', 'name slug');

        res.status(200).json({
            success: true,
            data: products,
        });
    } catch (error) {
        console.error('Lỗi lọc sản phẩm theo slug:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
        });
    }
};

export const getProductStats = async (req, res) => {
    try {
        const totalProducts = await Products.countDocuments();

        res.json({
            totalProducts,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Lỗi server',
        });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedProduct = await Products.findByIdAndUpdate(id, req.body, { new: true }).populate('categoryId');
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
        }
        
        // Notify clients about the update if stock_quantity or anything else changed
        io.emit('stockUpdated', { 
            productId: updatedProduct._id, 
            newStock: updatedProduct.stock_quantity,
            product: updatedProduct
        });
        
        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error('Lỗi khi cập nhật sản phẩm', error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Products.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
        }
        res.status(200).json({ message: 'Đã xóa sản phẩm thành công' });
    } catch (error) {
        console.error('Lỗi khi xóa sản phẩm', error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
};
