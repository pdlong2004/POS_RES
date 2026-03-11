import Account from '../../models/Account.js';
import '../../models/Role.js';
import '../../models/Rank.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const loginAccount = async (req, res) => {
    try {
        const { email, phone, password } = req.body;

        if (!password) {
            return res.status(400).json({ message: 'Thiếu mật khẩu' });
        }

        const query = [];
        if (email) query.push({ email });
        if (phone) query.push({ phone });

        if (query.length === 0) {
            return res.status(400).json({
                message: 'Vui lòng nhập email hoặc số điện thoại',
            });
        }

        const account = await Account.findOne({ $or: query }).populate('roleId').populate('rankId');

        if (!account) {
            return res.status(401).json({ message: 'Tài khoản không tồn tại' });
        }

        if (!account.status) {
            return res.status(403).json({ message: 'Tài khoản đã bị khóa' });
        }

        const isMatch = await bcrypt.compare(password, account.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Sai mật khẩu' });
        }

        const token = jwt.sign(
            {
                id: account._id,
                roleId: account.roleId?._id,
                roleName: account.roleId?.name,
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' },
        );

        res.json({
            message: 'Đăng nhập thành công',
            token,
            account,
        });
    } catch (error) {
        console.error('LOGIN ERROR:', error);
        res.status(500).json({
            message: 'Lỗi server',
            error: error.message,
        });
    }
};
