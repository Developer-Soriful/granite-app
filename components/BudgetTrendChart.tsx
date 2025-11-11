import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";

interface ChartDataPoint {
    date: string;
    target: number;
    actual: number;
}

const BudgetTrendChart = () => {
    // Calculate width based on the screen width minus the fixed padding applied in the parent (16px left + 16px right = 32px)
    const screenWidth = Dimensions.get("window").width;
    const chartWidth = screenWidth - 32;

    const [selectedPoint, setSelectedPoint] = useState<{
        x: number;
        y: number;
        index: number;
    } | null>(null);

    const [chartData] = useState<ChartDataPoint[]>([
        { date: "1-7", target: 100, actual: 100 },
        { date: "8-14", target: 100, actual: 110 },
        { date: "15-21", target: 100, actual: 165 },
        { date: "22-27", target: 100, actual: 105 },
        { date: "27-30", target: 100, actual: 145 },
        { date: "30-36", target: 100, actual: 155 },
    ]);

    const safeData = Array.isArray(chartData) ? chartData : [];

    const labels = safeData.map((item) => item.date);
    const targetData = safeData.map((item) => item.target);
    const actualData = safeData.map((item) => item.actual);

    const handleDataPointClick = (data: any) => {
        const { x, y, index } = data;
        setSelectedPoint({ x, y, index });
    };

    // Add a state to track if the chart is ready
    const [isReady, setIsReady] = useState(false);

    // Wait for the component to mount before rendering the chart
    useEffect(() => {
        setIsReady(true);
    }, []);

    if (!isReady) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading chart...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>
                    Budget Trend: Target vs. Actual
                </Text>
                <Text style={styles.subtitle}>
                    The goal is to keep your Actual at or above your Target.
                </Text>
            </View>

            {/* Chart */}
            {safeData.length > 0 ? (
                <View style={styles.chartContainer}>
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
                        width={chartWidth}
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
                            style: {},
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
                                fontSize: 10,
                            },
                        }}
                        onDataPointClick={handleDataPointClick}
                    />

                    {/* Tooltip */}
                    {selectedPoint && (
                        <View
                            style={{
                                position: "absolute",
                                top: selectedPoint.y - 50,
                                left: selectedPoint.x - 60,
                                backgroundColor: "white",
                                paddingHorizontal: 3,
                                paddingVertical: 2,
                                borderRadius: 4,
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,
                                elevation: 5,
                                borderColor: "#ddd",
                                borderWidth: 1,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 12,
                                    fontWeight: "bold",
                                    color: "#333",
                                }}
                            >
                                {safeData[selectedPoint.index].date}
                            </Text>

                            <Text
                                style={{
                                    fontSize: 12,
                                    color: "#f44336",
                                    fontWeight: "bold",
                                }}
                            >
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
            {/* ... (Your existing legend code is fine) ... */}
            <View className="flex flex-col gap-3">
                <View className="flex flex-row items-start  gap-1">
                    <Text className="w-2 h-2 bg-[#5c997c] rounded-full top-[5px]"></Text>
                    <View>
                        <Text className="text-[12px] font-semibold">Target Daily Budget</Text>
                        <Text className="text-[12px]">Shows your baseline daily budget</Text>
                    </View>
                </View>
                <View className="flex flex-row items-start  gap-1">
                    <Text className="w-2 h-2 bg-[#3c6e98] rounded-full top-[5px]"></Text>
                    <View>
                        <Text className="text-[12px] font-semibold">Target Daily Budget</Text>
                        <Text className="text-[12px]">Shows your baseline daily budget</Text>
                    </View>
                </View>
                <View className="flex flex-row items-start  gap-1">
                    <Text className="w-2 h-2 bg-[#e43916] rounded-full top-[5px]"></Text>
                    <View>
                        <Text className="text-[12px] font-semibold">Target Daily Budget</Text>
                        <Text className="text-[12px]">Shows your baseline daily budget</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        gap: 16,
        padding: 16,
        backgroundColor: 'white',
        borderRadius: 12,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    header: {
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#6b7280',
        lineHeight: 20,
    },
    chartContainer: {
        position: 'relative',
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
    },
});

export default BudgetTrendChart;