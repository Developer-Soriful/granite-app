import React, { useState } from "react";
import { Dimensions, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { ChartData } from "react-native-chart-kit/dist/HelperTypes";

interface DailySpendData {
    day: string;
    amount: number;
    date: string;
}

const { width } = Dimensions.get("window");

const MOCK_DATA_POINTS: DailySpendData[] = [
    { day: "1", amount: 65, date: "September 1" },
    { day: "2", amount: 80, date: "September 2" },
    { day: "3", amount: 90, date: "September 3" },
    { day: "4", amount: 98, date: "September 4" },
    { day: "5", amount: 100, date: "September 5" },
    { day: "6", amount: 102, date: "September 6" },
    { day: "7", amount: 105, date: "September 7" },
    { day: "8", amount: 104, date: "September 8" },
    { day: "9", amount: 105, date: "September 9" },
    { day: "10", amount: 100, date: "September 10" },
    { day: "11", amount: 104, date: "September 11" },
];

const DailySpendingChart = () => {
    const [chartData] = useState<DailySpendData[]>(MOCK_DATA_POINTS);

    const labels = chartData.map(item => item.day);
    const amounts = chartData.map(item => item.amount);

    const chartConfig = {
        backgroundColor: "#ffffff",
        backgroundGradientFrom: "#ffffff",
        backgroundGradientTo: "#ffffff",
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(67, 142, 80, ${opacity})`,
        labelColor: () => `rgba(0,0,0,0.6)`,
        propsForDots: {
            r: "4",
            strokeWidth: "0",
        },
    };

    return (
        <View className="bg-white rounded-[16px] p-4 w-full flex flex-col gap-4">
            <Text className="text-xl font-semibold text-gray-900 mb-2">
                Total Amount Spent Per Day
            </Text>

            <LineChart
                data={{
                    labels,
                    datasets: [
                        {
                            data: amounts,
                        },
                    ],
                } as ChartData}
                width={width - 60}
                height={240}
                yAxisLabel="$"
                yAxisInterval={1}
                fromZero
                yLabelsOffset={36}
                chartConfig={chartConfig}
                bezier
                withDots={true}
                withVerticalLabels={true}
                withHorizontalLabels={true}
            />
        </View>
    );
};

export default DailySpendingChart;
