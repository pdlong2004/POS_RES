import Booking from '../../models/Booking.js';
import Notification from '../../models/Notification.js';
import { io } from '../server.js';

export const createBooking = async (req, res) => {
    try {
        const { customerName, customerPhone, numberOfGuests, bookingDate, bookingTime, note } = req.body;

        if (!customerName || !customerPhone || !numberOfGuests || !bookingDate || !bookingTime) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng điền đầy đủ thông tin bắt buộc',
            });
        }

        const selectedDate = new Date(bookingDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            return res.status(400).json({
                success: false,
                message: 'Ngày đặt bàn phải từ hôm nay trở đi',
            });
        }

        const booking = await Booking.create({
            customerName,
            customerPhone,
            numberOfGuests,
            bookingDate,
            bookingTime,
            note: note || '',
        });

        // Tạo thông báo cho admin
        const notification = await Notification.create({
            title: 'Khách đặt bàn mới',
            message: `Khách hàng ${customerName} (${customerPhone}) vừa đặt bàn cho ${numberOfGuests} người lúc ${bookingTime} ngày ${new Date(bookingDate).toLocaleDateString('vi-VN')}.`,
            type: 'booking',
            link: '/admin/bookings',
        });

        // Bắn sự kiện realtime
        io.emit('newNotification', notification);

        res.status(201).json({
            success: true,
            message: 'Đặt bàn thành công! Chúng tôi sẽ liên hệ với bạn sớm.',
            data: booking,
        });
    } catch (error) {
        console.error('Create booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi hệ thống khi đặt bàn',
        });
    }
};

export const getBookings = async (req, res) => {
    try {
        const { status, date } = req.query;
        const filter = {};

        if (status) {
            filter.status = status;
        }

        if (date) {
            const selectedDate = new Date(date);
            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);

            filter.bookingDate = {
                $gte: selectedDate,
                $lt: nextDay,
            };
        }

        const bookings = await Booking.find(filter).populate('tableId').sort({ bookingDate: 1, bookingTime: 1 });

        res.status(200).json({
            success: true,
            data: bookings,
        });
    } catch (error) {
        console.error('Get bookings error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi hệ thống khi lấy danh sách đặt bàn',
        });
    }
};

export const getBookingById = async (req, res) => {
    try {
        const { id } = req.params;

        const booking = await Booking.findById(id).populate('tableId');

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy thông tin đặt bàn',
            });
        }

        res.status(200).json({
            success: true,
            data: booking,
        });
    } catch (error) {
        console.error('Get booking by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi hệ thống',
        });
    }
};

export const updateBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const booking = await Booking.findByIdAndUpdate(id, updateData, { new: true }).populate('tableId');

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy thông tin đặt bàn',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Cập nhật thành công',
            data: booking,
        });
    } catch (error) {
        console.error('Update booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi hệ thống',
        });
    }
};

export const deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;

        const booking = await Booking.findByIdAndUpdate(id, { status: 'cancelled' }, { new: true });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy thông tin đặt bàn',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Hủy đặt bàn thành công',
            data: booking,
        });
    } catch (error) {
        console.error('Delete booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi hệ thống',
        });
    }
};
