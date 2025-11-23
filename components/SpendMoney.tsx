import { Images } from '@/assets';
import React, { useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';

interface SpendMoneyProps {
    availableSpending: number;
    totalExpensesThisMonth: number;
    monthlyBudget: number;
    isLoading?: boolean;
}

const SpendMoney: React.FC<SpendMoneyProps> = ({
    availableSpending = 0,
    totalExpensesThisMonth = 0,
    monthlyBudget = 3000,
    isLoading = false,
}) => {
    const [selectedFilter, setSelectedFilter] = useState<'today' | 'week' | 'month'>('month');

    const getDisplayAmount = () => {
        if (selectedFilter === 'today') return availableSpending / 30;
        if (selectedFilter === 'week') return (availableSpending / 30) * 7;
        return availableSpending;
    };

    if (isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="small" color="#338059" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>How Much Can I Spend?</Text>

            <View style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
                <View style={styles.dayWeekMonthContainer}>
                    {['today', 'week', 'month'].map((filter) => {
                        const label = filter === 'today' ? 'Today' : filter === 'week' ? 'This Week' : 'This Month';
                        const isActive = selectedFilter === filter;
                        return (
                            <Text
                                key={filter}
                                onPress={() => setSelectedFilter(filter as any)}
                                className={`font-sans-condensed font-semibold px-4 py-2 ${isActive ? 'rounded-[8px] bg-[#e7f4ee] text-[#4c8167]' : 'text-[#68716c]'}`}
                            >
                                {label}
                            </Text>
                        );
                    })}
                </View>

                <View style={styles.moneyContainer}>
                    <View>
                        <Text style={styles.moneyText}>
                            ${getDisplayAmount().toFixed(2)}
                        </Text>
                        <Text style={{ fontSize: 14, color: '#000' }}>
                            Available Spending
                        </Text>
                    </View>
                    <View
                        style={{
                            width: 60,
                            height: 60,
                            borderRadius: 12,
                            backgroundColor: 'rgba(143, 192, 169, 0.2)',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Image source={Images.wallet} />
                    </View>
                </View>
            </View>
        </View>
    );
};

export default SpendMoney;

// Tor original style — kono line o change kori nai
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
        fontSize: 24,
        fontWeight: '600',
        color: '#000',
    },
    dayWeekMonthContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 4,
        backgroundColor: '#fefffe',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#dfe4e3',
        width: '100%',
        gap: 4,
    },
    moneyContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 18,
        paddingRight: 18,
        paddingTop: 12,
        paddingBottom: 12,
        backgroundColor: '#fefffe',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(143, 192, 169, 1)',
        width: '100%',
    },
    moneyText: {
        fontSize: 32,
        fontWeight: '600',
        color: 'rgba(77, 128, 102, 1)',
    },
});