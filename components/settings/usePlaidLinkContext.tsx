import React, {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from 'react';
import {
    Alert,
} from 'react-native';

interface PlaidLinkContextValue {
    openLink: (onSuccess?: () => void) => void;
    ready: boolean;
    syncing: boolean;
    loadingToken: boolean;
    error: string | null;
}

const PlaidLinkContext = createContext<PlaidLinkContextValue | null>(null);

interface PlaidLinkProviderProps {
    children: ReactNode;
}

export function PlaidLinkProvider({ children }: PlaidLinkProviderProps) {
    const [syncing, setSyncing] = useState(false);
    const [loadingToken, setLoadingToken] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const openLink = useCallback(async (onSuccess?: () => void) => {
        if (syncing || loadingToken) {
            return;
        }

        setError(null);
        setLoadingToken(true);

        try {
            // Simulate fetching link token
            console.log('🔗 Fetching Plaid link token...');
            await new Promise(resolve => setTimeout(resolve, 1500));

            setLoadingToken(false);
            setSyncing(true);

            // Simulate Plaid Link flow
            console.log('🏦 Opening Plaid Link interface...');

            // Simulate bank selection and connection process
            await new Promise(resolve => setTimeout(resolve, 3000));

            // Mock successful connection with random bank
            const mockBanks = [
                { name: 'Chase Bank', color: '#117ACA' },
                { name: 'Bank of America', color: '#E41E2A' },
                { name: 'Wells Fargo', color: '#E41E2A' },
                { name: 'Citibank', color: '#0080AF' },
                { name: 'Capital One', color: '#004977' }
            ];

            const randomBank = mockBanks[Math.floor(Math.random() * mockBanks.length)];

            Alert.alert(
                '✅ Successfully Connected!',
                `Your ${randomBank.name} account has been securely linked.\n\n💡 This is a demo. In production, this would connect to real bank accounts using Plaid.`,
                [
                    {
                        text: 'Continue',
                        onPress: () => {
                            console.log('🎉 Bank connection completed successfully');
                            if (onSuccess) {
                                onSuccess();
                            }
                        },
                    },
                ]
            );

        } catch (err) {
            const message = 'Failed to connect bank account';
            console.error('[PlaidLinkProvider] Demo error:', err);
            setError(message);
            Alert.alert('❌ Connection Failed', 'Unable to connect to bank. Please try again.');
        } finally {
            setSyncing(false);
            setLoadingToken(false);
        }
    }, [syncing, loadingToken]);

    const contextValue = useMemo<PlaidLinkContextValue>(
        () => ({
            openLink,
            ready: true, // Always ready in demo mode
            syncing,
            loadingToken,
            error,
        }),
        [openLink, syncing, loadingToken, error],
    );

    return (
        <PlaidLinkContext.Provider value={contextValue}>
            {children}

            {/* No actual PlaidLink component in demo mode */}
        </PlaidLinkContext.Provider>
    );
}

export function usePlaidLinkContext() {
    const ctx = useContext(PlaidLinkContext);
    if (!ctx) {
        throw new Error(
            'usePlaidLinkContext must be used within a PlaidLinkProvider',
        );
    }
    return ctx;
}