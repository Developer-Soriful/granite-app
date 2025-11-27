import { supabase } from '@/config/supabase.config';
import axios from 'axios';

// Create axios instance
const ApiService = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
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

// Response interceptor
ApiService.interceptors.response.use(
    (response) => {
        // Check if the response is HTML (which would be an error page)
        const contentType = response.headers['content-type'] || '';
        if (contentType.includes('text/html')) {
            console.warn('Received HTML response instead of JSON');
            return {
                ...response,
                data: { error: 'Server returned an error page' },
                isError: true
            };
        }
        return response;
    },
    (error) => {
        // Handle network errors
        if (!error.response) {
            console.error('Network Error:', error.message);
            return Promise.reject({
                message: 'Network Error: Could not connect to the server',
                isNetworkError: true
            });
        }

        const { status, data, headers } = error.response;
        const isHtml = headers && headers['content-type'] &&
            headers['content-type'].includes('text/html');

        // Handle HTML error pages
        if (isHtml) {
            console.warn('Server returned an HTML error page');
            return Promise.resolve({
                data: {
                    error: 'Server error occurred',
                    status: status || 500
                },
                isError: true
            });
        }

        // Handle other HTTP errors
        if (status === 404) {
            console.warn('Resource not found:', error.config.url);
            return Promise.resolve({
                data: null,
                status: 404,
                statusText: 'Not Found',
                isError: true
            });
        }

        // For all other errors
        return Promise.reject({
            message: data?.message || 'An error occurred',
            status,
            data: data,
            isAxiosError: true
        });
    }
);

export default ApiService;

// Plaid API methods
// Types for Plaid API
type LinkTokenResponse = {
    link_token: string;
};

type SyncTransactionsResponse = {
    success: boolean;
    item_id: string;
};

type RemoveItemResponse = {
    success: boolean;
};

type UpdateLinkTokenParams = {
    item_id: string;
    reason?: 'new_accounts';
};

export const PlaidApi = {
    /**
     * Creates a new Plaid Link token for connecting a bank account
     */
    createLinkToken: (): Promise<LinkTokenResponse> =>
        ApiService.get('/api/plaid/link-token'),

    /**
     * Creates an update mode Link token for an existing item
     * @param params Parameters including item_id and optional reason
     */
    createUpdateLinkToken: (params: UpdateLinkTokenParams): Promise<LinkTokenResponse> => {
        const { item_id, reason } = params;
        return ApiService.get('/api/plaid/update-link-token', {
            params: { item_id, ...(reason && { reason }) }
        });
    },

    /**
     * Exchanges a public token for an access token and starts transaction sync
     * @param publicToken The public token received from Plaid Link
     */
    syncTransactions: (publicToken: string): Promise<SyncTransactionsResponse> =>
        ApiService.post('/api/plaid/sync', { public_token: publicToken }),

    /**
     * Removes a Plaid item and associated data
     * @param itemId The Plaid item ID to remove
     */
    removeItem: (itemId: string): Promise<RemoveItemResponse> =>
        ApiService.post('/api/plaid/remove-item', { item_id: itemId }),
};