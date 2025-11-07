import React, { useState } from "react";
import { Dimensions, Text, View } from "react-native";
import { G, Text as SvgText } from "react-native-svg";
import { PieChart } from "react-native-svg-charts";

const { width } = Dimensions.get("window");
// Define chart size relative to screen width using a number, then apply to style
const CHART_SIZE = width * 0.7;

// --- 1. Data Structure and Types ---
interface CategoryData {
    key: string;
    amount: number;
    svg: {
        fill: string;
    };
    category: string;
}

// --- 2. Chart Colors and Default Data ---
const CHART_COLORS = [
    '#E34141', // Red for Food & Dining
    '#FFB703', // Orange/Yellow for Bills & Utilities
    '#9B59B6', // Purple for Clothes
    '#F28C3D', // Darker Orange for Education
    '#6AA84F', // Green for Groceries
    '#3399CC', // Blue for Other
];

const DEFAULT_DATA: CategoryData[] = [
    { key: 'food', amount: 380.00, svg: { fill: CHART_COLORS[0] }, category: 'Food & Dining' },
    { key: 'bills', amount: 320.00, svg: { fill: CHART_COLORS[1] }, category: 'Bills & Utilities' },
    { key: 'clothes', amount: 210.00, svg: { fill: CHART_COLORS[2] }, category: 'Clothes' },
    { key: 'education', amount: 160.00, svg: { fill: CHART_COLORS[3] }, category: 'Education' },
    { key: 'groceries', amount: 155.00, svg: { fill: CHART_COLORS[4] }, category: 'Groceries' },
    { key: 'other', amount: 100.00, svg: { fill: CHART_COLORS[5] }, category: 'Other' },
];

const SpendingChart = () => {
    const [chartData, setChartData] = useState<CategoryData[]>(DEFAULT_DATA);
    const [totalSpending, setTotalSpending] = useState(
        DEFAULT_DATA.reduce((sum, item) => sum + item.amount, 0)
    );

    // --- API Integration Placeholder ---
    const loadChartData = async () => {
        // ... (API logic remains the same)
        console.log("Data loaded (using default mock data).");
    };

    // --- Center Component for Total Spending (Inner Text) ---
    const CenterLabels = () => {
        return (
            <G>
                <SvgText
                    x={0}
                    y={-10}
                    fontSize={28}
                    fontWeight="600"
                    fill={'#1F2937'}
                    alignmentBaseline={'middle'}
                    textAnchor={'middle'}
                >
                    {`$${totalSpending.toFixed(2)}`}
                </SvgText>
                <SvgText
                    x={0}
                    y={15}
                    fontSize={14}
                    fill={'#6B7280'}
                    alignmentBaseline={'middle'}
                    textAnchor={'middle'}
                >
                    Total spending
                </SvgText>
            </G>
        );
    };

    // --- Component Render ---
    return (
        <View className="bg-white rounded-xl p-4 w-full items-center">
            {/* Header */}
            <View className="flex-row justify-between items-center w-full mb-5">
                <Text className="text-xl font-semibold">
                    Spending by Category
                </Text>
                <View className="flex-row border border-[#dfe4e3] rounded-[12px] p-1">
                    {/* Active Icon */}
                    <View className="py-1 px-2 rounded-md bg-green-100">
                        <Text className="text-base">⚙️</Text>
                    </View>
                    {/* Inactive Icon */}
                    <View className="py-1 px-2 rounded-md">
                        <Text className="text-base">📊</Text>
                    </View>
                </View>
            </View>

            {/* Chart Area */}
            <View className="mb-8">
                <PieChart
                    style={{ height: CHART_SIZE, width: CHART_SIZE }}
                    data={chartData}
                    valueAccessor={({ item }: any) => item.amount}
                    innerRadius={'70%'}
                    outerRadius={'95%'}
                    padAngle={0.02}
                    sort={(a: any, b: any) => b.amount - a.amount}
                >
                    <CenterLabels />
                </PieChart>
            </View>

            {/* Legend/Categories */}
            <View className="w-full mt-2">
                <Text className="text-[16px] font-semibold">
                    Categories
                </Text>
                {chartData.map((item) => (
                    <View key={item.key} className="flex-row items-center justify-between py-2">
                        <View className="flex-row items-center flex-1">
                            {/* Dot uses inline style for dynamic background color */}
                            <View
                                style={{ backgroundColor: item.svg.fill }}
                                className="w-2.5 h-2.5 rounded-full mr-2.5"
                            />
                            <Text className="text-sm text-gray-700">
                                {item.category}
                            </Text>
                        </View>
                        <Text className="text-sm font-semibold text-gray-800">
                            {`$${item.amount.toFixed(2)}`}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

export default SpendingChart;