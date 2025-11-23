// services/plaid/index.ts
import { API_URL } from '@/config';
import * as SecureStore from 'expo-secure-store';
const PLAID_ITEMS_KEY = 'plaid_items';
const PLAID_ACCESS_TOKEN_KEY = 'plaid_access_token';
export const createUpdateLinkToken = async (itemId: string) => {
  try {
    const response = await fetch(`${API_URL}/api/plaid/update-link-token?item_id=${itemId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${await getAccessToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to create update link token');
    }

    const data = await response.json();
    return data.link_token;
  } catch (error) {
    console.error('Error creating update link token:', error);
    throw error;
  }
};

export const removePlaidItem = async (itemId: string) => {
  try {
    const response = await fetch(`${API_URL}/api/plaid/remove-item`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${await getAccessToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ item_id: itemId }),
    });

    if (!response.ok) {
      throw new Error('Failed to remove Plaid item');
    }

    return await response.json();
  } catch (error) {
    console.error('Error removing Plaid item:', error);
    throw error;
  }
};
export const createLinkToken = async (userId: string) => {
  try {
    const response = await fetch(`${API_URL}/plaid/link-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getAccessToken()}`
      },
      body: JSON.stringify({
        user_id: userId,
        products: ['transactions'],
        country_codes: ['US'],
        language: 'en'
      }),
    });
    const data = await response.json();
    return data.link_token;
  } catch (error) {
    console.error('Error creating link token:', error);
    throw error;
  }
};

export const exchangePublicToken = async (publicToken: string, metadata: any) => {
  try {
    const response = await fetch(`${API_URL}/plaid/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getAccessToken()}`
      },
      body: JSON.stringify({
        public_token: publicToken,
        metadata
      }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error exchanging public token:', error);
    throw error;
  }
};

export const getAccounts = async () => {
  try {
    const response = await fetch(`${API_URL}/plaid/accounts`, {
      headers: {
        'Authorization': `Bearer ${await getAccessToken()}`
      }
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching accounts:', error);
    throw error;
  }
};

export const getTransactions = async (startDate: string, endDate: string) => {
  try {
    const response = await fetch(
      `${API_URL}/plaid/transactions?start_date=${startDate}&end_date=${endDate}`,
      {
        headers: {
          'Authorization': `Bearer ${await getAccessToken()}`
        }
      }
    );
    return await response.json();
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

// Helper functions
const getAccessToken = async (): Promise<string> => {
  return (await SecureStore.getItemAsync(PLAID_ACCESS_TOKEN_KEY)) || '';
};