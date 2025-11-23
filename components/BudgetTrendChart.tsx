    import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";

    interface ChartDataPoint {
        date: string;
        target: number;
        actual: number;
    }

    interface BudgetTrendChartProps {
        data?: ChartDataPoint[] | null;
    }

    const BudgetTrendChart: React.FC<BudgetTrendChartProps> = ({ data }) => {
        const [selectedPoint, setSelectedPoint] = useState<any>(null);

        // 100% SAFE DATA
        const hasData = Array.isArray(data) && data.length > 0;
        const chartData = hasData ? data : [];

        // JODI DATA NAI → PREMIUM EMPTY STATE
        if (!hasData) {
            return (
                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Budget Trend: Target vs. Actual</Text>
                        <Text style={styles.subtitle}>
                            Start tracking expenses to see your budget trend!
                        </Text>
                    </View>

                    {/* Beautiful Empty Chart Placeholder */}
                    <View style={styles.emptyChartContainer}>
                        <View style={styles.emptyChartBackground}>
                            {/* Fake Horizontal Grid Lines */}
                            {[0, 1, 2, 3, 4].map((i) => (
                                <View key={i} style={styles.gridLine} />
                            ))}
                            {/* Fake Target Line */}
                            <View style={[styles.fakeLine, styles.fakeTargetLine]} />
                            {/* Fake Actual Line */}
                            <View style={[styles.fakeLine, styles.fakeActualLine]} />
                        </View>

                        {/* Empty State Message */}
                        <View style={styles.emptyOverlay}>
                            <Text style={styles.emptyTitle}>No Data Available Yet</Text>
                            <Text style={styles.emptySubtitle}>
                                Connect your bank or add transactions to see your budget trend
                            </Text>
                        </View>
                    </View>

                    {/* Legend (Grayed Out) */}
                    <View style={styles.legend}>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendDot, { backgroundColor: "#9ca3af" }]} />
                            <View style={styles.legendTextContainer}>
                                <Text style={[styles.legendTitle, { color: "#9ca3af" }]}>
                                    Target Daily Budget
                                </Text>
                                <Text style={[styles.legendDescription, { color: "#9ca3af" }]}>
                                    Waiting for your first transactions...
                                </Text>
                            </View>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendDot, { backgroundColor: "#9ca3af" }]} />
                            <View style={styles.legendTextContainer}>
                                <Text style={[styles.legendTitle, { color: "#9ca3af" }]}>
                                    Actual Daily Budget
                                </Text>
                                <Text style={[styles.legendDescription, { color: "#9ca3af" }]}>
                                    Start spending to see your trend
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            );
        }

        // ====== REAL DATA RENDER (JODI DATA THAKE) ======
        const labels = chartData.map((d) => d.date);
        const targetData = chartData.map((d) => d.target);
        const actualData = chartData.map((d) => d.actual);

        const handleDataPointClick = (point: any) => {
            const { x, y, index } = point;
            if (selectedPoint?.index === index) {
                setSelectedPoint(null);
            } else {
                setSelectedPoint({ x, y, index });
            }
        };

        const handleGlobalTouch = () => {
            if (selectedPoint) {
                setSelectedPoint(null);
                return true;
            }
            return false;
        };

        const [isReady, setIsReady] = useState(false);
        useEffect(() => {
            setIsReady(true);
        }, []);

        if (!isReady) return null;

        return (
            <View
                style={styles.container}
                onStartShouldSetResponder={handleGlobalTouch}
                onResponderRelease={handleGlobalTouch}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Budget Trend: Target vs. Actual</Text>
                    <Text style={styles.subtitle}>
                        The goal is to keep your Actual at or above your Target.
                    </Text>
                </View>

                {/* Real Chart */}
                <View style={styles.chartWrapper}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                    >
                        <LineChart
                            data={{
                                labels,
                                datasets: [
                                    {
                                        data: targetData,
                                        color: () => `rgba(92, 153, 124, 1)`,
                                        strokeWidth: 2,
                                        strokeDashArray: [8, 4],
                                        withDots: false,
                                    },
                                    {
                                        data: actualData,
                                        color: () => `rgba(60, 110, 152, 1)`,
                                        strokeWidth: 3,
                                    },
                                ],
                            }}
                            width={Math.max(420, labels.length * 70)}
                            height={280}
                            yAxisLabel="$"
                            yAxisInterval={1}
                            chartConfig={{
                                backgroundColor: "#f8f9fa",
                                backgroundGradientFrom: "#f8f9fa",
                                backgroundGradientTo: "#f8f9fa",
                                decimalPlaces: 0,
                                color: () => "#374151",
                                labelColor: () => "#6b7280",
                                style: { borderRadius: 8 },
                                propsForBackgroundLines: {
                                    stroke: "#e5e7eb",
                                    strokeWidth: 1,
                                },
                            }}
                            bezier
                            onDataPointClick={handleDataPointClick}
                            style={styles.chart}
                        />

                        {/* Tooltip */}
                        {selectedPoint && chartData[selectedPoint.index] && (
                            <View
                                onStartShouldSetResponder={() => true}
                                style={[
                                    styles.tooltip,
                                    {
                                        top: selectedPoint.y - 130,
                                        left: selectedPoint.x - 110,
                                    },
                                ]}
                            >
                                <Text style={styles.tooltipDate}>
                                    {chartData[selectedPoint.index].date}
                                </Text>
                                <Text
                                    style={[
                                        styles.tooltipStatus,
                                        {
                                            color:
                                                chartData[selectedPoint.index].actual >=
                                                    chartData[selectedPoint.index].target
                                                    ? "#22c55e"
                                                    : "#ef4444",
                                        },
                                    ]}
                                >
                                    {chartData[selectedPoint.index].actual >=
                                        chartData[selectedPoint.index].target
                                        ? "On Track"
                                        : "Over Budget"}
                                </Text>
                                <Text style={styles.tooltipValue}>
                                    Actual: <Text style={{ fontWeight: "bold" }}>${chartData[selectedPoint.index].actual}</Text>
                                </Text>
                                <Text style={styles.tooltipValue}>
                                    Target: <Text style={{ fontWeight: "bold" }}>${chartData[selectedPoint.index].target}</Text>
                                </Text>
                            </View>
                        )}
                    </ScrollView>
                </View>

                {/* Legend */}
                <View style={styles.legend}>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: "#5c997c" }]} />
                        <View style={styles.legendTextContainer}>
                            <Text style={styles.legendTitle}>Target Daily Budget</Text>
                            <Text style={styles.legendDescription}>Shows your baseline daily budget</Text>
                        </View>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: "#3c6e98" }]} />
                        <View style={styles.legendTextContainer}>
                            <Text style={styles.legendTitle}>Actual Daily Budget</Text>
                            <Text style={styles.legendDescription}>Updates based on your spending</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    // FULL STYLES — NO ERROR, NO MISSING BRACE
    const styles = StyleSheet.create({
        container: {
            padding: 12,
            backgroundColor: "white",
            borderRadius: 12,
        },
        header: {
            marginBottom: 16,
        },
        title: {
            fontSize: 20,
            fontWeight: "bold",
            color: "#111827",
            marginBottom: 8,
        },
        subtitle: {
            fontSize: 14,
            color: "#6b7280",
            lineHeight: 20,
        },
        chartWrapper: {
            position: "relative",
            borderRadius: 8,
            marginBottom: 16,
            overflow: "hidden",
        },
        scrollContent: {
            paddingRight: 16,
        },
        chart: {
            borderRadius: 8,
        },

        // EMPTY STATE STYLES
        emptyChartContainer: {
            height: 280,
            borderRadius: 8,
            backgroundColor: "#f8f9fa",
            marginBottom: 16,
            position: "relative",
            overflow: "hidden",
        },
        emptyChartBackground: {
            ...StyleSheet.absoluteFillObject,
            paddingHorizontal: 20,
            paddingTop: 20,
        },
        gridLine: {
            height: 1,
            backgroundColor: "#e5e7eb",
            marginVertical: 48,
        },
        fakeLine: {
            position: "absolute",
            height: 3,
            left: 20,
            right: 20,
            borderRadius: 2,
        },
        fakeTargetLine: {
            backgroundColor: "rgba(92, 153, 124, 0.3)",
            top: "40%",
            transform: [{ rotate: "2deg" }],
        },
        fakeActualLine: {
            backgroundColor: "rgba(60, 110, 152, 0.3)",
            top: "52%",
            transform: [{ rotate: "-1.5deg" }],
        },
        emptyOverlay: {
            ...StyleSheet.absoluteFillObject,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(248, 249, 250, 0.97)",
            padding: 24,
        },
        emptyTitle: {
            fontSize: 20,
            fontWeight: "700",
            color: "#374151",
            marginBottom: 8,
        },
        emptySubtitle: {
            fontSize: 14,
            color: "#6b7280",
            textAlign: "center",
            lineHeight: 20,
        },

        // Tooltip & Legend
        tooltip: {
            position: "absolute",
            backgroundColor: "white",
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderRadius: 8,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 8,
            elevation: 10,
            borderWidth: 1,
            borderColor: "#e5e7eb",
            minWidth: 140,
            zIndex: 100,
        },
        tooltipDate: {
            fontSize: 13,
            fontWeight: "bold",
            color: "#1f2937",
            marginBottom: 4,
        },
        tooltipStatus: {
            fontSize: 12,
            fontWeight: "bold",
            marginBottom: 6,
        },
        tooltipValue: {
            fontSize: 12,
            color: "#4b5563",
        },
        legend: {
            gap: 14,
        },
        legendItem: {
            flexDirection: "row",
            alignItems: "flex-start",
            gap: 10,
        },
        legendDot: {
            width: 10,
            height: 10,
            borderRadius: 5,
            marginTop: 6,
        },
        legendTextContainer: {
            flex: 1,
        },
        legendTitle: {
            fontSize: 13,
            fontWeight: "600",
            color: "#111827",
            marginBottom: 2,
        },
        legendDescription: {
            fontSize: 12,
            color: "#6b7280",
            lineHeight: 16,
        },
    });

    export default BudgetTrendChart;