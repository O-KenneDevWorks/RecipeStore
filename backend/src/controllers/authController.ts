import type { Request, Response } from 'express';
import User from '../models/User.js';
import { generateTokens, verifyRefreshToken } from '../utils/jwt.js';

// ==========================
// Authentication Controller
// ==========================

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password } = req.body;

        // Validate input
        if (!name || !email || !password) {
            res.status(400).json({ 
                message: 'Please provide name, email, and password.' 
            });
            return;
        }

        // Check password length
        if (password.length < 6) {
            res.status(400).json({ 
                message: 'Password must be at least 6 characters long.' 
            });
            return;
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            res.status(400).json({ 
                message: 'User with this email already exists.' 
            });
            return;
        }

        // Create new user (password will be hashed by pre-save middleware)
        const user = new User({
            name,
            email: email.toLowerCase(),
            password
        });

        await user.save();

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(
            user._id.toString(),
            user.email
        );

        // Save refresh token to user document
        user.refreshToken = refreshToken;
        await user.save();

        // Send response
        res.status(201).json({
            message: 'User registered successfully.',
            user: user.toJSON(),
            accessToken,
            refreshToken
        });
    } catch (error) {
        console.error('Registration error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ 
            message: 'Error registering user: ' + errorMessage 
        });
    }
};

/**
 * @route POST /api/auth/login
 * @description Authenticate user and return tokens
 * @access Public
 */
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            res.status(400).json({ 
                message: 'Please provide email and password.' 
            });
            return;
        }

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            res.status(401).json({ 
                message: 'Invalid email or password.' 
            });
            return;
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            res.status(401).json({ 
                message: 'Invalid email or password.' 
            });
            return;
        }

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(
            user._id.toString(),
            user.email
        );

        // Save refresh token to user document
        user.refreshToken = refreshToken;
        await user.save();

        // Send response
        res.status(200).json({
            message: 'Login successful.',
            user: user.toJSON(),
            accessToken,
            refreshToken
        });
    } catch (error) {
        console.error('Login error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ 
            message: 'Error during login: ' + errorMessage 
        });
    }
};

/**
 * @route POST /api/auth/refresh
 * @description Refresh access token using refresh token
 * @access Public
 */
export const refresh = async (req: Request, res: Response): Promise<void> => {
    try {
        const { refreshToken } = req.body;

        // Validate input
        if (!refreshToken) {
            res.status(400).json({ 
                message: 'Refresh token is required.' 
            });
            return;
        }

        // Verify refresh token
        const decoded = verifyRefreshToken(refreshToken);
        if (!decoded) {
            res.status(403).json({ 
                message: 'Invalid or expired refresh token.' 
            });
            return;
        }

        // Find user and verify refresh token matches
        const user = await User.findById(decoded.userId);
        if (!user || user.refreshToken !== refreshToken) {
            res.status(403).json({ 
                message: 'Invalid refresh token.' 
            });
            return;
        }

        // Generate new tokens
        const tokens = generateTokens(user._id.toString(), user.email);

        // Update refresh token in database
        user.refreshToken = tokens.refreshToken;
        await user.save();

        // Send response
        res.status(200).json({
            message: 'Token refreshed successfully.',
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
        });
    } catch (error) {
        console.error('Token refresh error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ 
            message: 'Error refreshing token: ' + errorMessage 
        });
    }
};

/**
 * @route POST /api/auth/logout
 * @description Logout user by invalidating refresh token
 * @access Private (requires authentication)
 */
export const logout = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ 
                message: 'User not authenticated.' 
            });
            return;
        }

        // Clear refresh token from database
        await User.findByIdAndUpdate(userId, { refreshToken: null });

        res.status(200).json({ 
            message: 'Logout successful.' 
        });
    } catch (error) {
        console.error('Logout error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ 
            message: 'Error during logout: ' + errorMessage 
        });
    }
};

/**
 * @route GET /api/auth/me
 * @description Get current authenticated user's information
 * @access Private (requires authentication)
 */
export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ 
                message: 'User not authenticated.' 
            });
            return;
        }

        // Find user by ID
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ 
                message: 'User not found.' 
            });
            return;
        }

        // Send response
        res.status(200).json({
            user: user.toJSON()
        });
    } catch (error) {
        console.error('Get current user error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ 
            message: 'Error fetching user: ' + errorMessage 
        });
    }
};
