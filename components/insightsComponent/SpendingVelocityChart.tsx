import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

// Dummy hook implementations
const useSupabaseUser = () => {
    return {
        supabase: {},
        user: { id: '1' },
        loading: false,
        error: null
    };
};

// Dummy utility functions
const createUTCDate = (year: number, month: number, day: number) => new Date(Date.UTC(year, month, day));
const formatDateToYYYYMMDD = (date: Date) => date.toISOString().split('T')[0];
const parseFromSupabase = (date: string) => new Date(date);
const getCurrentMonthDateRange = () => ({ todayUTC: new Date() });
const getMonthDetailsUTC = (year: number, month: number) => ({
    monthName: new Date(year, month).toLocaleString('default', { month: 'long' }),
    daysInMonth: new Date(year, month + 1, 0).getDate()
});
const fetchMonthTransactions = async () => [];

interface Transaction {
    transaction_date: string;
    amount: number;
    user_amount?: number | null;
}

interface VelocityDataPoint {
    day: number;
    spent: number;
    fullDate: string;
}

interface SpendingVelocityChartProps {
    selectedDate: Date;
}

export default function SpendingVelocityChart({ selectedDate }: SpendingVelocityChartProps) {
    const router = useRouter();
    const [velocityData, setVelocityData] = useState<VelocityDataPoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentMonthName, setCurrentMonthName] = useState('');
    const [selectedDay, setSelectedDay] = useState<number | null>(null);

    const {
        user,
        loading: authLoading,
        error: authError,
    } = useSupabaseUser();

    const screenWidth = Dimensions.get('window').width;

    // Extract primitive values from selectedDate for stable dependencies
    const selectedYear = selectedDate.getUTCFullYear();
    const selectedMonth = selectedDate.getUTCMonth();

    useEffect(() => {
        if (authLoading) {
            return;
        }

        if (!user) {
            setVelocityData([]);
            setLoading(false);
            setError(authError ?? 'Please sign in to view spending velocity.');
            return;
        }

        const fetchSpendingVelocity = async () => {
            setLoading(true);
            setError(authError ?? null);

            try {
                const { todayUTC } = getCurrentMonthDateRange();
                const monthDetails = getMonthDetailsUTC(selectedYear, selectedMonth);

                const isCurrentMonth =
                    todayUTC.getUTCFullYear() === selectedYear &&
                    todayUTC.getUTCMonth() === selectedMonth;

                const lastDayToProcess = isCurrentMonth
                    ? todayUTC.getUTCDate()
                    : monthDetails.daysInMonth;

                setCurrentMonthName(monthDetails.monthName);

                // Mock data for demonstration
                const mockData: VelocityDataPoint[] = [];
                for (let day = 1; day <= lastDayToProcess; day++) {
                    mockData.push({
                        day: day,
                        spent: Math.floor(Math.random() * 100) + 20, // Random spending between 20-120
                        fullDate: formatDateToYYYYMMDD(createUTCDate(selectedYear, selectedMonth, day)),
                    });
                }

                setVelocityData(mockData);
            } catch (err: any) {
                console.error('[SpendingVelocityChart] Error:', err);
                setError(err.message || 'Failed to load spending velocity data.');
            } finally {
                setLoading(false);
            }
        };

        void fetchSpendingVelocity();
    }, [selectedYear, selectedMonth, authLoading, user, authError]); // FIX: Use primitive values instead of selectedDate object

    const handleDataPointClick = (data: any) => {
        if (data && data.index !== undefined) {
            const clickedData = velocityData[data.index];
            setSelectedDay(clickedData.day);
            // Navigate to calendar with the selected date
            router.push(`/calendar?date=${clickedData.fullDate}`);
        }
    };

    if (loading) {
        return (
            <View className="p-4 items-center justify-center">
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text className="text-gray-500 dark:text-gray-400 mt-2">
                    Loading Spending Velocity...
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

    if (velocityData.length === 0) {
        return (
            <View className="p-4 md:p-6 bg-white dark:bg-gray-800 rounded-2xl">
                <Text className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-200 text-center">
                    Spending Velocity ({currentMonthName})
                </Text>
                <Text className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    No spending recorded this month yet.
                </Text>
            </View>
        );
    }

    // Prepare data for react-native-chart-kit
    const chartData = {
        labels: velocityData.map(d => d.day.toString()),
        datasets: [
            {
                data: velocityData.map(d => d.spent),
                color: () => '#5C997C', // Green color
                strokeWidth: 2,
            },
        ],
    };

    const chartConfig = {
        backgroundColor: '#ffffff',
        backgroundGradientFrom: '#ffffff',
        backgroundGradientTo: '#ffffff',
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(92, 153, 124, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
        style: {
            borderRadius: 16,
        },
        propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: '#5C997C',
            fill: '#ffffff',
        },
        propsForBackgroundLines: {
            strokeDasharray: '3,3',
            stroke: '#E5E7EB',
        },
    };

    return (
        <View className="p-6 bg-white dark:bg-gray-800 rounded-2xl">
            <View>
                <Text className="text-xl font-semibold text-[#061F12] dark:text-gray-200">
                    Total Amount Spent Per Day ({currentMonthName})
                </Text>
                <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Tap on any data point to view details
                </Text>
            </View>

            {/* Chart Container */}
            <View className="mt-6 bg-gray-50 rounded-lg p-4">
                <LineChart
                    data={chartData}
                    width={screenWidth - 80} // Adjust for padding
                    height={220}
                    chartConfig={chartConfig}
                    bezier
                    style={{
                        marginVertical: 8,
                        borderRadius: 16,
                    }}
                    onDataPointClick={handleDataPointClick}
                    withVerticalLines={false}
                    withHorizontalLines={true}
                    withHorizontalLabels={true}
                    withVerticalLabels={true}
                    segments={5}
                    formatYLabel={(value) => `$${value}`}
                    getDotColor={(dataPoint, index) =>
                        selectedDay === velocityData[index]?.day ? '#4D8066' : '#5C997C'
                    }
                    renderDotContent={({ x, y, index }) => (
                        <View
                            key={index}
                            style={{
                                position: 'absolute',
                                left: x - 15,
                                top: y - 30,
                            }}
                        >
                            <Text className="text-xs font-medium text-gray-600">
                                ${velocityData[index]?.spent.toFixed(0)}
                            </Text>
                        </View>
                    )}
                />
            </View>

            {/* Selected Day Info */}
            {selectedDay && (
                <View className="mt-4 p-3 bg-[#5C997C]/10 rounded-lg">
                    <Text className="text-sm font-medium text-[#4D8066] text-center">
                        Selected: {currentMonthName} {selectedDay} - $
                        {velocityData.find(d => d.day === selectedDay)?.spent.toFixed(2)} spent
                    </Text>
                    <Text className="text-xs text-gray-500 text-center mt-1">
                        Tap to view transaction details
                    </Text>
                </View>
            )}

            {/* Legend */}
            <View className="mt-4 flex-row items-center justify-center gap-4">
                <View className="flex-row items-center gap-2">
                    <View className="w-3 h-3 rounded-full bg-[#5C997C]" />
                    <Text className="text-xs text-gray-600">Daily Spending</Text>
                </View>
                <View className="flex-row items-center gap-2">
                    <View className="w-3 h-3 rounded-full bg-[#4D8066]" />
                    <Text className="text-xs text-gray-600">Selected</Text>
                </View>
            </View>
        </View>
    );
}