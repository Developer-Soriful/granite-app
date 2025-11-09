import { AntDesign } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type BudgetComparisonProps = {
    currentAvg: number; // current average daily budget
    numberOfDays: number; // number of days used to calculate current average
    maxValue?: number; // optional max scale
};

const ForecastFuture = ({ currentAvg, numberOfDays, maxValue }: BudgetComparisonProps) => {
    const [inputValue, setInputValue] = useState('');
    const [calculatedAvg, setCalculatedAvg] = useState<number | null>(null);
    const [showTooltip, setShowTooltip] = useState(false);

    const toggleTooltip = () => setShowTooltip(prev => !prev);

    const handleCalculate = () => {
        console.log('=== DEBUG START ===');
        console.log('Input value:', inputValue);
        console.log('Input trimmed:', inputValue.trim());

        const val = parseFloat(inputValue.trim());
        console.log('Parsed value:', val);
        console.log('Is NaN?:', isNaN(val));
        console.log('currentAvg:', currentAvg);
        console.log('numberOfDays:', numberOfDays);

        if (isNaN(val) || val < 0) {
            alert('Please enter a valid positive number');
            return;
        }

        // Calculate new average:
        // (current average × number of days + today's spending) / (number of days + 1)
        const totalSpent = currentAvg * numberOfDays;
        console.log('Total spent:', totalSpent);

        const newTotal = totalSpent + val;
        console.log('New total:', newTotal);

        const newAverage = newTotal / (numberOfDays + 1);
        console.log('New average:', newAverage);
        console.log('=== DEBUG END ===');

        setCalculatedAvg(newAverage);
    };

    // Ensure scale is always valid
    const allValues = [currentAvg];
    if (calculatedAvg !== null) allValues.push(calculatedAvg);
    const scale = maxValue && !isNaN(maxValue) ? maxValue : Math.max(...allValues, 200);

    const screenWidth = Dimensions.get('window').width;
    const barMaxWidth = screenWidth - 64; // adjust for padding/margin

    const currentWidth = (currentAvg / scale) * barMaxWidth;
    const newWidth = calculatedAvg !== null ? (calculatedAvg / scale) * barMaxWidth : 0;

    // Dynamic X-axis labels
    const xAxisSteps = 5;
    const step = Math.max(1, Math.ceil(scale / xAxisSteps));
    const xAxisLabels = Array.from({ length: xAxisSteps + 1 }, (_, i) => i * step);

    const difference = calculatedAvg !== null ? calculatedAvg - currentAvg : 0;
    const isHigher = difference > 0;

    return (
        <View style={styles.container}>
            {/* Title & description */}
            <View style={{ gap: 8 }}>
                <Text style={styles.title}>Forecast Future Daily Budget</Text>
                <Text style={{ fontSize: 14, color: 'rgba(67,77,72,1)' }}>
                    Planning to spend more (or less) than usual today? Enter the amount to see how it will change your daily budget.
                </Text>
            </View>

            {/* Input & Calculate button */}
            <View style={{ gap: 6, width: '100%' }}>
                <TextInput
                    placeholder="$ Enter amount spent today"
                    placeholderTextColor="rgba(145, 154, 149, 1)"
                    style={styles.input}
                    value={inputValue}
                    onChangeText={setInputValue}
                    keyboardType="numeric"
                />

                <TouchableOpacity style={styles.calculateBtn} onPress={handleCalculate}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#fff' }}>Calculate</Text>
                </TouchableOpacity>
            </View>

            {/* New Average & Comparison */}
            {calculatedAvg !== null && (
                <View style={{ gap: 8, width: '100%' }}>
                    {/* New Average Card */}
                    <View style={styles.dailyBudgetContainer}>
                        <View>
                            <Text style={{ fontSize: 16, fontWeight: '600' }}>New Average Daily Budget</Text>
                            <Text style={{ fontSize: 24, fontWeight: '600' }}>${calculatedAvg.toFixed(2)}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 4 }}>
                            <AntDesign
                                name={isHigher ? "arrow-up" : "arrow-down"}
                                size={24}
                                color={isHigher ? "rgba(92,153,124,1)" : "rgba(220,100,100,1)"}
                            />
                            <Text style={{ fontSize: 14, color: isHigher ? 'rgba(92,153,124,1)' : 'rgba(220,100,100,1)' }}>
                                ${Math.abs(difference).toFixed(2)} {isHigher ? 'higher' : 'lower'} than your current average daily budget
                            </Text>
                        </View>
                    </View>

                    {/* Daily Budget Comparison Card */}
                    <View style={styles.card}>
                        <Text style={{ fontSize: 16, fontWeight: '600' }}>Daily Budget Comparison</Text>

                        <View style={styles.barsContainer}>
                            <View style={styles.barWrapper}>
                                {/* Current Avg Bar */}
                                <View
                                    style={[
                                        styles.bar,
                                        { width: currentWidth, backgroundColor: 'rgba(54,120,179,1)' },
                                    ]}
                                />

                                {/* New Avg Bar */}
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={toggleTooltip}
                                    style={[
                                        styles.bar,
                                        { width: newWidth, backgroundColor: 'rgba(92,153,124,1)' },
                                    ]}
                                >
                                    {showTooltip && (
                                        <View style={[styles.tooltip, { right: -10 }]}>
                                            <Text style={styles.tooltipText}>New Avg. ${calculatedAvg.toFixed(2)}</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            </View>

                            {/* X-axis */}
                            <View style={styles.xAxis}>
                                {xAxisLabels.map((val, index) => (
                                    <Text key={`xAxis-${index}`} style={styles.xAxisLabel}>${val}</Text>
                                ))}
                            </View>
                        </View>

                        {/* Labels */}
                        <View style={styles.labelsContainer}>
                            <View style={styles.label}>
                                <View style={[styles.dot, { backgroundColor: '#3778b2' }]} />
                                <Text style={{ fontSize: 14, fontWeight: '600' }}>Current Avg.</Text>
                            </View>
                            <View style={styles.label}>
                                <View style={[styles.dot, { backgroundColor: '#5d987c' }]} />
                                <Text style={{ fontSize: 14, fontWeight: '600' }}>New Avg. (Forecast)</Text>
                            </View>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
};

export default ForecastFuture;

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        padding: 16,
        backgroundColor: '#fefffe',
        borderRadius: 16,
        gap: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000',
    },
    input: {
        width: '100%',
        height: 56,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(223,229,226,1)',
        color: '#000',
        padding: 16,
        fontSize: 16,
    },
    calculateBtn: {
        backgroundColor: 'rgba(77,128,102,1)',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    dailyBudgetContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: 12,
        backgroundColor: '#fefffe',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(143,192,169,1)',
        width: '100%',
        gap: 8,
    },
    card: {
        backgroundColor: '#fefffe',
        borderRadius: 16,
        padding: 16,
        borderColor: 'rgba(223,229,226,1)',
        borderWidth: 1,
        width: '100%',
        gap: 16,
    },
    barsContainer: {
        flexDirection: 'column',
        gap: 6,
        position: 'relative',
    },
    barWrapper: {
        flexDirection: 'column',
        borderLeftWidth: 2,
        borderBottomWidth: 2,
        borderColor: '#ccc',
        paddingLeft: 0.5,
        paddingBottom: 2,
        gap: 6,
    },
    bar: {
        height: 24,
        borderEndStartRadius: 8,
        borderEndEndRadius: 8,
        justifyContent: 'center',
    },
    tooltip: {
        position: 'absolute',
        top: -30,
        backgroundColor: '#fff',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    tooltipText: {
        fontSize: 12,
        fontWeight: '600',
    },
    labelsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    label: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    xAxis: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    xAxisLabel: {
        fontSize: 12,
        color: '#666',
    },
});