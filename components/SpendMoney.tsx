import { Images } from '@/assets'
import React, { useState } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'

const SpendMoney = () => {
    // Sample spending data
    const spendingData = [
        { id: 1, amount: 20, date: new Date("2025-11-09") },
        { id: 2, amount: 50, date: new Date("2025-11-08") },
        { id: 3, amount: 15, date: new Date("2025-11-03") },
        { id: 4, amount: 30, date: new Date("2025-10-30") },
        { id: 5, amount: 60, date: new Date("2025-10-01") },
    ]

    // State to track selected filter
    const [selectedFilter, setSelectedFilter] = useState<'today' | 'week' | 'month'>('today')

    // Filter logic
    const getFilteredSpending = () => {
        const now = new Date()

        if (selectedFilter === 'today') {
            return spendingData.filter(
                (item) =>
                    item.date.getFullYear() === now.getFullYear() &&
                    item.date.getMonth() === now.getMonth() &&
                    item.date.getDate() === now.getDate()
            )
        } else if (selectedFilter === 'week') {
            const startOfWeek = new Date(now)
            startOfWeek.setDate(now.getDate() - now.getDay()) // Sunday as start of week
            return spendingData.filter((item) => item.date >= startOfWeek)
        } else if (selectedFilter === 'month') {
            return spendingData.filter(
                (item) =>
                    item.date.getFullYear() === now.getFullYear() &&
                    item.date.getMonth() === now.getMonth()
            )
        }

        return []
    }

    const totalSpending = getFilteredSpending().reduce((acc, item) => acc + item.amount, 0)

    return (
        <View style={styles.container}>
            <Text style={styles.title}>How Much Can I Spend?</Text>

            <View style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
                <View style={styles.dayWeekMonthContainer}>
                    {['today', 'week', 'month'].map((filter) => {
                        const label =
                            filter === 'today' ? 'Today' : filter === 'week' ? 'This Week' : 'This Month'
                        const isActive = selectedFilter === filter
                        return (
                            <Text
                                key={filter}
                                className={`px-4 py-2 font-semibold ${isActive ? 'rounded-[8px] bg-[#e7f4ee] text-[#4c8167]' : 'text-[#68716c]'}`}
                                onPress={() => setSelectedFilter(filter as any)}
                            >
                                {label}
                            </Text>
                        )
                    })}
                </View>

                {/* Money Container */}
                <View style={styles.moneyContainer}>
                    <View>
                        <Text style={styles.moneyText}>${totalSpending.toFixed(2)}</Text>
                        <Text style={{ fontSize: 14, color: '#000' }}>Available Spending</Text>
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
        </View >
    )
}

export default SpendMoney

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
})
