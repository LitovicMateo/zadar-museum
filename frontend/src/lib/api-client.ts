/**
 * Centralized Axios API client with interceptors
 * Handles authentication, error handling, and request/response transformation
 */
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Create axios instance with base configuration
const envRoot = import.meta.env.VITE_API_ROOT;
console.log("ENV ROOT", envRoot);

const apiClient = axios.create({
	// If VITE_API_ROOT is provided we expect routes to include the root
	// (e.g. "/api/...") — use empty baseURL to avoid double-prefixing.
	baseURL: envRoot ? '' : 'https://www.ovdjejekosarkasve.com/api',
	headers: {
		'Content-Type': 'application/json'
	},
	timeout: 30000 // 30 second timeout
});

/**
 * Request Interceptor
 * Adds JWT token to requests that require authentication
 */
apiClient.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
		// Get JWT from localStorage
		const token = localStorage.getItem('jwt');

		// Add authorization header if token exists
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}

		return config;
	},
	(error: AxiosError) => {
		return Promise.reject(error);
	}
);

/**
 * Response Interceptor
 * Handles common error scenarios and response transformation
 */
apiClient.interceptors.response.use(
	(response) => {
		// Return response data directly
		return response;
	},
	(error: AxiosError) => {
		if (error.response) {
			// Server responded with error status
			const status = error.response.status;

			switch (status) {
				case 401:
					// Unauthorized - clear auth and redirect to login
					localStorage.removeItem('jwt');
					localStorage.removeItem('user');
					// Only redirect if not already on login page
					if (!window.location.pathname.includes('/login')) {
						window.location.href = '/login';
					}
					break;

				case 403:
					// Forbidden - user doesn't have permission
					break;

				case 404:
					// Not found
					break;

				case 500:
				case 502:
				case 503:
					// Server error
					break;

				default:
					// Other errors
					break;
			}
		} else if (error.request) {
			// Request made but no response received (network error)
		} else {
			// Something else happened
		}

		return Promise.reject(error);
	}
);

export default apiClient;
