import axios from 'axios';
import { getAuthToken, saveAuthToken } from '../utils/auth';

const API_BASE_URL = 'https://www.granitefinance.io';

// Create axios instance with default config
const ApiService = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
    timeout: 15000,
});

// Request interceptor to add auth token
ApiService.interceptors.request.use(
    async (config) => {
        const token = await getAuthToken();
        // console.log("TOKEN FOUND:", token);          // ADD THIS
        // console.log("HEADER SET:", config.headers);   // ADD THIS
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor with token refresh logic
ApiService.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't tried to refresh token yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Attempt to refresh token
                const response = await axios.post(
                    `${API_BASE_URL}/api/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                const { accessToken } = response.data;

                if (accessToken) {
                    // Save the new token
                    await saveAuthToken(accessToken);

                    // Update the Authorization header
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                    // Retry the original request
                    return ApiService(originalRequest);
                }
            } catch (refreshError) {
                console.error('Failed to refresh token:', refreshError);
                // Redirect to login or handle session expiration
                if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                }
                return Promise.reject(refreshError);
            }
        }

        // Handle other errors
        if (error.response) {
            // Handle specific status codes
            switch (error.response.status) {
                case 403:
                    console.error('Forbidden: You do not have permission to access this resource');
                    break;
                case 404:
                    console.error('Resource not found');
                    break;
                case 500:
                    console.error('Server error occurred');
                    break;
                default:
                    console.error('An error occurred:', error.message);
            }
        } else if (error.request) {
            console.error('No response received from server');
        } else {
            console.error('Request error:', error.message);
        }

        return Promise.reject(error);
    }
);

// API endpoints
export const TransactionApi = {
    getRecent: () => ApiService.get('/api/transactions/recent'),
    getByDateRange: (startDate: string, endDate: string) =>
        ApiService.get(`/api/transactions?start=${startDate}&end=${endDate}`),
};

export const InsightsApi = {
    getSpendingByCategory: (month: string) =>
        ApiService.get(`/api/insights/spending?month=${month}`),
    getBudgetTrends: () =>
        ApiService.get('/api/insights/budget-trends'),
    getDailySpending: (month: string) =>
        ApiService.get(`/api/insights/daily-spending?month=${month}`),
};

export const CalendarApi = {
    getUpcomingBills: () =>
        ApiService.get('/api/calendar/upcoming-bills'),
    getMonthlyTransactions: (month: string) =>
        ApiService.get(`/api/calendar/transactions?month=${month}`),
};

// Add auth-related API calls
export const AuthApi = {
    login: (credentials: { email: string; password: string }) =>
        ApiService.post('/api/auth/login', credentials),
    logout: () =>
        ApiService.post('/api/auth/logout'),
    refreshToken: () =>
        ApiService.post('/api/auth/refresh', {}, { withCredentials: true }),
};

// Utility function to set auth token
export const setAuthToken = (token: string | null) => {
    if (token) {
        ApiService.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete ApiService.defaults.headers.common['Authorization'];
    }
};

export default ApiService;