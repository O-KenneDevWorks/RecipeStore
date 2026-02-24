import jwt from 'jsonwebtoken';

// ==========================
// JWT Configuration
// ==========================

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET || 'your-access-token-secret-change-in-production';
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-token-secret-change-in-production';

// Token expiration times
const ACCESS_TOKEN_EXPIRY = '15m';  // 15 minutes
const REFRESH_TOKEN_EXPIRY = '7d';  // 7 days

// ==========================
// Token Generation
// ==========================

/**
 * Generate an access token for a user
 * @param userId - The user's ID
 * @param email - The user's email
 * @returns {string} - JWT access token
 */
export const generateAccessToken = (userId: string, email: string): string => {
    return jwt.sign(
        { userId, email },
        ACCESS_TOKEN_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRY }
    );
};

/**
 * Generate a refresh token for a user
 * @param userId - The user's ID
 * @param email - The user's email
 * @returns {string} - JWT refresh token
 */
export const generateRefreshToken = (userId: string, email: string): string => {
    return jwt.sign(
        { userId, email },
        REFRESH_TOKEN_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRY }
    );
};

/**
 * Generate both access and refresh tokens
 * @param userId - The user's ID
 * @param email - The user's email
 * @returns Object containing access and refresh tokens
 */
export const generateTokens = (userId: string, email: string) => {
    return {
        accessToken: generateAccessToken(userId, email),
        refreshToken: generateRefreshToken(userId, email)
    };
};

// ==========================
// Token Verification
// ==========================

/**
 * Verify an access token
 * @param token - The access token to verify
 * @returns Decoded token payload or null if invalid
 */
export const verifyAccessToken = (token: string): any => {
    try {
        return jwt.verify(token, ACCESS_TOKEN_SECRET);
    } catch (error) {
        return null;
    }
};

/**
 * Verify a refresh token
 * @param token - The refresh token to verify
 * @returns Decoded token payload or null if invalid
 */
export const verifyRefreshToken = (token: string): any => {
    try {
        return jwt.verify(token, REFRESH_TOKEN_SECRET);
    } catch (error) {
        return null;
    }
};
