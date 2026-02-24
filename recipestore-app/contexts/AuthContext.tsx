import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../interfaces/User';
import * as authAPI from '../api/authAPI';
import { LoginCredentials, RegisterCredentials } from '../interfaces/Auth';
import * as storage from '../utils/storage';

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

    // Load user from storage on mount
    useEffect(() => {
        const loadAuth = async () => {
            try {
                const storedUser = await storage.getUser();
                const storedAccessToken = await storage.getAccessToken();
                const storedRefreshToken = await storage.getRefreshToken();

                if (storedUser && storedAccessToken && storedRefreshToken) {
                    setUser(storedUser);
                    setAccessToken(storedAccessToken);
                    
                    // Verify token is still valid
                    try {
                        const userData = await authAPI.getCurrentUser(storedAccessToken);
                        setUser(userData);
                        await storage.storeUser(userData);
                    } catch {
                        // Token expired, try to refresh
                        try {
                            const tokens = await authAPI.refreshAccessToken(storedRefreshToken);
                            setAccessToken(tokens.accessToken);
                            await storage.storeTokens(tokens.accessToken, tokens.refreshToken);
                            
                            // Get user info with new token
                            const userData = await authAPI.getCurrentUser(tokens.accessToken);
                            setUser(userData);
                            await storage.storeUser(userData);
                        } catch {
                            // Refresh failed, clear storage
                            await storage.clearAuth();
                            setUser(null);
                            setAccessToken(null);
                        }
                    }
                }
            } catch (error) {
                console.error('Error loading auth:', error);
            } finally {
                setLoading(false);
            }
        };

        loadAuth();
    }, []);

    const login = async (credentials: LoginCredentials) => {
        try {
            const response = await authAPI.login(credentials);
            setUser(response.user);
            setAccessToken(response.accessToken);
            
            // Store in AsyncStorage
            await storage.storeUser(response.user);
            await storage.storeTokens(response.accessToken, response.refreshToken);
        } catch (error) {
            throw error;
        }
    };

    const register = async (credentials: RegisterCredentials) => {
        try {
            const response = await authAPI.register(credentials);
            setUser(response.user);
            setAccessToken(response.accessToken);
            
            // Store in AsyncStorage
            await storage.storeUser(response.user);
            await storage.storeTokens(response.accessToken, response.refreshToken);
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
            // Clear state and storage
            setUser(null);
            setAccessToken(null);
            await storage.clearAuth();
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
