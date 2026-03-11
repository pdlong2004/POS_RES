import { postBookingApi } from '@/service/bookingApi.service';
import { useState } from 'react';

export const useBookingForm = () => {
    const [formData, setFormData] = useState({
        customerName: '',
        customerPhone: '',
        numberOfGuests: '',
        bookingDate: '',
        bookingTime: '',
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((p) => ({ ...p, [name]: value }));
        if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
    };

    const handleTimeSelect = (time) => {
        setFormData((p) => ({ ...p, bookingTime: time }));
        if (errors.bookingTime) setErrors((p) => ({ ...p, bookingTime: '' }));
    };

    const validateForm = () => {
        const e = {};

        if (!formData.customerName.trim()) e.customerName = 'Vui lòng nhập tên';

        if (!formData.customerPhone.trim()) {
            e.customerPhone = 'Vui lòng nhập số điện thoại';
        } else if (!/^[0-9]{10,11}$/.test(formData.customerPhone)) {
            e.customerPhone = 'Số điện thoại không hợp lệ';
        }

        if (!formData.numberOfGuests) e.numberOfGuests = 'Vui lòng nhập số người';

        if (!formData.bookingDate) e.bookingDate = 'Vui lòng chọn ngày';

        if (!formData.bookingTime) e.bookingTime = 'Vui lòng chọn giờ';

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setSuccessMessage('');

        try {
            const res = await postBookingApi({
                ...formData,
                numberOfGuests: Number(formData.numberOfGuests),
            });

            if (res.data.success) {
                setSuccessMessage(res.data.message);
                setFormData({
                    customerName: '',
                    customerPhone: '',
                    numberOfGuests: '',
                    bookingDate: '',
                    bookingTime: '',
                });
            }
        } catch (err) {
            setErrors({
                submit: err.response?.data?.message || 'Đặt bàn thất bại',
            });
        } finally {
            setLoading(false);
        }
    };

    return {
        formData,
        errors,
        loading,
        successMessage,
        handleChange,
        handleTimeSelect,
        handleSubmit,
    };
};
