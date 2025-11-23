// context/PlaidContext.tsx
import React, { createContext, useContext, useState } from 'react';
import * as PlaidService from '../services/plaid';

interface PlaidAccount {
    id: string;
    name: string;
    mask: string;
    type: string;
    subtype: string;
    item_id: string;
    institution_name: string;
    balances: {
        available: number | null;
        current: number;
        limit: number | null;
    };
}

interface PlaidTransaction {
    id: string;
    account_id: string;
    amount: number;
    category: string[];
    date: string;
    merchant_name: string | null;
    name: string;
    pending: boolean;
}

type PlaidContextType = {
    linkToken: string | null;
    accounts: PlaidAccount[];
    transactions: PlaidTransaction[];
    isLoading: boolean;
    error: string | null;
    fetchLinkToken: () => Promise<void>;
    exchangePublicToken: (publicToken: string, metadata: any) => Promise<void>;
    fetchAccounts: () => Promise<void>;
    fetchTransactions: (startDate: string, endDate: string) => Promise<void>;
    createUpdateLinkToken: (itemId: string) => Promise<string>;
    removePlaidItem: (itemId: string) => Promise<void>;
};

const PlaidContext = createContext<PlaidContextType | undefined>(undefined);

export const PlaidProvider = ({ children }: { children: React.ReactNode }) => {
    const [linkToken, setLinkToken] = useState<string | null>(null);
    const [accounts, setAccounts] = useState<PlaidAccount[]>([]);
    const [transactions, setTransactions] = useState<PlaidTransaction[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchLinkToken = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const token = await PlaidService.createLinkToken('current-user-id');
            setLinkToken(token);
        } catch (err) {
            setError('Failed to connect to Plaid. Please try again.');
            console.error('Error creating link token:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const createUpdateLinkToken = async (itemId: string) => {
        try {
            setIsLoading(true);
            const token = await PlaidService.createUpdateLinkToken(itemId);
            return token;
        } catch (err) {
            setError('Failed to update bank connection. Please try again.');
            console.error('Error creating update link token:', err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const exchangePublicToken = async (publicToken: string, metadata: any) => {
        try {
            setIsLoading(true);
            const result = await PlaidService.exchangePublicToken(publicToken, metadata);
            await fetchAccounts();
            return result;
        } catch (err) {
            setError('Failed to connect account. Please try again.');
            console.error('Error exchanging public token:', err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAccounts = async () => {
        try {
            setIsLoading(true);
            const data = await PlaidService.getAccounts();
            setAccounts(data.accounts || []);
        } catch (err) {
            setError('Failed to load accounts. Please try again.');
            console.error('Error fetching accounts:', err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const fetchTransactions = async (startDate: string, endDate: string) => {
        try {
            setIsLoading(true);
            const data = await PlaidService.getTransactions(startDate, endDate);
            setTransactions(data.transactions || []);
        } catch (err) {
            setError('Failed to load transactions. Please try again.');
            console.error('Error fetching transactions:', err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const removePlaidItem = async (itemId: string) => {
        try {
            setIsLoading(true);
            await PlaidService.removePlaidItem(itemId);
            await fetchAccounts();
        } catch (err) {
            setError('Failed to remove bank account. Please try again.');
            console.error('Error removing Plaid item:', err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <PlaidContext.Provider
            value={{
                linkToken,
                accounts,
                transactions,
                isLoading,
                error,
                fetchLinkToken,
                exchangePublicToken,
                fetchAccounts,
                fetchTransactions,
                createUpdateLinkToken,
                removePlaidItem,
            }}
        >
            {children}
        </PlaidContext.Provider>
    );
};

export const usePlaid = () => {
    const context = useContext(PlaidContext);
    if (context === undefined) {
        throw new Error('usePlaid must be used within a PlaidProvider');
    }
    return context;
};