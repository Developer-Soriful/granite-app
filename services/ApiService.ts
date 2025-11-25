import { API_URL } from '@/config';
import { supabase } from '@/config/supabase.config';
import axios from 'axios';

// Create axios instance with default config
const ApiService = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
    timeout: 15000,
});

// Request interceptor to add auth token from Supabase session
ApiService.interceptors.request.use(
    async (config) => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
            config.headers.Authorization = `Bearer ${session.access_token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor with error handling
ApiService.interceptors.response.use(
    (response) => response,
    async (error) => {
        // Handle errors
        if (error.response) {
            // Handle specific status codes
            switch (error.response.status) {
                case 401:
                    console.error('Unauthorized: Session may have expired');
                    break;
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