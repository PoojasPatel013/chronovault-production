// backend/middleware/auth.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export default async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '') || req.cookies.jwt;
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token, authorization denied'
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Add user to request
            req.user = await User.findById(decoded.userId);
            
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'User not found'
                });
            }
            
            next();
        } catch (err) {
            console.error('JWT verification error:', err);
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }
    } catch (err) {
        console.error('Auth error:', err);
        return res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};
