// hooks/useTransactions.ts
import { TransactionApi } from '@/services/ApiService';
import { useQuery } from '@tanstack/react-query';

export const useRecentTransactions = () => {
    return useQuery({
        queryKey: ['transactions', 'recent'],
        queryFn: () => TransactionApi.getRecent().then(res => res.data || []),
    });
};

export const useMonthlyTransactions = (month: string) => {
    return useQuery({
        queryKey: ['transactions', 'monthly', month],
        queryFn: () => {
            const startDate = new Date(month);
            const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
            return TransactionApi.getByDateRange(
                startDate.toISOString().split('T')[0],
                endDate.toISOString().split('T')[0]
            ).then(res => res.data || []);
        },
    });
};