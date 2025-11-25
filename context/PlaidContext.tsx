// src/context/PlaidContext.tsx
import { API_URL } from "@/config";
import { supabase } from "@/config/supabase.config";
import { PlaidService } from "@/services/plaid";
import { createContext, useContext, useState } from "react";
import { Alert } from "react-native";
import { create, LinkExit, LinkSuccess } from "react-native-plaid-link-sdk";

type Account = any;
type Transaction = any;

type PlaidContextType = {
    accounts: Account[];
    transactions: Transaction[];
    isLoading: boolean;
    error: string | null;
    connectBank: () => Promise<void>;
    reconnectBank: (itemId: string) => Promise<void>;
    removeBank: (itemId: string) => Promise<void>;
    fetchAccounts: () => Promise<void>;
    fetchTransactions: (start: string, end: string) => Promise<void>;
};

const PlaidContext = createContext<PlaidContextType | undefined>(undefined);

export const PlaidProvider = ({ children }: { children: React.ReactNode }) => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAccounts = async () => {
        console.log("Fetching accounts from:", `${API_URL}/api/plaid/accounts`);
        try {
            setIsLoading(true);
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error("No session found");

            const res = await fetch(`${API_URL}/api/plaid/accounts`, {
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                    'Content-Type': 'application/json'
                },
                credentials: "include",
            });
            if (!res.ok) throw new Error("Failed to load accounts");
            const data = await res.json();
            console.log("Accounts response:", data);
            setAccounts(data.accounts || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchTransactions = async (start: string, end: string) => {
        try {
            setIsLoading(true);
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error("No session found");

            const res = await fetch(
                `${API_URL}/api/plaid/transactions?start_date=${start}&end_date=${end}`,
                {
                    headers: {
                        'Authorization': `Bearer ${session.access_token}`,
                        'Content-Type': 'application/json'
                    },
                    credentials: "include"
                }
            );
            if (!res.ok) throw new Error("Failed to load transactions");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const connectBank = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const link_token = await PlaidService.getLinkToken();

            const handler = create({
                token: link_token,
                onSuccess: async (success: LinkSuccess) => {
                    await PlaidService.exchangeToken(success.publicToken);
                    await fetchAccounts();
                    Alert.alert("Success", "Bank connected!");
                },
                onExit: (exit: LinkExit) => {
                    if (exit.error) setError(exit.error.displayMessage || "Cancelled");
                    setIsLoading(false);
                },
            });

            await handler.open();
        } catch (err: any) {
            setError(err.message || "Failed to connect");
            setIsLoading(false);
        }
    };

    const reconnectBank = async (itemId: string) => {
        setIsLoading(true);
        try {
            const link_token = await PlaidService.getUpdateLinkToken(itemId);
            const handler = create({
                token: link_token,
                onSuccess: () => {
                    fetchAccounts();
                    Alert.alert("Success", "Bank reconnected!");
                },
            });
            await handler.open();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const removeBank = async (itemId: string) => {
        Alert.alert("Remove Bank", "Are you sure?", [
            { text: "Cancel" },
            {
                text: "Remove",
                style: "destructive",
                onPress: async () => {
                    await PlaidService.removeItem(itemId);
                    await fetchAccounts();
                    Alert.alert("Removed", "Bank account removed");
                },
            },
        ]);
    };

    return (
        <PlaidContext.Provider value={{
            accounts,
            transactions,
            isLoading,
            error,
            connectBank,
            reconnectBank,
            removeBank,
            fetchAccounts,
            fetchTransactions,
        }}>
            {children}
        </PlaidContext.Provider>
    );
};

export const usePlaid = () => {
    const context = useContext(PlaidContext);
    if (!context) throw new Error("usePlaid must be used within PlaidProvider");
    return context;
};