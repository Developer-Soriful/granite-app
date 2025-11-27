// hooks/usePlaidTransactions.tsx
import { supabase } from '@/config/supabase.config';
import { PlaidService } from '@/services/plaid';
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
    plaid_item_id?: string;
}

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
            if (plaidItems.length === 0) return [];

            // 1) Sync each item server-side
            for (const item of plaidItems) {
                try {
                    await PlaidService.syncItemTransactions(item.id);
                } catch (e) {
                    console.error(`Error syncing transactions for item ${item.id}:`, e);
                }
            }

            // 2) Fetch from Supabase per item and aggregate
            const aggregated: Transaction[] = [];
            for (const item of plaidItems) {
                const { data: itemTransactions, error: txError } = await supabase
                    .from('transactions')
                    .select('*')
                    .eq('plaid_item_id', item.id)
                    .order('date', { ascending: false });

                if (txError) {
                    console.error(`Error fetching transactions for item ${item.id}:`, txError);
                    continue;
                }
                if (itemTransactions) {
                    aggregated.push(...(itemTransactions as Transaction[]));
                }
            }

            // 3) Sort newest first
            aggregated.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            return aggregated;
        },
        enabled: plaidItems.length > 0,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
    });

    return {
        transactions,
        isLoading: isLoading || isLoadingItems,
        error,
        refetch,
    };
};