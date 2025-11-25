// src/context/PlaidContext.tsx
import { API_URL } from "@/config";
import { supabase } from "@/config/supabase.config";
import { PlaidService } from "@/services/plaid";
import { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { LinkExit, LinkSuccess, open } from "react-native-plaid-link-sdk";

// Polyfill btoa for React Native if not available
const polyfillBtoa = (input: string) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let str = input;
    let output = '';

    for (let block = 0, charCode, i = 0, map = chars;
        str.charAt(i | 0) || (map = '=', i % 1);
        output += map.charAt(63 & block >> 8 - i % 1 * 8)) {

        charCode = str.charCodeAt(i += 3 / 4);

        if (charCode > 0xFF) {
            throw new Error("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
        }

        block = block << 8 | charCode;
    }

    return output;
};

const safeBtoa = (str: string) => {
    if (typeof btoa === 'function') {
        return btoa(str);
    }
    return polyfillBtoa(str);
};

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

    useEffect(() => {
        console.log("Plaid SDK initialized. Open function:", !!open);
    }, []);

    const fetchAccounts = async () => {
        console.log("Fetching accounts from Supabase user_plaid_items");
        try {
            setIsLoading(true);
            setError(null);
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                console.log("No session found");
                setAccounts([]);
                return;
            }

            // Fetch directly from Supabase user_plaid_items table
            const { data, error } = await supabase
                .from('user_plaid_items')
                .select('*')
                .eq('user_id', session.user.id);

            if (error) {
                console.error("Supabase error:", error);
                setAccounts([]);
                return;
            }

            console.log("Accounts from Supabase:", data);
            setAccounts(data || []);
        } catch (err: any) {
            console.error("Error fetching accounts:", err);
            setAccounts([]);
            setError(null);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchTransactions = async (start: string, end: string) => {
        try {
            setIsLoading(true);
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error("No session found");

            // Workaround: Backend expects cookie, not just Bearer token
            const sessionStr = JSON.stringify(session);
            const b64Session = safeBtoa(sessionStr);
            const projectRef = "qzbkohynvszmnmybnhiw"; // From Supabase URL

            console.log("Fetching transactions with cookie auth...");

            const res = await fetch(
                `${API_URL}/api/plaid/transactions?start_date=${start}&end_date=${end}`,
                {
                    headers: {
                        'Authorization': `Bearer ${session.access_token}`,
                        'Content-Type': 'application/json',
                        'Cookie': `sb-${projectRef}-auth-token.0=${b64Session.substring(0, 3000)}; sb-${projectRef}-auth-token.1=${b64Session.substring(3000)}`
                    },
                    credentials: "include"
                }
            );

            if (!res.ok) {
                const text = await res.text();
                console.error("Transaction fetch failed:", res.status, text);
                throw new Error(`Failed to load transactions: ${res.status}`);
            }

            const data = await res.json();
            setTransactions(data || []);

        } catch (err: any) {
            console.error("Error fetching transactions:", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const connectBank = async () => {
        setIsLoading(true);
        setError(null);

        try {
            console.log("Getting link token...");
            const link_token = await PlaidService.getLinkToken();
            console.log("Link token received:", link_token ? "Yes" : "No");

            if (!open) {
                throw new Error("Plaid SDK 'open' function is not available. Check SDK version.");
            }

            // Use open() directly with callbacks
            console.log("Opening Plaid Link...");
            await open({
                token: link_token,
                onSuccess: async (success: LinkSuccess) => {
                    console.log("Plaid Link Success:", success);
                    await PlaidService.exchangeToken(success.publicToken);
                    await fetchAccounts();
                    Alert.alert("Success", "Bank connected!");
                    setIsLoading(false);
                },
                onExit: (exit: LinkExit) => {
                    console.log("Plaid Link Exit:", exit);
                    if (exit.error) {
                        setError(exit.error.displayMessage || "Cancelled");
                    }
                    setIsLoading(false);
                },
            });

        } catch (err: any) {
            console.error("Connect bank error:", err);
            setError(err.message || "Failed to connect");
            setIsLoading(false);
        }
    };

    const reconnectBank = async (itemId: string) => {
        setIsLoading(true);

        try {
            const link_token = await PlaidService.getUpdateLinkToken(itemId);

            await open({
                token: link_token,
                onSuccess: async (success: LinkSuccess) => {
                    await fetchAccounts();
                    Alert.alert("Success", "Bank reconnected!");
                    setIsLoading(false);
                },
                onExit: (exit: LinkExit) => {
                    setIsLoading(false);
                }
            });

        } catch (err: any) {
            setError(err.message);
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