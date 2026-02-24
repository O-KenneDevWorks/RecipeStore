import { getAccessToken, getRefreshToken, storeTokens, clearAuth } from '../utils/storage';
import { refreshAccessToken } from '../api/authAPI';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "http://10.0.0.5:3001";

/**
 * Create headers with authorization token
 */
export const createAuthHeaders = async (): Promise<HeadersInit> => {
    const token = await getAccessToken();
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
};

/**
 * Fetch with automatic token refresh on 401/403
 */
export const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
    // Add auth headers
    const headers = await createAuthHeaders();
    
    // Merge headers
    options.headers = {
        ...headers,
        ...(options.headers || {}),
    };
    
    // Make request
    let response = await fetch(url, options);
    
    // If unauthorized, try to refresh token
    if (response.status === 401 || response.status === 403) {
        const refreshToken = await getRefreshToken();
        
        if (refreshToken) {
            try {
                // Attempt to refresh the token
                const tokens = await refreshAccessToken(refreshToken);
                
                // Update tokens in storage
                await storeTokens(tokens.accessToken, tokens.refreshToken);
                
                // Retry original request with new token
                options.headers = {
                    ...options.headers,
                    'Authorization': `Bearer ${tokens.accessToken}`,
                };
                
                response = await fetch(url, options);
            } catch (error) {
                console.error('Token refresh error:', error);
                await clearAuth();
                // Optionally: navigate to login screen
                throw new Error('Authentication expired. Please login again.');
            }
        } else {
            await clearAuth();
            throw new Error('No authentication token found. Please login.');
        }
    }
    
    return response;
};

/**
 * Build full API URL
 */
export const buildApiUrl = (path: string): string => {
    return `${API_BASE_URL}${path}`;
};
