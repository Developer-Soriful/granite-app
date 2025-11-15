import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { G, Line, Text as SvgText } from 'react-native-svg';
import { BarChart, PieChart } from 'react-native-svg-charts';

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
const getMonthDetailsUTC = (year: number, month: number) => ({
    monthName: new Date(year, month).toLocaleString('default', { month: 'long' })
});

const calculateMonthlyMetrics = (transactions: any[]) => ({
    categoryTotals: {
        'Food & Dining': 450,
        'Shopping': 320,
        'Entertainment': 180,
        'Transportation': 120,
        'Bills': 280,
        'Other': 90
    }
});

const fetchMonthTransactions = async () => [];

interface CategoryDataPoint {
    name: string;
    value: number;
    svg?: any;
}

const COLORS = [
    '#E55069',
    '#FFAA00',
    '#BD52CC',
    '#EA580C',
    '#16A34A',
    '#3B82F6',
];

const { width: screenWidth } = Dimensions.get('window');

export default function CategorySpendingChart({ selectedDate }: { selectedDate: Date }) {
    const [categoryData, setCategoryData] = useState<CategoryDataPoint[]>([]);
    const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentMonthName, setCurrentMonthName] = useState('');

    const {
        user,
        loading: authLoading,
        error: authError,
    } = useSupabaseUser();

    // Extract date values to use in dependency array
    const selectedYear = selectedDate.getUTCFullYear();
    const selectedMonth = selectedDate.getUTCMonth();

    useEffect(() => {
        // Early returns
        if (authLoading) {
            return;
        }

        if (!user) {
            setLoading(false);
            setCategoryData([]);
            setError(authError ?? 'Please sign in to view category spending.');
            return;
        }

        const fetchAndProcessSpending = async () => {
            setLoading(true);
            setError(authError ?? null);

            try {
                const monthDetails = getMonthDetailsUTC(selectedYear, selectedMonth);
                setCurrentMonthName(monthDetails.monthName);

                // Use mock data directly to avoid async issues
                const { categoryTotals } = calculateMonthlyMetrics([]);

                const formattedChartData: CategoryDataPoint[] = Object.entries(categoryTotals)
                    .map(([name, value], index) => ({
                        name,
                        value,
                        svg: { fill: COLORS[index % COLORS.length] }
                    }))
                    .sort((a, b) => b.value - a.value);

                setCategoryData(formattedChartData);
            } catch (err: any) {
                console.error('[CategorySpendingChart] Error:', err);
                setError(err.message || 'Failed to load category spending data.');
            } finally {
                setLoading(false);
            }
        };

        // Use setTimeout to break the synchronous update cycle
        const timer = setTimeout(() => {
            void fetchAndProcessSpending();
        }, 0);

        return () => clearTimeout(timer);
    }, [selectedYear, selectedMonth, authLoading, user, authError]);

    const totalSpending = categoryData.reduce((acc, curr) => acc + curr.value, 0);

    // Pie Chart Labels Component
    const PieChartLabels = ({ slices, height, width }: any) => {
        return slices.map((slice: any, index: number) => {
            const { labelCentroid, pieCentroid, data } = slice;
            return (
                <G key={index}>
                    <Line
                        x1={labelCentroid[0]}
                        y1={labelCentroid[1]}
                        x2={pieCentroid[0]}
                        y2={pieCentroid[1]}
                        stroke={data.svg.fill}
                        strokeWidth={2}
                    />
                    <SvgText
                        x={labelCentroid[0]}
                        y={labelCentroid[1]}
                        fill={data.svg.fill}
                        textAnchor="middle"
                        alignmentBaseline="middle"
                        fontSize={12}
                        fontWeight="bold"
                    >
                        {`${((data.value / totalSpending) * 100).toFixed(0)}%`}
                    </SvgText>
                </G>
            );
        });
    };

    // Bar Chart Labels Component
    const BarChartLabels = ({ x, y, bandwidth, data }: any) => {
        return data.map((value: number, index: number) => (
            <SvgText
                key={index}
                x={x(index) + (bandwidth / 2)}
                y={y(value) - 10}
                fontSize={12}
                fill={COLORS[index % COLORS.length]}
                alignmentBaseline="middle"
                textAnchor="middle"
                fontWeight="bold"
            >
                ${value}
            </SvgText>
        ));
    };

    if (loading) {
        return (
            <View className="p-4 items-center justify-center">
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text className="text-gray-500 mt-2">Loading...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View className="p-4 items-center justify-center">
                <Text className="text-red-500 text-center">Error: {error}</Text>
            </View>
        );
    }

    if (categoryData.length === 0) {
        return (
            <View className="p-4 items-center justify-center">
                <Text className="text-gray-500 text-center">No spending data.</Text>
            </View>
        );
    }

    return (
        <View className="p-6 bg-white rounded-2xl">
            <View className="flex-row justify-between items-center mb-4">
                <View>
                    <Text className="text-lg md:text-xl font-semibold text-[#061F12]">
                        Spending by Category
                    </Text>
                    <Text className="text-lg md:text-xl font-semibold text-[#061F12]">
                        ({currentMonthName})
                    </Text>
                </View>

                <View className="flex-row border border-[#DFE5E2] rounded-xl p-1">
                    <TouchableOpacity
                        onPress={() => setChartType('pie')}
                        className={`rounded-lg p-2 ${chartType === 'pie' ? 'bg-[#E6F5EE]' : ''}`}
                    >
                        <MaterialIcons
                            name="pie-chart"
                            size={20}
                            color={chartType === 'pie' ? '#059669' : '#6B7280'}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setChartType('bar')}
                        className={`rounded-lg p-2 ${chartType === 'bar' ? 'bg-[#E6F5EE]' : ''}`}
                    >
                        <MaterialIcons
                            name="bar-chart"
                            size={20}
                            color={chartType === 'bar' ? '#059669' : '#6B7280'}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <View className={`flex-col ${chartType === 'pie' ? 'md:flex-row' : ''} gap-6`}>

                {/* Real Chart Visualization */}
                <View className="w-full h-64 bg-gray-50 rounded-lg items-center justify-center p-4">
                    {chartType === 'pie' ? (
                        // Real Pie Chart
                        <View className="w-full h-full items-center justify-center">
                            <PieChart
                                style={{ height: 200, width: 200 }}
                                valueAccessor={({ item }: any) => item.value}
                                data={categoryData}
                                spacing={0}
                                outerRadius={'95%'}
                                innerRadius={'40%'}
                            >
                                <PieChartLabels />
                            </PieChart>
                            <View className="absolute items-center justify-center">
                                <Text className="text-xl font-bold text-gray-800">${totalSpending.toFixed(0)}</Text>
                                <Text className="text-sm text-gray-500">Total</Text>
                            </View>
                        </View>
                    ) : (
                        // Real Bar Chart
                        <View className="w-full h-full">
                            <BarChart
                                style={{ height: 200 }}
                                data={categoryData.map(item => item.value)}
                                svg={{ fill: 'rgba(92, 153, 124, 0.8)' }}
                                contentInset={{ top: 20, bottom: 20 }}
                                spacing={0.2}
                                gridMin={0}
                                yAccessor={({ item }: any) => item}
                                xAccessor={({ index }: any) => index}
                            >
                                <BarChartLabels />
                            </BarChart>
                            <View className="flex-row justify-between mt-2 px-2">
                                {categoryData.slice(0, 5).map((item, index) => (
                                    <Text
                                        key={index}
                                        className="text-xs text-gray-600 text-center flex-1"
                                        numberOfLines={1}
                                    >
                                        {item.name.split(' ')[0]}
                                    </Text>
                                ))}
                            </View>
                        </View>
                    )}
                </View>

                {/* Category List */}
                <View className="w-full">
                    <Text className="font-medium text-gray-700 mb-3">Categories</Text>
                    <ScrollView>
                        {categoryData.map((item, index) => (
                            <View
                                key={index}
                                className="flex-row justify-between items-center py-2 border-b border-gray-100"
                            >
                                <View className="flex-row items-center gap-3 flex-1">
                                    <View
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                    />
                                    <Text className="text-gray-600 flex-1" numberOfLines={1}>
                                        {item.name}
                                    </Text>
                                </View>
                                <View className="flex-row items-center gap-2">
                                    <Text className="font-medium text-gray-800">
                                        ${item.value.toFixed(2)}
                                    </Text>
                                    <Text className="text-xs text-gray-500">
                                        ({((item.value / totalSpending) * 100).toFixed(0)}%)
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </ScrollView>

                    <View className="flex-row justify-between items-center pt-3 mt-2 border-t border-gray-200">
                        <Text className="font-semibold text-gray-800">Total Spending</Text>
                        <Text className="font-bold text-lg text-[#061F12]">
                            ${totalSpending.toFixed(2)}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
}