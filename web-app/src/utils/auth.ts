/**
 * Get the access token from localStorage
 */
export const getAccessToken = (): string | null => {
    return localStorage.getItem('accessToken');
};

/**
 * Get the refresh token from localStorage
 */
export const getRefreshToken = (): string | null => {
    return localStorage.getItem('refreshToken');
};

/**
 * Create headers with authorization token
 */
export const createAuthHeaders = (): HeadersInit => {
    const token = getAccessToken();
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
    const headers = createAuthHeaders();
    
    // Merge headers
    options.headers = {
        ...headers,
        ...(options.headers || {}),
    };
    
    // Make request
    let response = await fetch(url, options);
    
    // If unauthorized, try to refresh token
    if (response.status === 401 || response.status === 403) {
        const refreshToken = getRefreshToken();
        
        if (refreshToken) {
            try {
                // Attempt to refresh the token
                const refreshResponse = await fetch('/api/auth/refresh', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ refreshToken }),
                });
                
                if (refreshResponse.ok) {
                    const { accessToken, refreshToken: newRefreshToken } = await refreshResponse.json();
                    
                    // Update tokens in storage
                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('refreshToken', newRefreshToken);
                    
                    // Retry original request with new token
                    options.headers = {
                        ...options.headers,
                        'Authorization': `Bearer ${accessToken}`,
                    };
                    
                    response = await fetch(url, options);
                } else {
                    // Refresh failed, clear auth and redirect to login
                    localStorage.removeItem('user');
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    window.location.href = '/login';
                }
            } catch (error) {
                console.error('Token refresh error:', error);
                localStorage.removeItem('user');
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
            }
        } else {
            // No refresh token, redirect to login
            window.location.href = '/login';
        }
    }
    
    return response;
};
