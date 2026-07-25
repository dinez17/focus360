import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler.js';
import Admin from '../models/Admin.js';

// Verifies the JWT sent in the Authorization header.
// Attaches the admin document (minus password) to req.admin for use in controllers.
export const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token provided');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = await Admin.findById(decoded.id).select('-password');

        if (!req.admin) {
            res.status(401);
            throw new Error('Admin no longer exists');
        }

        next();
    } catch (error) {
        res.status(401);
        throw new Error('Not authorized, token failed or expired');
    }
});

// Restricts a route to specific roles (usage: authorize('superadmin'))
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.admin.role)) {
            res.status(403);
            throw new Error(`Role '${req.admin.role}' is not authorized to access this resource`);
        }
        next();
    };
};