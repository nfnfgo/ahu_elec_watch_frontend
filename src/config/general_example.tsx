/**
 * Backend URL address used for dev and prod node env.
 */
export const devBackendBaseUrl = 'http://localhost:8000';
export const prodBackendBaseUrl = 'https://your-own-backend-website.com';

/**
 * Auto-selected backend API address.
 */
export const backendBaseUrl =
    process.env.NODE_ENV == 'development' ? devBackendBaseUrl : prodBackendBaseUrl;


export const backendRequestTimeoutMs = 10000