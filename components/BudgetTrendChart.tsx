import React, { useState } from "react";
import { Dimensions, ScrollView, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";

interface ChartDataPoint {
    date: string;
    target: number;
    actual: number;
}

const BudgetTrendChart = () => {
    const screenWidth = Dimensions.get("window").width;
    const [selectedPoint, setSelectedPoint] = useState<{
        x: number;
        y: number;
        index: number;
    } | null>(null);

    // ✅ Default array ensures safety
    const [chartData, setChartData] = useState<ChartDataPoint[]>([
        { date: "1-7", target: 100, actual: 100 },
        { date: "8-14", target: 100, actual: 110 },
        { date: "15-21", target: 100, actual: 165 },
        { date: "22-27", target: 100, actual: 105 },
        { date: "27-30", target: 100, actual: 145 },
        { date: "30-36", target: 100, actual: 155 },
    ]);

    const [targetBudget] = useState(100);

    // ✅ SAFE API handling placeholder
    const loadChartData = async () => {
        try {
            // Example:
            // const response = await fetch('/api/budget');
            // const data = await response.json();

            // ✅ Only update if array
            // if (Array.isArray(data?.chartData)) {
            //   setChartData(data.chartData);
            // } else {
            //   console.warn("Invalid chartData format", data);
            // }

            console.log("Load chart data from API");
        } catch (error) {
            console.error("Error loading chart data:", error);
        }
    };

    // ✅ SAFE array mapping
    const safeData = Array.isArray(chartData) ? chartData : [];

    const labels = safeData.map((item) => item.date);
    const targetData = safeData.map((item) => item.target);
    const actualData = safeData.map((item) => item.actual);

    const handleDataPointClick = (data: any) => {
        const { x, y, index } = data;
        setSelectedPoint({ x, y, index });
    };

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ backgroundColor: "#fefffe", borderRadius: 16, padding: 16 }}
        >
            <View className="flex flex-col gap-4">
                {/* Header */}
                <View className="mb-4">
                    <Text className="text-xl font-bold text-gray-900 mb-2">
                        Budget Trend: Target vs. Actual
                    </Text>
                    <Text className="text-sm text-gray-600 leading-5">
                        The goal is to keep your Actual at or above your Target.
                    </Text>
                </View>

                {/* ✅ Ensure data before rendering */}
                {safeData.length > 0 ? (
                    <View className="relative p-4" style={{ marginLeft: -16 }}>
                        <LineChart
                            data={{
                                labels,
                                datasets: [
                                    {
                                        data: targetData,
                                        color: (opacity = 1) => `rgba(52, 168, 83, ${opacity})`,
                                        strokeWidth: 2,
                                        strokeDashArray: [8, 4],
                                        withDots: false,
                                    },
                                    {
                                        data: actualData,
                                        color: (opacity = 1) => `rgba(70, 111, 142, ${opacity})`,
                                        strokeWidth: 3,
                                    },
                                ],
                            }}
                            width={screenWidth - 32}
                            height={280}
                            yAxisLabel="$"
                            yAxisInterval={1}
                            chartConfig={{
                                backgroundColor: "#f8f9fa",
                                backgroundGradientFrom: "#f8f9fa",
                                backgroundGradientTo: "#f8f9fa",
                                decimalPlaces: 0,
                                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(156, 163, 175, ${opacity})`,
                                style: { borderRadius: 0 },
                                propsForDots: {
                                    r: "5",
                                    strokeWidth: "3",
                                    stroke: "#ffffff",
                                    fill: "#466f8e",
                                },
                                propsForBackgroundLines: {
                                    strokeDasharray: "4, 4",
                                    stroke: "#d1d5db",
                                    strokeWidth: 1,
                                },
                                propsForLabels: {
                                    fontSize: 12,
                                },
                            }}
                            bezier
                            style={{ marginVertical: 0, paddingRight: 0 }}
                            withVerticalLines
                            withHorizontalLines
                            withInnerLines
                            withOuterLines={false}
                            withVerticalLabels
                            withHorizontalLabels
                            fromZero
                            segments={4}
                            onDataPointClick={handleDataPointClick}
                        />

                        {/* Tooltip */}
                        {selectedPoint && (
                            <View
                                className="absolute bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-200"
                                style={{
                                    top: selectedPoint.y - 50,
                                    left: selectedPoint.x - 60,
                                }}
                            >
                                <Text className="text-xs font-semibold text-gray-900">
                                    {safeData[selectedPoint.index].date}
                                </Text>

                                <Text className="text-xs text-red-500 font-semibold">
                                    Under your target budget
                                </Text>

                                <Text className="text-xs text-gray-600">
                                    Actual: ${safeData[selectedPoint.index].actual}
                                </Text>
                            </View>
                        )}
                    </View>
                ) : (
                    <Text className="text-center text-gray-500">No chart data</Text>
                )}

                {/* Legend */}
                <View className="flex flex-col gap-3">
                    <View className="flex flex-row items-start  gap-1">
                        <Text className="w-2 h-2 bg-[#5c997c] rounded-full top-[5px]">
                        </Text>
                        <View>
                            <Text className="text-[12px] font-semibold">Target Daily Budget</Text>
                            <Text className="text-[12px]">Shows your baseline daily budget</Text>
                        </View>
                    </View>
                    <View className="flex flex-row items-start  gap-1">
                        <Text className="w-2 h-2 bg-[#3c6e98] rounded-full top-[5px]">
                        </Text>
                        <View>
                            <Text className="text-[12px] font-semibold">Target Daily Budget</Text>
                            <Text className="text-[12px]">Shows your baseline daily budget</Text>
                        </View>
                    </View>
                    <View className="flex flex-row items-start  gap-1">
                        <Text className="w-2 h-2 bg-[#e43916] rounded-full top-[5px]">
                        </Text>
                        <View>
                            <Text className="text-[12px] font-semibold">Target Daily Budget</Text>
                            <Text className="text-[12px]">Shows your baseline daily budget</Text>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

export default BudgetTrendChart;


