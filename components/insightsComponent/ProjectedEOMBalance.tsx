import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

// Dummy hook implementations
const useSupabaseUser = () => {
    return {
        supabase: {},
        user: {
            id: '1',
            user_metadata: {
                income: '5000',
                savings: '500',
                investments: '300',
                fixedExpenses: {
                    rentMortgage: '1500',
                    utilities: '200',
                    phone: '100',
                    internet: '80',
                    additional: []
                }
            }
        },
        loading: false,
        error: null
    };
};

// Dummy utility functions
const createUTCDate = (year: number, month: number, day: number) => new Date(Date.UTC(year, month, day));
const formatDateToYYYYMMDD = (date: Date) => date.toISOString().split('T')[0];
const calculateMonthlyMetrics = (transactions: any[]) => ({
    totalExpenses: 1250,
    netChange: -1250
});

const safeParseFloat = (value: any): number => {
    if (typeof value === 'number' && !isNaN(value)) return value;
    if (typeof value !== 'string' || value.trim() === '') return 0;
    const number = parseFloat(value);
    return isNaN(number) ? 0 : number;
};

interface ProjectedEOMBalanceProps {
    selectedDate: Date;
}

export default function ProjectedEOMBalance({ selectedDate }: ProjectedEOMBalanceProps) {
    const [finalBalance, setFinalBalance] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [averageDailySpend, setAverageDailySpend] = useState<number | null>(null);
    const [componentTitle, setComponentTitle] = useState('Projected End-of-Month Balance');
    const [subtitle, setSubtitle] = useState('');

    const {
        user: currentUser,
        loading: authLoading,
        error: authError,
    } = useSupabaseUser();

    useEffect(() => {
        if (authLoading) {
            setLoading(true);
            return;
        }

        if (!currentUser) {
            setLoading(false);
            setFinalBalance(null);
            setError(authError ?? 'Please sign in to view your projected balance.');
            return;
        }

        const calculateBalance = async () => {
            setLoading(true);
            setError(authError ?? null);

            try {
                // Mock calculation for demonstration
                const localToday = new Date();
                const todayUTC = createUTCDate(
                    localToday.getFullYear(),
                    localToday.getMonth(),
                    localToday.getDate(),
                );

                const year = selectedDate.getUTCFullYear();
                const month = selectedDate.getUTCMonth();

                const firstDayOfSelectedMonth = createUTCDate(year, month, 1);
                const firstDayOfCurrentMonth = createUTCDate(
                    todayUTC.getUTCFullYear(),
                    todayUTC.getUTCMonth(),
                    1,
                );

                const isPastMonth = firstDayOfSelectedMonth < firstDayOfCurrentMonth;
                const isCurrentMonth = firstDayOfSelectedMonth.getTime() === firstDayOfCurrentMonth.getTime();

                // Mock data
                const avgSpend = 45.67;
                setAverageDailySpend(avgSpend);

                const userMetadata = currentUser.user_metadata || {};
                const totalMonthlyIncome = safeParseFloat(userMetadata.income);
                const monthlySavings = safeParseFloat(userMetadata.savings);
                const monthlyInvestments = safeParseFloat(userMetadata.investments);

                let totalMonthlyFixedExpenses = 0;
                const fixedExpensesData = userMetadata.fixedExpenses || {};
                ['rentMortgage', 'utilities', 'phone', 'internet'].forEach((key) => {
                    if (Object.prototype.hasOwnProperty.call(fixedExpensesData, key)) {
                        totalMonthlyFixedExpenses += safeParseFloat(fixedExpensesData[key]);
                    }
                });

                const initialDiscretionaryBudget = totalMonthlyIncome - totalMonthlyFixedExpenses - monthlySavings - monthlyInvestments;

                // Mock final balance calculation
                let finalCalculatedBalance;
                if (isPastMonth) {
                    setComponentTitle('Actual End-of-Month Balance');
                    setSubtitle(`Based on a final average daily spend of $${avgSpend.toFixed(2)}`);
                    finalCalculatedBalance = 325.50; // Mock past month balance
                } else if (isCurrentMonth) {
                    setComponentTitle('Projected End-of-Month Balance');
                    setSubtitle(`Projection based on average daily spend of $${avgSpend.toFixed(2)}`);
                    finalCalculatedBalance = 187.25; // Mock current month projection
                } else {
                    setComponentTitle('Monthly Discretionary Budget');
                    setSubtitle('This is your starting budget for the selected month.');
                    finalCalculatedBalance = initialDiscretionaryBudget;
                    setAverageDailySpend(0);
                }

                setFinalBalance(finalCalculatedBalance);
            } catch (err: any) {
                console.error('[ProjectedEOM] Error:', err);
                setError(err.message || 'Failed to calculate balance.');
            } finally {
                setLoading(false);
            }
        };

        void calculateBalance();
    }, [authLoading, currentUser, selectedDate, authError]);

    const renderBalance = () => {
        if (loading) {
            return (
                <Text className="text-2xl font-bold text-gray-500 dark:text-gray-400">
                    Calculating...
                </Text>
            );
        }
        if (error) {
            return (
                <Text className="text-lg font-semibold text-red-500 dark:text-red-400">
                    Error
                </Text>
            );
        }
        if (finalBalance === null) {
            return (
                <Text className="text-2xl font-bold text-gray-500 dark:text-gray-400">
                    N/A
                </Text>
            );
        }

        const isPositive = finalBalance >= 0;
        return (
            <View className="flex-row items-center">
                <MaterialIcons
                    name={isPositive ? "trending-up" : "trending-down"}
                    size={24}
                    color={isPositive ? "#4D8066" : "#EF4444"}
                    style={{ marginRight: 8 }}
                />
                <Text className={`text-3xl font-bold ${isPositive ? 'text-[#4D8066]' : 'text-red-500 dark:text-red-400'
                    }`}>
                    {isPositive ? '+' : '-'}${Math.abs(finalBalance).toFixed(2)}
                </Text>
            </View>
        );
    };

    return (
        <View className="p-6 bg-white dark:bg-gray-800 rounded-2xl">
            <Text className="text-xl lg:text-lg xl:text-xl font-semibold text-[#061F12] dark:text-gray-200">
                {componentTitle}
            </Text>
            <Text className="text-xs text-[#434D48] dark:text-gray-400 mt-2">
                {loading ? 'Calculating...' : subtitle}
            </Text>

            <View className="flex-row items-center justify-between border border-[#8FC0A9] rounded-xl p-4 bg-transparent mt-6 lg:mt-8">
                {renderBalance()}

                {/* Placeholder for payment icon - you can replace with actual image */}
                <View className="w-12 h-12 bg-[#8FC0A9] rounded-full items-center justify-center">
                    <MaterialIcons name="attach-money" size={24} color="white" />
                </View>
            </View>

            {/* Additional Info Section */}
            {averageDailySpend !== null && averageDailySpend > 0 && (
                <View className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Average Daily Spend
                    </Text>
                    <Text className="text-lg font-semibold text-[#061F12] dark:text-gray-100">
                        ${averageDailySpend.toFixed(2)}
                    </Text>
                </View>
            )}
        </View>
    );
}