// ==========================
// External Imports
// ==========================

import { Router } from 'express';

// ==========================
// Internal Imports
// ==========================

import {
    register,
    login,
    refresh,
    logout,
    getCurrentUser
} from '../../controllers/authController.js';
import { authenticateToken } from '../../middleware/auth.js';

// ==========================
// Router Initialization
// ==========================

const router = Router();

// ==========================
// Route Definitions
// ==========================

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
router.post('/register', register);

/**
 * @route POST /api/auth/login
 * @description Login user and return tokens
 * @access Public
 */
router.post('/login', login);

/**
 * @route POST /api/auth/refresh
 * @description Refresh access token using refresh token
 * @access Public
 */
router.post('/refresh', refresh);

/**
 * @route POST /api/auth/logout
 * @description Logout user (invalidate refresh token)
 * @access Private
 */
router.post('/logout', authenticateToken, logout);

/**
 * @route GET /api/auth/me
 * @description Get current authenticated user
 * @access Private
 */
router.get('/me', authenticateToken, getCurrentUser);

// ==========================
// Export
// ==========================

export default router;
