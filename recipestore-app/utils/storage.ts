import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

/**
 * Storage utilities for authentication tokens and user data
 */

export const storeTokens = async (accessToken: string, refreshToken: string): Promise<void> => {
    try {
        await AsyncStorage.setItem(TOKEN_KEY, accessToken);
        await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    } catch (error) {
        console.error('Error storing tokens:', error);
    }
};

export const getAccessToken = async (): Promise<string | null> => {
    try {
        return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
        console.error('Error getting access token:', error);
        return null;
    }
};

export const getRefreshToken = async (): Promise<string | null> => {
    try {
        return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
    } catch (error) {
        console.error('Error getting refresh token:', error);
        return null;
    }
};

export const storeUser = async (user: any): Promise<void> => {
    try {
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
        console.error('Error storing user:', error);
    }
};

export const getUser = async (): Promise<any | null> => {
    try {
        const userJson = await AsyncStorage.getItem(USER_KEY);
        return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
        console.error('Error getting user:', error);
        return null;
    }
};

export const clearAuth = async (): Promise<void> => {
    try {
        await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY]);
    } catch (error) {
        console.error('Error clearing auth:', error);
    }
};
