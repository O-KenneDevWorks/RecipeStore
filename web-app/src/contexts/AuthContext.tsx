import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../interfaces/User';
import * as authAPI from '../api/authAPI';
import { LoginCredentials, RegisterCredentials } from '../interfaces/Auth';

interface AuthContextType {
    user: User | null;
    accessToken: string | null;
    loading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (credentials: RegisterCredentials) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Load user from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedAccessToken = localStorage.getItem('accessToken');
        const storedRefreshToken = localStorage.getItem('refreshToken');

        if (storedUser && storedAccessToken && storedRefreshToken) {
            setUser(JSON.parse(storedUser));
            setAccessToken(storedAccessToken);
            
            // Verify token is still valid
            authAPI.getCurrentUser(storedAccessToken)
                .then((userData) => {
                    setUser(userData);
                    localStorage.setItem('user', JSON.stringify(userData));
                })
                .catch(() => {
                    // Token expired, try to refresh
                    authAPI.refreshAccessToken(storedRefreshToken)
                        .then((tokens) => {
                            setAccessToken(tokens.accessToken);
                            localStorage.setItem('accessToken', tokens.accessToken);
                            localStorage.setItem('refreshToken', tokens.refreshToken);
                            
                            // Get user info with new token
                            return authAPI.getCurrentUser(tokens.accessToken);
                        })
                        .then((userData) => {
                            setUser(userData);
                            localStorage.setItem('user', JSON.stringify(userData));
                        })
                        .catch(() => {
                            // Refresh failed, clear storage
                            localStorage.removeItem('user');
                            localStorage.removeItem('accessToken');
                            localStorage.removeItem('refreshToken');
                            setUser(null);
                            setAccessToken(null);
                        });
                });
        }
        setLoading(false);
    }, []);

    const login = async (credentials: LoginCredentials) => {
        try {
            const response = await authAPI.login(credentials);
            setUser(response.user);
            setAccessToken(response.accessToken);
            
            // Store in localStorage
            localStorage.setItem('user', JSON.stringify(response.user));
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);
        } catch (error) {
            throw error;
        }
    };

    const register = async (credentials: RegisterCredentials) => {
        try {
            const response = await authAPI.register(credentials);
            setUser(response.user);
            setAccessToken(response.accessToken);
            
            // Store in localStorage
            localStorage.setItem('user', JSON.stringify(response.user));
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            if (accessToken) {
                await authAPI.logout(accessToken);
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear state and localStorage
            setUser(null);
            setAccessToken(null);
            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        }
    };

    const value: AuthContextType = {
        user,
        accessToken,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user && !!accessToken,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
