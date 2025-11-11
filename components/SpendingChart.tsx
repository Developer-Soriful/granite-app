import { Images } from "@/assets";
import React, { useState } from "react";
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { G, Rect, Text as SvgText } from "react-native-svg";
import { BarChart, Grid, PieChart, YAxis } from "react-native-svg-charts";

const { width } = Dimensions.get("window");
const CHART_SIZE = width * 0.7;
const CHART_HEIGHT = CHART_SIZE - 20;
const Y_MAX_VALUE = 400;
const CUSTOM_Y_TICKS = [0, 100, 200, 250, 400]; // Ticks matching the desired labels
const Y_AXIS_WIDTH = 40; // Dedicated space for the Y-Axis labels

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
    '#E34141',
    '#FFB703',
    '#9B59B6',
    '#F28C3D',
    '#6AA84F',
    '#3399CC',
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
    const [chartData] = useState<CategoryData[]>(DEFAULT_DATA);
    const [totalSpending] = useState(
        DEFAULT_DATA.reduce((sum, item) => sum + item.amount, 0)
    );
    const [activeChart, setActiveChart] = useState<'pie' | 'bar'>('pie');
    const [tooltipData, setTooltipData] = useState<{ x: number, y: number, item: CategoryData } | null>(null);

    // ... (CenterLabels, getIconBgClass, getImageStyle are unchanged) ...
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

    const getIconBgClass = (viewType: 'pie' | 'bar') => {
        return activeChart === viewType
            ? 'bg-[#e7f4ee]'
            : 'bg-white';
    };

    const getImageStyle = (viewType: 'pie' | 'bar') => {
        return { opacity: activeChart === viewType ? 1 : 0.4 };
    };

    // --- BAR CHART CUSTOM FUNCTIONS ---
    const BarChartDecorator = ({ x, y, data }: any) => {
        if (!data || data.length === 0) return null;

        return data.map((item: any, index: number) => {
            return (
                <G key={index}>
                    {/* Invisible Rect for the touch target */}
                    <Rect
                        x={x(index)}
                        y={0}
                        width={x.bandwidth}
                        height={CHART_HEIGHT}
                        fill="transparent"
                        onPress={() => {
                            setTooltipData({
                                x: x(index) + x.bandwidth / 2, // Center of the bar
                                y: y(item.amount) - 10,       // Just above the bar top
                                item: item.item,
                            });
                            setTimeout(() => setTooltipData(null), 3000);
                        }}
                    />
                </G>
            );
        });
    };

    // Custom Y-Axis Label Renderer (for the YAxis component)
    const YAxisLabelRenderer = ({ y, ticks }: any) => {
        return ticks.map((tick: number, index: number) => (
            <SvgText
                key={index}
                x={Y_AXIS_WIDTH - 5} // Position near the edge of the YAxis area
                y={y(tick)}
                fontSize={14}
                fill={'#9CA3AF'}
                textAnchor="end"
                alignmentBaseline="middle"
            >
                {/* Use the specific tick values to render labels */}
                {tick === 0 && '$0'}
                {tick === 100 && '$100'}
                {tick === 200 && '$200'}
                {tick === 250 && '$250'}
                {tick === 400 && '$400'}
            </SvgText>
        ));
    };

    // --- Component Render ---
    return (
        <View className="bg-white rounded-[16px] p-4 w-full items-center">
            {/* Header */}
            <View className="flex-row justify-between items-center w-full mb-5">
                <Text className="text-xl font-semibold">
                    Spending by Category
                </Text>

                <View className="flex-row border border-[#dfe4e3] rounded-[12px] p-1">
                    <TouchableOpacity onPress={() => setActiveChart('pie')}>
                        <View className={`py-1 px-2 rounded-[8px] ${getIconBgClass('pie')}`}>
                            <Image source={Images.piechart} style={getImageStyle('pie')} />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setActiveChart('bar')}>
                        <View className={`py-1 px-2 rounded-[8px] ${getIconBgClass('bar')}`}>
                            <Image source={Images.barchart} style={getImageStyle('bar')} />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            {/* --- Chart Area (Bar Chart Implementation) --- */}
            <View className="mb-8" style={{ height: CHART_SIZE, width: CHART_SIZE }}>
                {activeChart === 'pie' ? (
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
                ) : (
                    // 💥 Bar Chart and Y-Axis Wrapper 💥
                    <View style={{ flexDirection: 'row', height: CHART_SIZE }}>
                        {/* 1. Y-Axis Labels */}
                        <YAxis
                            data={CUSTOM_Y_TICKS}
                            contentInset={{ top: 20, bottom: 0 }}
                            svg={{ fontSize: 14, fill: '#9CA3AF' }}
                            numberOfTicks={CUSTOM_Y_TICKS.length - 1}
                            yMax={Y_MAX_VALUE}
                            formatLabel={(value: any) => ''}
                        >
                            {YAxisLabelRenderer}
                        </YAxis>

                        {/* 2. Bar Chart */}
                        <View style={{ flex: 1, marginLeft: 5 }}>
                            <BarChart
                                style={{ flex: 1 }}
                                data={chartData}
                                svg={({ item }: any) => ({ fill: item.svg.fill, rx: 4 })}
                                yAccessor={({ item }: any) => item.amount}
                                xAccessor={({ index }: any) => index}
                                contentInset={{ top: 20, bottom: 0, left: 0, right: 10 }} // No left inset needed now
                                spacingInner={0.5}
                                spacingOuter={0.1}
                                yMax={Y_MAX_VALUE}
                            >
                                <Grid
                                    direction={Grid.Direction.HORIZONTAL}
                                    svg={{ stroke: '#E5E7EB', strokeWidth: 1, strokeDasharray: '4 4' }}
                                />
                                {BarChartDecorator}
                            </BarChart>
                        </View>

                        {/* 3. Tooltip Display (Overlay) */}
                        {tooltipData && (
                            <View
                                style={[
                                    styles.tooltipContainer,
                                    {
                                        // 🚨 Adjusting X to account for the YAxis width
                                        left: tooltipData.x + Y_AXIS_WIDTH,
                                        top: tooltipData.y,
                                        transform: [{ translateX: -70 }],
                                    }
                                ]}
                                className="p-2 bg-white rounded-lg shadow-lg border border-gray-300"
                            >
                                <Text className="text-xs font-semibold">{tooltipData.item.category}</Text>
                                <Text className="text-sm font-bold mt-0.5">{`$${tooltipData.item.amount.toFixed(2)} spent`}</Text>

                                <View style={styles.tooltipPointer} />
                            </View>
                        )}
                    </View>
                )}
            </View>

            {/* Legend/Categories (Unchanged) */}
            <View className="w-full mt-2">
                <Text className="text-[16px] font-semibold">
                    Categories
                </Text>
                {chartData.map((item) => (
                    <View key={item.key} className="flex-row items-center justify-between py-2">
                        <View className="flex-row items-center flex-1">
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

const styles = StyleSheet.create({
    tooltipContainer: {
        position: 'absolute',
        zIndex: 10,
    },
    tooltipPointer: {
        position: 'absolute',
        bottom: -5,
        left: '50%',
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 5,
        borderRightWidth: 5,
        borderTopWidth: 5,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: 'white',
        transform: [{ translateX: -5 }],
    }
});

export default SpendingChart;