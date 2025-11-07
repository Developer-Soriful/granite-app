import { Images } from '@/assets'
import { Feather } from '@expo/vector-icons'
import React from 'react'
import { Image, Text, View } from 'react-native'

const SpendingInsights = () => {
    // this is for spending insights card json data
    const spendingInsightsData = [
        {
            "title": "Largest Transaction",
            "value": "$500.00",
            "description": "Doctor Visit",
            "icon": Images.trending_up
        },
        {
            "title": "Top Spending Category",
            "value": "$1,325.99",
            "description": "Food&Dining",
            "icon": Images.chart
        },
        {
            "title": "Number of Transactions",
            "value": "21",
            "description": "Last 7 Days",
            "icon": Images.list
        },
        {
            "title": "Avg Daily Spend",
            "value": "$155.82",
            "description": "This Month",
            "icon": Images.graph
        }
    ]
    return (
        <View className='flex flex-col gap-4 bg-[#fefffe] rounded-[16px] p-4'>
            <Text className='text-[20px] font-semibold'>SpendingInsights</Text>
            <View className='flex flex-col gap-2'>
                {
                    spendingInsightsData.map((item, index) => (
                        <View key={index} style={{
                            borderWidth: 1,
                            borderColor: '#dfe5e2',
                            borderRadius: 12,
                            padding: 16,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            gap: 4
                        }}>
                            <View>
                                <Text className='text-sm font-semibold'>{item.title}</Text>
                                <Text className='text-xl font-semibold'>{item.value}</Text>
                                <Text className='text-sm text-[#434d48]'>{item.description}</Text>
                            </View>
                            <View className='w-[44px] h-[44px] flex justify-center items-center bg-[#ebf1f6] rounded-[12px]'>
                                <Image source={item.icon} />
                            </View>
                        </View>
                    ))
                }
            </View>
            <View className='px-4 py-3 bg-[#4c8167] rounded-[12px] flex flex-row items-center justify-center'>
                <Text className='text-white text-sm font-semibold'> Dive deeper into your spending insight</Text>
                <Feather name="arrow-up-right" size={24} color="white" />
            </View>
        </View>
    )
}

export default SpendingInsights