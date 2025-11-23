import axios from 'axios';

const API_BASE_URL = 'https://www.granitefinance.io';

const ApiService = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
    timeout: 15000,
});

ApiService.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor — error handle (optional)
ApiService.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.log('Unauthorized — redirect to login');
            // Optional: redirect to login screen
        }
        return Promise.reject(error);
    }
);

export const TransactionApi = {
    getRecent: () => ApiService.get('/api/transactions/recent'),
    getByDateRange: (startDate: string, endDate: string) =>
        ApiService.get(`/api/transactions?start=${startDate}&end=${endDate}`),
};
console.log("🚀 ~ ApiService ~ TransactionApi:", TransactionApi)
export const InsightsApi = {
    getSpendingByCategory: (month: string) => ApiService.get(`/api/insights/spending?month=${month}`),
    getBudgetTrends: () => ApiService.get('/api/insights/budget-trends'),
    getDailySpending: (month: string) => ApiService.get(`/api/insights/daily-spending?month=${month}`),
};

export const CalendarApi = {
    getUpcomingBills: () => ApiService.get('/api/calendar/upcoming-bills'),
    getMonthlyTransactions: (month: string) => ApiService.get(`/api/calendar/transactions?month=${month}`),
};

export default ApiService;