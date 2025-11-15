import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

// Dummy hook implementations
const useSupabaseUser = () => {
    // Make sure this hook returns stable references
    const [state] = useState({
        supabase: {},
        user: { id: '1' },
        loading: false,
        error: null
    });
    return state;
};

// Dummy utility functions - make sure these are stable
const parseFromSupabase = (date: string) => new Date(date);
const getCurrentMonthDateRange = () => ({ todayUTC: new Date() });
const getMonthDetailsUTC = (year: number, month: number) => ({
    monthName: new Date(year, month).toLocaleString('default', { month: 'long' })
});
const fetchMonthTransactions = async () => [];

const formatDisplayDateUTC = (date: Date | null): string => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        timeZone: 'UTC',
    });
};

const getCategoryDisplayProps = (category: string) => {
    const categories: any = {
        'Food & Dining': { icon: 'restaurant', color: '#EF4444', bg: 'bg-red-100' },
        'Shopping': { icon: 'shopping-bag', color: '#F59E0B', bg: 'bg-amber-100' },
        'Entertainment': { icon: 'movie', color: '#8B5CF6', bg: 'bg-purple-100' },
        'Transportation': { icon: 'directions-car', color: '#EA580C', bg: 'bg-orange-100' },
        'Bills': { icon: 'receipt', color: '#16A34A', bg: 'bg-green-100' },
    };

    const defaultProps = { icon: 'shopping-cart', color: '#6B7280', bg: 'bg-gray-100' };
    return { ...defaultProps, ...categories[category] };
};

interface Transaction {
    transaction_date: string;
    amount: number;
    user_amount?: number | null;
    merchant_name?: string;
    name?: string;
    category?: string | null;
    plaid_transaction_id?: string;
}

interface TopExpense {
    id: string;
    merchantName: string;
    category: string;
    amount: number;
    date: string;
}

interface TopExpensesListProps {
    selectedDate: Date;
}

export default function TopExpensesList({ selectedDate }: TopExpensesListProps) {
    const [topExpenses, setTopExpenses] = useState<TopExpense[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentMonthName, setCurrentMonthName] = useState('');
    const router = useRouter();

    const {
        user: currentUser,
        loading: authLoading,
        error: authError,
    } = useSupabaseUser();

    // Extract primitive values from selectedDate for stable dependencies
    const selectedYear = selectedDate.getUTCFullYear();
    const selectedMonth = selectedDate.getUTCMonth();

    // Use useCallback to memoize the fetch function
    const fetchTopExpenses = useCallback(async () => {
        setLoading(true);
        setError(authError ?? null);

        try {
            const { todayUTC } = getCurrentMonthDateRange();
            const monthDetails = getMonthDetailsUTC(selectedYear, selectedMonth);
            const isCurrentMonth =
                todayUTC.getUTCFullYear() === selectedYear &&
                todayUTC.getUTCMonth() === selectedMonth;

            setCurrentMonthName(monthDetails.monthName);

            // Use static mock data to avoid API issues
            const mockExpenses: TopExpense[] = [
                {
                    id: '1',
                    merchantName: 'Whole Foods Market',
                    category: 'Food & Dining',
                    amount: 156.75,
                    date: formatDisplayDateUTC(new Date(selectedYear, selectedMonth, 15))
                },
                {
                    id: '2',
                    merchantName: 'Amazon',
                    category: 'Shopping',
                    amount: 89.99,
                    date: formatDisplayDateUTC(new Date(selectedYear, selectedMonth, 12))
                },
                {
                    id: '3',
                    merchantName: 'Netflix',
                    category: 'Entertainment',
                    amount: 15.99,
                    date: formatDisplayDateUTC(new Date(selectedYear, selectedMonth, 5))
                },
                {
                    id: '4',
                    merchantName: 'Shell Gas Station',
                    category: 'Transportation',
                    amount: 45.50,
                    date: formatDisplayDateUTC(new Date(selectedYear, selectedMonth, 8))
                },
                {
                    id: '5',
                    merchantName: 'Electric Company',
                    category: 'Bills',
                    amount: 120.00,
                    date: formatDisplayDateUTC(new Date(selectedYear, selectedMonth, 1))
                }
            ];

            setTopExpenses(mockExpenses);
        } catch (err: any) {
            console.error('[TopExpensesList] Failed to load expenses:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch expenses');
        } finally {
            setLoading(false);
        }
    }, [selectedYear, selectedMonth, authError]); // Stable dependencies

    useEffect(() => {
        if (authLoading) {
            setLoading(true);
            return;
        }

        if (!currentUser) {
            setLoading(false);
            setTopExpenses([]);
            setError(authError ?? 'Please sign in to view top expenses.');
            return;
        }

        // Use setTimeout to break potential synchronous update cycles
        const timer = setTimeout(() => {
            void fetchTopExpenses();
        }, 0);

        return () => clearTimeout(timer);
    }, [fetchTopExpenses, authLoading, currentUser, authError]); // Stable dependencies

    if (loading) {
        return (
            <View className="p-6 bg-white rounded-2xl">
                <Text className="text-lg font-semibold text-gray-900 mb-4">
                    Top 5 Largest Expenses
                </Text>
                <View className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                        <View key={i} className="h-12 bg-gray-200 rounded-lg" />
                    ))}
                </View>
            </View>
        );
    }

    if (error) {
        return (
            <View className="p-6 bg-white rounded-2xl">
                <Text className="text-red-500 text-center">Error: {error}</Text>
            </View>
        );
    }

    return (
        <View className="p-4 sm:p-6 bg-white dark:bg-gray-900 rounded-2xl w-full flex-1">
            <Text className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Top 5 Largest Expenses ({currentMonthName})
            </Text>

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
            >
                <View className="space-y-3 pb-2">
                    {topExpenses.map((expense, index) => {
                        const { icon, color, bg } = getCategoryDisplayProps(expense.category);

                        return (
                            <View
                                key={expense.id}
                                className={`flex-row items-center justify-between py-3 px-2 rounded-lg ${index < topExpenses.length - 1
                                        ? 'border-b border-gray-200 dark:border-gray-700'
                                        : ''
                                    }`}
                            >
                                <View className="flex-row items-center gap-3 flex-1">
                                    <View className={`w-10 h-10 rounded-xl items-center justify-center ${bg}`}>
                                        <MaterialIcons
                                            name={icon as any}
                                            size={20}
                                            color={color}
                                        />
                                    </View>
                                    <View className="flex-1 min-w-0">
                                        <Text
                                            className="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100"
                                            numberOfLines={1}
                                        >
                                            {expense.merchantName}
                                        </Text>
                                        <Text className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                            {expense.date}
                                        </Text>
                                    </View>
                                </View>
                                <Text className="text-sm sm:text-base font-semibold text-[#061F12] dark:text-red-400 ml-2">
                                    ${expense.amount.toFixed(2)}
                                </Text>
                            </View>
                        );
                    })}
                </View>
            </ScrollView>

            <View className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <TouchableOpacity
                    onPress={() => router.push('/dashboard')}
                    className="flex-row items-center justify-between bg-[#4D8066] p-3 rounded-xl"
                >
                    <Text className="text-white font-medium text-sm">View All Transactions</Text>
                    <FontAwesome name="arrow-right" size={16} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
}