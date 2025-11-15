import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";

interface ChartDataPoint {
    date: string;
    target: number;
    actual: number;
}

const BudgetTrendChart = () => {
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

    // 🛠️ MODIFIED: This function now also needs to handle deselecting the point
    const handleDataPointClick = (data: any) => {
        const { x, y, index, datasetIndex } = data;

        // The library sometimes returns the same point if touched twice, 
        // and doesn't tell us which dataset, so we just check the index.
        const newPoint = { x, y, index };

        // Check if the same point was clicked again (to close the tooltip)
        if (selectedPoint && selectedPoint.index === index) {
            setSelectedPoint(null);
        } else {
            setSelectedPoint(newPoint);
        }
    };

    // 💡 NEW FUNCTION: Handles touches outside the chart/tooltip area
    const handleGlobalTouch = () => {
        // Only dismiss the tooltip if one is currently visible
        if (selectedPoint) {
            setSelectedPoint(null);
            return true; // Claim responder to stop propagation if a point was selected
        }
        return false; // Don't claim responder if no tooltip is open
    };

    const [isReady, setIsReady] = useState(false);

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
        // 🛠️ MODIFIED: Added onStartShouldSetResponder and onResponderRelease to the container
        <View
            style={styles.container}
            onStartShouldSetResponder={handleGlobalTouch}
            onResponderRelease={handleGlobalTouch}
        >
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>
                    Budget Trend: Target vs. Actual
                </Text>
                <Text style={styles.subtitle}>
                    The goal is to keep your Actual at or above your Target.
                </Text>
            </View>

            {/* Chart Container with Horizontal Scroll */}
            {safeData.length > 0 ? (
                <View style={styles.chartWrapper}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={true}
                        contentContainerStyle={styles.scrollContent}
                    >
                        <LineChart
                            data={{
                                labels,
                                datasets: [
                                    {
                                        data: targetData,
                                        color: (opacity = 1) => `rgba(92, 153, 124, ${opacity})`,
                                        strokeWidth: 2,
                                        strokeDashArray: [8, 4],
                                        withDots: false,
                                    },
                                    {
                                        data: actualData,
                                        color: (opacity = 1) => `rgba(60, 110, 152, ${opacity})`,
                                        strokeWidth: 3,
                                    },
                                ],
                            }}
                            width={Math.max(400, labels.length * 60)} // Dynamic width based on data points
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
                                style: {
                                    borderRadius: 8,
                                },
                                propsForDots: {
                                    r: "5",
                                    strokeWidth: "3",
                                    stroke: "#ffffff",
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
                            bezier
                            // 💡 IMPORTANT: Ensure the chart doesn't claim the responder system 
                            // to allow the parent View to handle touches for dismissing the tooltip.
                            onDataPointClick={handleDataPointClick}
                            style={styles.chart}
                        />
                    </ScrollView>

                    {/* Tooltip */}
                    {selectedPoint && (
                        <View
                            // 💡 NEW: Added stopPropagation so clicking the tooltip doesn't close it immediately
                            onStartShouldSetResponder={() => true}
                            style={[
                                styles.tooltip,
                                {
                                    // Tooltip position must be relative to the scroll container's content, 
                                    // but fixed relative to the screen. 
                                    // Adjusting top/left slightly for better positioning over the chart point
                                    top: selectedPoint.y - 120,
                                    left: selectedPoint.x - 120,
                                }
                            ]}
                        >
                            <Text style={styles.tooltipDate}>
                                {safeData[selectedPoint.index].date}
                            </Text>
                            <Text
                                style={[
                                    styles.tooltipStatus,
                                    {
                                        color: safeData[selectedPoint.index].actual >= safeData[selectedPoint.index].target
                                            ? '#5c997c' // Green for Good/Within Target
                                            : '#e43916' // Red for Overspending/Under Target
                                    }
                                ]}
                            >
                                {safeData[selectedPoint.index].actual >= safeData[selectedPoint.index].target
                                    ? "Within Target"
                                    : "Overspent/Under Target"}
                            </Text>
                            <Text style={styles.tooltipValue}>
                                Actual: **${safeData[selectedPoint.index].actual}**
                            </Text>
                            <Text style={styles.tooltipValue}>
                                Target: **${safeData[selectedPoint.index].target}**
                            </Text>
                        </View>
                    )}
                </View>
            ) : (
                <Text style={styles.noDataText}>No chart data</Text>
            )}

            {/* Legend */}
            <View style={styles.legend}>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#5c997c' }]} />
                    <View style={styles.legendTextContainer}>
                        <Text style={styles.legendTitle}>Target Daily Budget</Text>
                        <Text style={styles.legendDescription}>Shows your baseline daily budget</Text>
                    </View>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#3c6e98' }]} />
                    <View style={styles.legendTextContainer}>
                        <Text style={styles.legendTitle}>Actual Daily Budget</Text>
                        <Text style={styles.legendDescription}>Updates based on your spending</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 12,
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
    chartWrapper: {
        position: 'relative',
        borderRadius: 8,
        marginBottom: 16,
    },
    scrollContent: {
        paddingRight: 16,
    },
    chart: {
        borderRadius: 8,
        marginVertical: 8,
    },
    tooltip: {
        position: 'absolute',
        backgroundColor: 'white',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderColor: '#ddd',
        borderWidth: 1,
        minWidth: 120,
    },
    tooltipDate: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    tooltipStatus: {
        fontSize: 11,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    tooltipValue: {
        fontSize: 11,
        color: '#6b7280',
    },
    noDataText: {
        textAlign: 'center',
        color: '#6b7280',
        marginVertical: 20,
    },
    legend: {
        gap: 12,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
    },
    legendDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginTop: 6,
    },
    legendTextContainer: {
        flex: 1,
    },
    legendTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 2,
    },
    legendDescription: {
        fontSize: 12,
        color: '#6b7280',
        lineHeight: 16,
    },
});

export default BudgetTrendChart;