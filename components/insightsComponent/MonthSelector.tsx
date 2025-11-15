import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

export default function BudgetTrendChart({ selectedDate }: { selectedDate: Date }) {
    const [chartData, setChartData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentMonthName, setCurrentMonthName] = useState('');

    useEffect(() => {
        // Remove all authentication checks and use static data
        const fetchData = async () => {
            setLoading(true);

            try {
                const monthName = selectedDate.toLocaleString('default', { month: 'long' });
                setCurrentMonthName(monthName);

                // Static mock data
                const mockData = [
                    { day: 1, targetBudget: 50, actualBudget: 45 },
                    { day: 2, targetBudget: 50, actualBudget: 52 },
                    { day: 3, targetBudget: 50, actualBudget: 48 },
                    // ... more mock data
                ];

                setChartData(mockData);
            } catch (err: any) {
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };

        void fetchData();
    }, [selectedDate]);

    if (loading) {
        return (
            <View className="p-4 items-center justify-center">
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text className="text-gray-500 mt-2">Loading Budget Trend...</Text>
            </View>
        );
    }

    if (chartData.length === 0) {
        return (
            <View className="p-4 items-center justify-center">
                <Text className="text-gray-500 text-center">No data available to display trend.</Text>
            </View>
        );
    }

    return (
        <View className="p-6 bg-white  rounded-2xl">
            <Text className="text-xl font-semibold   mb-6">
                Budget Trend: Target vs. Actual ({currentMonthName})
            </Text>
            {/* Your chart content here */}
            <View className="h-64 bg-gray-100 rounded-lg items-center justify-center">
                <Text className="text-gray-500">Chart Visualization</Text>
                <Text className="text-sm text-gray-400 mt-2">Using static data</Text>
            </View>
        </View>
    );
}