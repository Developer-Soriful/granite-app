// app/(tabs)/insights.tsx

import { Images } from '@/assets'
import BudgetTrendChart from '@/components/BudgetTrendChart'
import DailySpendingChart from '@/components/DailySpendingChart'
import SpendingChart from '@/components/SpendingChart'
import TopExpensesList from '@/components/TopExpensesList'
import { Ionicons } from '@expo/vector-icons'
import { Image, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Insights = () => {
    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: "#e6f5ee", paddingTop: 8 }}
        >
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingHorizontal: 16, // Use horizontal padding only
                    display: "flex",
                    paddingTop: 65,
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
                {/* **NOTE:** The chart component handles its own internal structure now */}
                <View style={{ backgroundColor: "#fefffe", borderRadius: 16 }} className="p-4">
                    <BudgetTrendChart />
                </View>

                {/* this is for Spending by Category */}
                <View>
                    <SpendingChart />
                </View>

                {/* this is for top expensess list */}
                <View>
                    <TopExpensesList />
                </View>

                {/* this is for DailySpendingChart */}
                <View>
                    <DailySpendingChart />
                </View>

                {/* this is for Projected End-of-Month Balance */}
                <View className="bg-white rounded-[16px] p-4 w-full flex flex-col gap-4">
                    <View className='flex flex-col gap-2'>
                        <Text className='text-xl font-semibold'>Projected End-of-Month Balance</Text>
                        <Text className='text-sm text-[#434c49]'>Projection based on average daily spend of $105.80</Text>
                    </View>
                    <View className='px-5 py-3 flex flex-row items-center justify-between border border-[#8fc1a8] rounded-[16px]'>
                        <Text className='text-[32px] font-semibold text-[#4c8167]'>+$1,827.00</Text>
                        <View className='p-[19px] bg-[#e8f2ef] rounded-[16px]'>
                            <Image source={Images.wallet} />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Insights