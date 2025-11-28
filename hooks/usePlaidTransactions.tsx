// hooks/usePlaidTransactions.tsx
import { supabase } from '@/config/supabase.config';
import { useQuery } from '@tanstack/react-query';
import { usePlaidItems } from './usePlaidItems';

interface Transaction {
    id: string;
    name: string;
    amount: number;
    date: string;
    category: string[];
    pending: boolean;
    merchant_name: string | null;
}

// hooks/usePlaidTransactions.tsx
export const usePlaidTransactions = () => {
    const { data: plaidItems = [], isLoading: isLoadingItems } = usePlaidItems();

    const {
        data: transactions = [],
        isLoading,
        error,
        refetch
    } = useQuery<Transaction[]>({
        queryKey: ['plaid', 'transactions'],
        queryFn: async () => {
            try {
                // 1) Fetch transactions directly without syncing first
                // The sync should be handled by the backend when the item is linked
                const { data: allTransactions, error: txError } = await supabase
                    .from('transactions')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(100);

                if (txError) {
                    console.error('Error fetching transactions:', txError);
                    return [];
                }

                // 2) Transform the data to match the expected format
                return (allTransactions || []).map(tx => ({
                    id: tx.id,
                    name: tx.name || tx.description || 'Unknown Transaction',
                    amount: parseFloat(tx.amount) || 0,
                    date: tx.date || tx.created_at,
                    category: Array.isArray(tx.category)
                        ? tx.category
                        : [tx.category || 'Uncategorized'],
                    pending: Boolean(tx.pending),
                    merchant_name: tx.merchant_name || null
                }));

            } catch (error) {
                console.error('Error in usePlaidTransactions:', error);
                return []; // Return empty array on error to prevent UI breakage
            }
        },
        enabled: true, // Always enable to fetch transactions if user is authenticated
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    return {
        transactions,
        isLoading: isLoading || isLoadingItems,
        error,
        refetch,
    };
};