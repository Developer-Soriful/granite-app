import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';

// Dummy hook implementations
const useSupabaseUser = () => {
    return {
        supabase: {},
        user: null,
        loading: false,
        error: null
    };
};

// Dummy utility functions
const parseFromSupabase = (date: string) => new Date(date);
const getCurrentMonthDateRange = () => ({ todayUTC: new Date() });
const getMonthDetailsUTC = (year: number, month: number) => ({
    monthName: new Date(year, month).toLocaleString('default', { month: 'long' }),
    daysInMonth: new Date(year, month + 1, 0).getDate()
});
const calculateMonthlyMetrics = (transactions: any[]) => ({ netChange: 0 });
const fetchMonthTransactions = async () => [];
const processUserMetadata = (metadata: any) => ({
    initialDiscretionaryMonthlyBudget: 1000
});
const calculateHistoricalDailyBudget = (budget: number, change: number, days: number, day: number) => budget / days;

interface Transaction {
    transaction_date: string;
    amount: number;
    user_amount?: number | null;
}

interface ChartDataPoint {
    day: number;
    targetBudget: number | null;
    actualBudget: number | null;
}

interface BudgetTrendChartProps {
    selectedDate: Date;
}

export default function BudgetTrendChart({ selectedDate }: BudgetTrendChartProps) {
    const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentMonthName, setCurrentMonthName] = useState('');

    const {
        user,
        loading: authLoading,
        error: authError,
    } = useSupabaseUser();

    useEffect(() => {
        if (authLoading) {
            return;
        }

        if (!user) {
            setChartData([]);
            setLoading(false);
            setError(authError ?? 'Please sign in to view budget trends.');
            return;
        }

        const fetchDataAndCalculateTrend = async () => {
            setLoading(true);
            setError(authError ?? null);

            try {
                const { todayUTC } = getCurrentMonthDateRange();
                const selectedYear = selectedDate.getUTCFullYear();
                const selectedMonth = selectedDate.getUTCMonth();
                const monthDetails = getMonthDetailsUTC(selectedYear, selectedMonth);

                const isCurrentMonth =
                    todayUTC.getUTCFullYear() === selectedYear &&
                    todayUTC.getUTCMonth() === selectedMonth;

                const lastDayToProcess = isCurrentMonth
                    ? todayUTC.getUTCDate()
                    : monthDetails.daysInMonth;

                setCurrentMonthName(monthDetails.monthName);

                const { initialDiscretionaryMonthlyBudget } = processUserMetadata(
                    user.user_metadata,
                );

                const targetDailyBudget =
                    monthDetails.daysInMonth > 0
                        ? initialDiscretionaryMonthlyBudget / monthDetails.daysInMonth
                        : 0;

                // Mock data for demonstration
                const mockData: ChartDataPoint[] = [];
                for (let day = 1; day <= lastDayToProcess; day++) {
                    mockData.push({
                        day: day,
                        targetBudget: targetDailyBudget,
                        actualBudget: targetDailyBudget * (0.8 + Math.random() * 0.4), // Random variation
                    });
                }

                setChartData(mockData);
            } catch (err: any) {
                console.error('[BudgetTrendChart] Error:', err);
                setError(err.message || 'Failed to load budget trend data.');
            } finally {
                setLoading(false);
            }
        };

        void fetchDataAndCalculateTrend();
    }, [selectedDate, authLoading, user, authError]);

    if (loading) {
        return (
            <View className="p-4 items-center justify-center">
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text className="text-gray-500 dark:text-gray-400 mt-2">
                    Loading Budget Trend...
                </Text>
            </View>
        );
    }

    if (error) {
        return (
            <View className="p-4 items-center justify-center">
                <Text className="text-red-500 dark:text-red-400 text-center">
                    Error: {error}
                </Text>
            </View>
        );
    }

    if (chartData.length === 0) {
        return (
            <View className="p-4 items-center justify-center">
                <Text className="text-gray-500 dark:text-gray-400 text-center">
                    No data available to display trend.
                </Text>
            </View>
        );
    }

    return (
        <View className="p-6 bg-white dark:bg-gray-800 rounded-2xl">
            <View className="flex-col xl:flex-row justify-between">
                <View className="flex-1">
                    <Text className="text-xl font-semibold text-[#061F12] dark:text-gray-200">
                        Budget Trend: Target vs. Actual ({currentMonthName})
                    </Text>
                    <Text className="font-normal text-sm text-[#434D48] mt-1">
                        The goal is to keep your Actual at or above your Target.
                    </Text>
                </View>

                {/* Legend - Hidden on small screens, visible on large screens */}
                <View className="hidden lg:flex flex-col gap-4 mt-4 xl:mt-0">
                    <View className="flex-row items-center gap-2">
                        <View className="w-2.5 h-2.5 rounded-full bg-[#5C997C] mt-0.5" />
                        <View>
                            <Text className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                                Target Daily Budget
                            </Text>
                            <Text className="font-normal text-xs text-[#434D48]">
                                Shows your baseline daily budget
                            </Text>
                        </View>
                    </View>

                    <View className="flex-row items-center gap-2">
                        <View className="w-2.5 h-2.5 rounded-full bg-[#3D6E99] mt-0.5" />
                        <View>
                            <Text className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                                Actual Daily Budget
                            </Text>
                            <Text className="font-normal text-xs text-[#434D48]">
                                Updates based on your spending
                            </Text>
                        </View>
                    </View>

                    <View className="flex-row items-center gap-2">
                        <View className="w-2.5 h-2.5 rounded-full bg-[#E53917] mt-0.5" />
                        <View>
                            <Text className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                                Overspending
                            </Text>
                            <Text className="font-normal text-xs text-[#434D48]">
                                Spent more than your daily budget
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Chart Placeholder */}
            <View className="mt-6 h-64 bg-gray-100 dark:bg-gray-700 rounded-lg items-center justify-center">
                <Text className="text-gray-500 dark:text-gray-400 text-center">
                    Chart Visualization\n(Replace with react-native-chart-kit or similar)
                </Text>
                <View className="mt-4">
                    <Text className="text-xs text-gray-500 text-center">
                        Sample Data (Day: Target / Actual):
                    </Text>
                    <ScrollView horizontal className="mt-2">
                        <View className="flex-row space-x-4">
                            {chartData.slice(0, 7).map((item, index) => (
                                <View key={index} className="items-center">
                                    <Text className="text-xs font-semibold">Day {item.day}</Text>
                                    <Text className="text-xs text-[#5C997C]">
                                        T: ${item.targetBudget?.toFixed(0)}
                                    </Text>
                                    <Text className={`text-xs ${(item.actualBudget || 0) >= (item.targetBudget || 0)
                                        ? 'text-[#3D6E99]'
                                        : 'text-[#E53917]'
                                        }`}>
                                        A: ${item.actualBudget?.toFixed(0)}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                </View>
            </View>

            {/* Legend - Visible on small screens, hidden on large screens */}
            <View className="block lg:hidden space-y-4 mt-6">
                <View className="flex-row items-center gap-2">
                    <View className="w-2.5 h-2.5 rounded-full bg-[#5C997C] mt-0.5" />
                    <View>
                        <Text className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                            Target Daily Budget
                        </Text>
                        <Text className="font-normal text-xs text-[#434D48]">
                            Shows your baseline daily budget
                        </Text>
                    </View>
                </View>

                <View className="flex-row items-center gap-2">
                    <View className="w-2.5 h-2.5 rounded-full bg-[#3D6E99] mt-0.5" />
                    <View>
                        <Text className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                            Actual Daily Budget
                        </Text>
                        <Text className="font-normal text-xs text-[#434D48]">
                            Updates based on your spending
                        </Text>
                    </View>
                </View>

                <View className="flex-row items-center gap-2">
                    <View className="w-2.5 h-2.5 rounded-full bg-[#E53917] mt-0.5" />
                    <View>
                        <Text className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                            Overspending
                        </Text>
                        <Text className="font-normal text-xs text-[#434D48]">
                            Spent more than your daily budget
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
}