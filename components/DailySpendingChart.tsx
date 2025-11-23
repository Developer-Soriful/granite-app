import React from "react";
import { Dimensions, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";

const { width } = Dimensions.get("window");

// API theke je structure asbe
interface DailySpendData {
    day: string;        // "1", "2", etc.
    amount: number;     // 85.50
    date: string;       // "2025-09-01"
}

interface DailySpendingChartProps {
    data?: DailySpendData[] | null;
}

const DailySpendingChart: React.FC<DailySpendingChartProps> = ({ data }) => {
    // 100% SAFE DATA
    const hasData = Array.isArray(data) && data.length > 0;
    const safeData = hasData ? data : [];

    // JODI DATA NAI → PREMIUM EMPTY STATE
    if (!hasData) {
        return (
            <View className="bg-white rounded-[16px] p-6 w-full">
                <Text className="text-xl font-semibold text-gray-900 mb-4">
                    Total Amount Spent Per Day
                </Text>

                {/* Empty Chart Placeholder */}
                <View className="h-60 bg-[#f8f9fa] rounded-xl relative overflow-hidden justify-center items-center">
                    {/* Fake Grid Lines */}
                    <View className="absolute inset-0 px-8 pt-8">
                        {[0, 1, 2, 3, 4].map((i) => (
                            <View key={i} className="h-px bg-[#e5e7eb] my-12" />
                        ))}
                    </View>

                    {/* Fake Spending Line */}
                    <View
                        className="absolute h-1 bg-[#338059]/30"
                        style={{
                            left: 32,
                            right: 32,
                            top: "45%",
                            borderRadius: 4,
                            transform: [{ rotate: "-1deg" }],
                        }}
                    />

                    {/* Empty State Message */}
                    <View className="absolute inset-0 bg-[#f8f9fa]/95 justify-center items-center px-8">
                        <Text className="text-lg font-bold text-gray-700 mb-2">
                            No Spending Data Yet
                        </Text>
                        <Text className="text-sm text-gray-500 text-center">
                            Your daily spending will appear here once you start tracking transactions
                        </Text>
                    </View>
                </View>
            </View>
        );
    }

    // ====== REAL DATA RENDER ======
    const labels = safeData.map((item) => item.day);
    const amounts = safeData.map((item) => item.amount);

    const chartConfig = {
        backgroundColor: "#ffffff",
        backgroundGradientFrom: "#ffffff",
        backgroundGradientTo: "#ffffff",
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(51, 128, 89, ${opacity})`, // Green theme
        labelColor: () => `rgba(0, 0, 0, 0.6)`,
        style: { borderRadius: 16 },
        propsForDots: {
            r: "5",
            strokeWidth: "3",
            stroke: "#ffffff",
        },
        propsForBackgroundLines: {
            stroke: "#e5e7eb",
            strokeDasharray: "",
        },
    };

    return (
        <View className="bg-white rounded-[16px] p-6 w-full">
            <Text className="text-xl font-semibold text-gray-900 mb-4">
                Total Amount Spent Per Day
            </Text>

            <LineChart
                data={{
                    labels,
                    datasets: [
                        {
                            data: amounts,
                            color: () => "#338059",
                            strokeWidth: 3,
                        },
                    ],
                }}
                width={width - 80}
                height={260}
                yAxisLabel="$"
                yAxisInterval={1}
                fromZero
                chartConfig={chartConfig}
                bezier
                withDots={true}
                withShadow={true}
                withInnerLines={true}
                withOuterLines={true}
                style={{
                    borderRadius: 16,
                    paddingRight: 10,
                }}
            />
        </View>
    );
};

export default DailySpendingChart;