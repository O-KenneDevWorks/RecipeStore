import type { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.js';

// ==========================
// Extend Express Request Type
// ==========================

/**
 * Extend the Express Request interface to include user information
 */
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                email: string;
            };
        }
    }
}

// ==========================
// Authentication Middleware
// ==========================

/**
 * Middleware to verify JWT access token and attach user info to request
 * Protects routes by ensuring a valid access token is present
 */
export const authenticateToken = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        // Check if token exists
        if (!token) {
            res.status(401).json({ 
                message: 'Access denied. No token provided.' 
            });
            return;
        }

        // Verify token
        const decoded = verifyAccessToken(token);

        if (!decoded) {
            res.status(403).json({ 
                message: 'Invalid or expired token.' 
            });
            return;
        }

        // Attach user info to request
        req.user = {
            userId: decoded.userId,
            email: decoded.email
        };

        // Continue to next middleware or route handler
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({ 
            message: 'Internal server error during authentication.' 
        });
    }
};

/**
 * Optional authentication middleware - attaches user if token is valid, but doesn't require it
 * Useful for routes that can work with or without authentication
 */
export const optionalAuth = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (token) {
            const decoded = verifyAccessToken(token);
            if (decoded) {
                req.user = {
                    userId: decoded.userId,
                    email: decoded.email
                };
            }
        }

        next();
    } catch (error) {
        // Continue without authentication
        next();
    }
};
