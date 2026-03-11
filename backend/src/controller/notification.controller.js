import Notification from '../../models/Notification.js';

export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find().sort({ createdAt: -1 }).limit(50);
        res.status(200).json({ success: true, data: notifications });
    } catch (error) {
        console.error('Lỗi khi lấy thông báo', error);
        res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
    }
};

export const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
        
        if (!notification) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy thông báo' });
        }
        res.status(200).json({ success: true, data: notification });
    } catch (error) {
        console.error('Lỗi khi cập nhật thông báo', error);
        res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
    }
};

export const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany({ isRead: false }, { isRead: true });
        res.status(200).json({ success: true, message: 'Đã đánh dấu đọc tất cả' });
    } catch (error) {
        console.error('Lỗi khi cập nhật tất cả thông báo', error);
        res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
    }
};
