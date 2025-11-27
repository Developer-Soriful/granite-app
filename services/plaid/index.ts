// services/plaid/index.ts

import { supabase } from '@/config/supabase.config';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

// Helper function for API calls
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = API_URL ? `${API_URL.replace(/\/$/, '')}${endpoint}` : endpoint;

  // Attach Supabase access token via Bearer header (RN does not reliably handle cookies)
  const { data: { session } } = await supabase.auth.getSession();

  console.log(`Making API call to: ${url}`);

  try {
    const response = await fetch(url, {
      credentials: 'omit',
      headers: {
        'Content-Type': 'application/json',
        ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        ...(options.headers || {}),
      },
      ...options,
    });

    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();

      if (!response.ok) {
        console.error(`API Error ${response.status}:`, {
          url,
          status: response.status,
          statusText: response.statusText,
          data,
        });
        throw new Error(
          data?.error || data?.message || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      return data;
    } else {
      const text = await response.text();
      console.warn('Non-JSON response received from', url, 'first bytes:', text.slice(0, 120));
      throw new Error(`Expected JSON response, got ${contentType}`);
    }
  } catch (error) {
    console.error('API call failed:', {
      url,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

export const PlaidService = {
  // 1. Get Link Token
  getLinkToken: async (): Promise<string> => {
    console.log('Getting Plaid link token...');
    try {
      const data = await apiCall('/api/plaid/link-token', {
        method: 'GET',
      });

      if (!data || !data.link_token) {
        throw new Error('No link_token in response');
      }

      console.log('Successfully received Plaid link token');
      return data.link_token;
    } catch (error) {
      console.error('Failed to get Plaid link token:', error);
      throw new Error(
        error instanceof Error
          ? `Failed to get Plaid link: ${error.message}`
          : 'Failed to get Plaid link token'
      );
    }
  },

  // 2. Exchange Public Token
  exchangeToken: async (publicToken: string) => {
    try {
      return await apiCall('/api/plaid/sync', {
        method: 'POST',
        body: JSON.stringify({ public_token: publicToken }),
      });
    } catch (error) {
      console.error('Error exchanging token:', error);
      throw error;
    }
  },

  // 3. Sync Item Transactions (existing item)
  syncItemTransactions: async (itemId: string) => {
    try {
      const result = await apiCall('/api/plaid/sync', {
        method: 'POST',
        body: JSON.stringify({ item_id: itemId }),
      });

      console.log('Sync completed:', {
        added: result.added,
        modified: result.modified,
        removed: result.removed,
        total: result.total,
      });

      return result;
    } catch (error) {
      console.error('Error syncing item:', error);
      throw error;
    }
  },

  // 4. Remove Item
  removeItem: async (itemId: string) => {
    try {
      return await apiCall('/api/plaid/remove-item', {
        method: 'POST',
        body: JSON.stringify({ item_id: itemId }),
      });
    } catch (error) {
      console.error('Error removing item:', error);
      throw error;
    }
  },
};