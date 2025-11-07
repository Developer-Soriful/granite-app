import BudgetTrendChart from '@/components/BudgetTrendChart'
import SpendingChart from '@/components/SpendingChart'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Insights = () => {
    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: "#e6f5ee", paddingTop: 8 }}
        >
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    padding: 16,
                    display: "flex",
                    paddingTop: 70,
                    gap: 16,
                }}
                showsVerticalScrollIndicator={false}
            >
                {/* this is for Insights heading and date part */}
                <View className='flex flex-row justify-between items-center'>
                    <Text className='font-semibold text-2xl'>Insights</Text>
                    <View className='flex flex-row items-center justify-center gap-3 bg-white px-4 py-3 rounded-[12px]'>
                        <Text className='text-sm'>September, 2025</Text>
                        <Ionicons name="calendar-clear-outline" size={20} color="#919b94" />
                    </View>
                </View>
                {/* this is for trading char */}
                <View style={{ backgroundColor: "#fefffe", borderRadius: 16 }} className="p-4">
                    <BudgetTrendChart />
                </View>
                {/* this is for Spending by Category */}
                <View>
                    <SpendingChart />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Insights 