// src/context/PlaidContext.tsx
import { supabase } from "@/config/supabase.config";
import { PlaidService } from "@/services/plaid";
import { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import {
    LinkExit,
    LinkSuccess,
    create,
    open
} from "react-native-plaid-link-sdk";

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
        console.log("Plaid SDK initialized. Functions available:", {
            create: !!create,
            open: !!open,
        });
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
            setError(null);

            // 1) Get session
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error("No session found");

            // 2) Get user items
            const { data: plaidItems, error: itemsError } = await supabase
                .from('user_plaid_items')
                .select('access_token')
                .eq('user_id', session.user.id);

            if (itemsError) throw itemsError;

            // 3) Get transactions for each item
            const transactionsPromises = plaidItems.map(async (item) => {
                const { data: transactions, error: transactionsError } = await supabase.from('user_plaid_items').select('*').eq('access_token', item.access_token);
                if (transactionsError) throw transactionsError;
                return transactions;
            });

            const transactionsData = await Promise.all(transactionsPromises);
            setTransactions(transactionsData.flat());
        } finally {
            setIsLoading(false);
        }

        // console.log("ACCOUNTS:", JSON.stringify(transactions, null, 2));


    };

    const connectBank = async () => {
        console.log("=== CONNECT BANK STARTED ===");
        setIsLoading(true);
        setError(null);

        try {
            console.log("1. Getting link token...");
            const link_token = await PlaidService.getLinkToken();
            console.log("2. Link token received:", !!link_token);

            if (!link_token) {
                throw new Error("No link token received from backend");
            }

            console.log("3. Configuring Plaid Link with token...");

            // Configure the link with ALL settings including callbacks
            const linkConfig = {
                token: link_token,
                // Add iOS presentation style if on iOS
                // iOSPresentationStyle: LinkIOSPresentationStyle.MODAL,
                // logLevel: LinkLogLevel.DEBUG, // Uncomment for debugging
                noLoadingState: false,
            };

            console.log("4. Calling create() with config...");
            create(linkConfig);

            console.log("5. Waiting before open()...");

            // Wait a bit longer to ensure native module is ready
            await new Promise(resolve => setTimeout(resolve, 1000));

            console.log("6. Attempting to open Plaid Link...");

            // Open with explicit callbacks
            open({
                onSuccess: async (success: LinkSuccess) => {
                    console.log("✅ SUCCESS! Public token received:", success.publicToken.substring(0, 20) + "...");
                    console.log("Metadata:", success.metadata);

                    try {
                        console.log("Exchanging public token...");
                        await PlaidService.exchangePublicToken(success.publicToken);
                        console.log("Token exchanged successfully");

                        await fetchAccounts();
                        Alert.alert("Success", "Bank connected successfully!");
                    } catch (err: any) {
                        console.error("❌ Error exchanging token:", err);
                        setError(err.message || "Failed to connect");
                        Alert.alert("Error", err.message || "Failed to save bank connection");
                    } finally {
                        setIsLoading(false);
                    }
                },
                onExit: (exit: LinkExit) => {
                    console.log("🚪 User exited Plaid Link");
                    console.log("Exit metadata:", exit.metadata);

                    if (exit.error) {
                        console.error("❌ Exit with error:", exit.error);
                        setError(exit.error.displayMessage || "Connection cancelled");
                        Alert.alert("Connection Failed", exit.error.displayMessage || "Could not connect to bank");
                    } else {
                        console.log("User cancelled (no error)");
                    }

                    setIsLoading(false);
                },
            });

            console.log("7. open() called - modal should appear");

        } catch (err: any) {
            console.error("❌ Connect bank error:", err);
            console.error("Error details:", {
                message: err.message,
                name: err.name,
                stack: err.stack
            });

            setError(err.message || "Failed to connect");
            setIsLoading(false);

            Alert.alert(
                "Connection Error",
                err.message || "Could not connect to bank. Please try again."
            );
        }
    };

    const reconnectBank = async (itemId: string) => {
        setIsLoading(true);
        setError(null);

        try {
            console.log("Getting update link token for item:", itemId);
            const link_token = await PlaidService.getLinkToken();

            create({
                token: link_token,
                noLoadingState: false,
            });

            await new Promise(resolve => setTimeout(resolve, 1000));

            open({
                onSuccess: async () => {
                    console.log("✅ Bank reconnected successfully");
                    await fetchAccounts();
                    Alert.alert("Success", "Bank reconnected successfully!");
                    setIsLoading(false);
                },
                onExit: (exit: LinkExit) => {
                    console.log("Reconnect exit:", exit);
                    if (exit.error) {
                        setError(exit.error.displayMessage || "Cancelled");
                        Alert.alert("Error", exit.error.displayMessage || "Could not reconnect");
                    }
                    setIsLoading(false);
                }
            });

        } catch (err: any) {
            console.error("Reconnect bank error:", err);
            setError(err.message || "Failed to reconnect");
            setIsLoading(false);
            Alert.alert("Error", err.message || "Failed to reconnect bank");
        }
    };

    const removeBank = async (itemId: string) => {
        Alert.alert("Remove Bank", "Are you sure you want to remove this bank account?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Remove",
                style: "destructive",
                onPress: async () => {
                    try {
                        await PlaidService.removePlaidItem(itemId);
                        await fetchAccounts();
                        Alert.alert("Removed", "Bank account removed successfully");
                    } catch (err: any) {
                        Alert.alert("Error", "Failed to remove bank account");
                    }
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