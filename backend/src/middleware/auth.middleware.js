import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Chưa đăng nhập' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token không hợp lệ' });
    }
};

export const requireRoles = (...allowedRoles) => {
    const normalized = allowedRoles
        .flat()
        .filter(Boolean)
        .map((r) => String(r).trim().toLowerCase());

    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ message: 'Chưa đăng nhập' });

        const role = (req.user.roleName || req.user.role || '').toString().trim().toLowerCase();
        if (!role) return res.status(403).json({ message: 'Không có quyền truy cập' });

        if (normalized.length > 0 && !normalized.includes(role)) {
            return res.status(403).json({ message: 'Không có quyền truy cập' });
        }

        return next();
    };
};
