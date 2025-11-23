import { Images } from "@/assets";
import React, { useMemo, useState } from "react";
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { G, Rect, Text as SvgText } from "react-native-svg";
import { BarChart, Grid, PieChart, YAxis } from "react-native-svg-charts";

const { width } = Dimensions.get("window");
const CHART_SIZE = width * 0.7;
const CHART_HEIGHT = CHART_SIZE - 20;
const Y_MAX_VALUE = 400;
const CUSTOM_Y_TICKS = [0, 100, 200, 250, 400];
const Y_AXIS_WIDTH = 40;

interface CategoryItem {
    category: string;
    amount: number;
}

interface SpendingChartProps {
    data?: CategoryItem[] | null;
}

const CHART_COLORS = ['#E34141', '#FFB703', '#9B59B6', '#F28C3D', '#6AA84F', '#3399CC'];

const SpendingChart: React.FC<SpendingChartProps> = ({ data }) => {
    const [activeChart, setActiveChart] = useState<'pie' | 'bar'>('pie'); // ← EKHON STATE CHANGE HOY!
    const [tooltipData, setTooltipData] = useState<{ x: number; y: number; item: any } | null>(null);

    const categories = Array.isArray(data) ? data : [];
    const hasData = categories.length > 0;

    const chartData = useMemo(() => {
        return categories.map((item, i) => ({
            key: item.category.toLowerCase().replace(/\s+/g, '_'),
            amount: item.amount,
            category: item.category,
            svg: { fill: CHART_COLORS[i % CHART_COLORS.length] },
        }));
    }, [categories]);

    const totalSpending = categories.reduce((sum, item) => sum + item.amount, 0);

    // EMPTY STATE (Same design)
    if (!hasData) {
        return (
            <View className="bg-white rounded-[16px] p-4 w-full items-center">
                <View className="flex-row justify-between items-center w-full mb-5">
                    <Text className="text-xl font-semibold">Spending by Category</Text>
                    <View className="flex-row border border-[#dfe4e3] rounded-[12px] p-1 opacity-50">
                        <View className="py-1 px-2 rounded-[8px] bg-white">
                            <Image source={Images.piechart} style={{ opacity: 0.4 }} />
                        </View>
                        <View className="py-1 px-2 rounded-[8px] bg-white">
                            <Image source={Images.barchart} style={{ opacity: 0.4 }} />
                        </View>
                    </View>
                </View>

                <View style={{ height: CHART_SIZE, justifyContent: 'center', alignItems: 'center' }}>
                    <Text className="text-5xl font-bold text-gray-300">$0</Text>
                    <Text className="text-gray-500 mt-2">No spending data</Text>
                </View>
            </View>
        );
    }

    const CenterLabels = () => (
        <G>
            <SvgText x={0} y={-10} fontSize={28} fontWeight="600" fill="#1F2937" textAnchor="middle">
                ${totalSpending.toFixed(0)}
            </SvgText>
            <SvgText x={0} y={15} fontSize={14} fill="#6B7280" textAnchor="middle">
                Total spending
            </SvgText>
        </G>
    );

    // ACTIVE STATE STYLE — EXACTLY TOR DESIGN
    const getIconBgClass = (type: 'pie' | 'bar') =>
        activeChart === type ? 'bg-[#e7f4ee]' : 'bg-white';

    const getImageStyle = (type: 'pie' | 'bar') => ({
        opacity: activeChart === type ? 1 : 0.4,
        width: 24,
        height: 24,
    });

    const BarChartDecorator = ({ x, y }: any) => {
        return chartData.map((item, index) => (
            <Rect
                key={index}
                x={x(index)}
                y={0}
                width={x.bandwidth()}
                height={CHART_HEIGHT}
                fill="transparent"
                onPress={() => {
                    setTooltipData({
                        x: x(index) + x.bandwidth() / 2,
                        y: y(item.amount) - 10,
                        item,
                    });
                    setTimeout(() => setTooltipData(null), 3000);
                }}
            />
        ));
    };

    const YAxisLabelRenderer = ({ y, ticks }: any) => {
        return ticks.map((tick: number, index: number) => (
            <SvgText
                key={index}
                x={Y_AXIS_WIDTH - 5}
                y={y(tick)}
                fontSize={14}
                fill="#9CA3AF"
                textAnchor="end"
                alignmentBaseline="middle"
            >
                {tick === 0 && '$0'}
                {tick === 100 && '$100'}
                {tick === 200 && '$200'}
                {tick === 250 && '$250'}
                {tick === 400 && '$400'}
            </SvgText>
        ));
    };

    return (
        <View className="bg-white rounded-[16px] p-4 w-full items-center">
            {/* Header + Toggle Buttons */}
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

            <Text className="text-xl font-semibold">Spending by Category</Text>


            {/* Chart Area */}
            <View className="mb-8" style={{ height: CHART_SIZE, width: CHART_SIZE }}>
                {activeChart === 'pie' ? (
                    <PieChart
                        style={{ height: CHART_SIZE, width: CHART_SIZE }}
                        data={chartData}
                        valueAccessor={({ item }: any) => item.amount}
                        innerRadius="70%"
                        outerRadius="95%"
                        padAngle={0.02}
                        sort={(a: any, b: any) => b.amount - a.amount}
                    >
                        <CenterLabels />
                    </PieChart>
                ) : (
                    <View style={{ flexDirection: 'row', height: CHART_SIZE }}>
                        <YAxis
                            data={CUSTOM_Y_TICKS}
                            contentInset={{ top: 20, bottom: 0 }}
                            svg={{ fontSize: 14, fill: '#9CA3AF' }}
                            numberOfTicks={CUSTOM_Y_TICKS.length - 1}
                            yMax={Y_MAX_VALUE}
                            formatLabel={() => ''}
                        >
                            {YAxisLabelRenderer}
                        </YAxis>

                        <View style={{ flex: 1, marginLeft: 5 }}>
                            <BarChart
                                style={{ flex: 1 }}
                                data={chartData}
                                svg={({ item }: any) => ({ fill: item.svg.fill, rx: 4 })}
                                yAccessor={({ item }: any) => item.amount}
                                contentInset={{ top: 20, bottom: 0 }}
                                spacingInner={0.5}
                                spacingOuter={0.1}
                                yMax={Y_MAX_VALUE}
                            >
                                <Grid direction={Grid.Direction.HORIZONTAL} svg={{ stroke: '#E5E7EB', strokeWidth: 1, strokeDasharray: '4 4' }} />
                                <BarChartDecorator />
                            </BarChart>
                        </View>

                        {/* Tooltip */}
                        {tooltipData && (
                            <View
                                style={[
                                    styles.tooltipContainer,
                                    {
                                        left: tooltipData.x + Y_AXIS_WIDTH,
                                        top: tooltipData.y,
                                        transform: [{ translateX: -70 }],
                                    },
                                ]}
                                className="p-2 bg-white rounded-lg shadow-lg border border-gray-300"
                            >
                                <Text className="text-xs font-semibold">{tooltipData.item.category}</Text>
                                <Text className="text-sm font-bold mt-0.5">
                                    ${tooltipData.item.amount.toFixed(2)} spent
                                </Text>
                                <View style={styles.tooltipPointer} />
                            </View>
                        )}
                    </View>
                )}
            </View>

            {/* Legend */}
            <View className="w-full mt-2">
                <Text className="text-[16px] font-semibold">Categories</Text>
                {chartData.map((item) => (
                    <View key={item.key} className="flex-row items-center justify-between py-2">
                        <View className="flex-row items-center flex-1">
                            <View style={{ backgroundColor: item.svg.fill }} className="w-2.5 h-2.5 rounded-full mr-2.5" />
                            <Text className="text-sm text-gray-700">{item.category}</Text>
                        </View>
                        <Text className="text-sm font-semibold text-gray-800">
                            ${item.amount.toFixed(2)}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    tooltipContainer: { position: 'absolute', zIndex: 10 },
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
    },
});

export default SpendingChart;