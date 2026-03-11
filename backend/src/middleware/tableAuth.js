import jwt from 'jsonwebtoken';

export const verifyTableToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Chưa đăng nhập bàn' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.table = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token không hợp lệ' });
    }
};
