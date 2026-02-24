import { AuthResponse, LoginCredentials, RegisterCredentials } from "../interfaces/Auth";
import { User } from "../interfaces/User";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "http://10.0.0.5:3001";
const AUTH_API_URL = `${API_BASE_URL}/api/auth`;

/**
 * Register a new user
 */
export const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await fetch(`${AUTH_API_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
    }

    return await response.json();
};

/**
 * Login user
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await fetch(`${AUTH_API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
    }

    return await response.json();
};

/**
 * Logout user
 */
export const logout = async (accessToken: string): Promise<void> => {
    const response = await fetch(`${AUTH_API_URL}/logout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Logout failed');
    }
};

/**
 * Refresh access token using refresh token
 */
export const refreshAccessToken = async (refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> => {
    const response = await fetch(`${AUTH_API_URL}/refresh`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Token refresh failed');
    }

    return await response.json();
};

/**
 * Get current user information
 */
export const getCurrentUser = async (accessToken: string): Promise<User> => {
    const response = await fetch(`${AUTH_API_URL}/me`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch user');
    }

    const data = await response.json();
    return data.user;
};
