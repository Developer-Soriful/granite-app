import { Images } from '@/assets';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const BudgetCalendar = () => {
    const [activeView, setActiveView] = useState('spending');
    const [selectedMonth, setSelectedMonth] = useState('September, 2025');

    // API-ready state structure
    const [budgetData, setBudgetData] = useState({
        dailyBudget: 50, // You can update this from API
        monthlyData: [
            // Each entry: { date: number, amount: number }
            { date: 1, amount: 50 },
            { date: 2, amount: 24 },
            { date: 3, amount: 0 },
            { date: 4, amount: 5 },
            { date: 5, amount: 50 },
            { date: 6, amount: 100 },
            { date: 7, amount: 50 },
            { date: 8, amount: 0 },
            { date: 9, amount: 0 },
            { date: 10, amount: 50 },
            { date: 11, amount: 10 },
            { date: 12, amount: 50 },
            { date: 13, amount: 50 },
            { date: 14, amount: 50 },
            { date: 15, amount: 0 },
            { date: 16, amount: 80 },
            { date: 17, amount: 50 },
            { date: 18, amount: 0 },
            { date: 19, amount: 100 },
            { date: 20, amount: 27 },
            { date: 21, amount: 70 },
            { date: 22, amount: 0 },
            { date: 23, amount: 50 },
            { date: 24, amount: 50 },
            { date: 25, amount: 575 },
            { date: 26, amount: 0 },
            { date: 27, amount: 0 },
            { date: 28, amount: 0 },
            { date: 29, amount: 0 },
            { date: 30, amount: 0 }
        ]
    });

    const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    const getCellStyle = (amount: number) => {
        if (amount === 0) return 'text-gray-400';
        if (amount > budgetData.dailyBudget) return 'text-red-500 font-semibold';
        return 'text-gray-900 font-medium';
    };

    const getCellBg = (amount: number) => {
        if (amount === 0) return 'bg-white';
        if (amount > budgetData.dailyBudget) return 'bg-red-50';
        return 'bg-white';
    };

    // Function to integrate API data
    const loadBudgetData = async (month: string, year: string) => {
        try {
            // Example API call structure
            // const response = await fetch(`/api/budget?month=${month}&year=${year}`);
            // const data = await response.json();
            // setBudgetData(data);

            console.log('Load data for:', month, year);
        } catch (error) {
            console.error('Error loading budget data:', error);
        }
    };

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
        >
            <View style={{
                backgroundColor: "#fefffe",
                borderRadius: 16,
            }} className="p-4">
                <View className='flex flex-col gap-2'>
                    {/* Header */}
                    <Text className="text-xl font-semibold">September 2025</Text>
                    {/* Toggle Buttons */}
                    <View className="flex-row gap-2 border border-[#dfe4e3] p-1 rounded-lg">
                        <TouchableOpacity
                            onPress={() => setActiveView('spending')}
                            className={`flex-1 py-3 px-4 rounded-lg ${activeView === 'spending'
                                ? 'bg-[#e7f4ee]'
                                : 'bg-white'
                                }`}
                        >
                            <Text className={`text-sm font-semibold text-center ${activeView === 'spending' ? 'text-[#4c8167]' : 'text-[#68716c]'
                                }`}>
                                Spending View
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setActiveView('budget')}
                            className={`flex-1 py-3 px-4 rounded-lg ${activeView === 'budget'
                                ? 'bg-[#e7f4ee]'
                                : 'bg-white'
                                }`}
                        >
                            <Text className={`text-sm font-semibold text-center ${activeView === 'budget' ? 'text-[#4c8167]' : 'text-[#68716c]'
                                }`}>
                                Budget View
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {/* Month Selector */}
                    <View className="flex-row items-center justify-between border border-[#dfe4e3] p-1 rounded-lg px-4 py-3 mb-6">
                        <Text className="text-gray-900 font-medium">{selectedMonth}</Text>
                        <Ionicons name="calendar-outline" size={20} color="#9CA3AF" />
                    </View>
                </View>

                <View className='flex flex-col justify-between gap-8'>
                    {/* Calendar */}
                    <View className="bg-white rounded-2xl">
                        {/* Week Day Headers */}
                        <View className="flex-row mb-4">
                            {weekDays.map((day, i) => (
                                <View key={i} className="flex-1 items-center py-2">
                                    <Text className="text-gray-500 text-sm font-medium">{day}</Text>
                                </View>
                            ))}
                        </View>

                        {/* Calendar Grid */}
                        <View className="flex-row flex-wrap">
                            {budgetData.monthlyData.map((day) => (
                                <View
                                    key={day.date}
                                    className={`w-[14.28%] aspect-square p-1`}
                                >
                                    <View className={`flex-1 items-start justify-center border border-[#dfe4e3] p-1 rounded-[6px]`}>
                                        <Text className="text-[10px] text-gray-600 mb-0.5">{day.date}</Text>
                                        <Text className={`text-[10px] ${getCellStyle(day.amount)}`}>
                                            {day.amount === 0 ? '-' : `$${day.amount}`}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Legend */}
                    <View className="border border-[#dfe4e3] rounded-xl p-4">
                        <View className="flex-row items-start gap-3 mb-3">
                            <View className="w-2 h-2 rounded-full bg-gray-900 mt-1.5" />
                            <View className="flex-1">
                                <Text className="text-gray-900 font-semibold text-[12px]">Actual Daily Budget</Text>
                                <Text className="text-[#434c49] text-[12px]">Updates based on your spending</Text>
                            </View>
                        </View>
                        <View className="flex-row items-start gap-3">
                            <View className="w-2 h-2 rounded-full bg-red-500 mt-1.5" />
                            <View className="flex-1">
                                <Text className="text-gray-900 font-semibold text-[12px]">Overspending</Text>
                                <Text className="text-[#434c49] text-[12px]">Spent more than your daily budget</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
            {/* this is for transition for every months */}
            <View style={{
                backgroundColor: "#fefffe",
                borderRadius: 16,
                marginTop: 16
            }}>
                <View className='p-4'>
                    <Text className="text-[16px] font-semibold">Transactions for September 25, 2025</Text>
                    <View className='flex-row items-center justify-between gap-3 py-4 border-b border-[#dfe4e3]'>
                        <View className='bg-[#fceff0] p-3 rounded-lg'>
                            <Image source={Images.transaction2} />
                        </View>
                        <View className='flex-1 flex-col gap-1'>
                            <Text className='text-sm font-semibold'>Pizza&Pasta Restaurant</Text>
                            <Text className='text-[12px] text-[#e55069] bg-[#fceff0] px-[6px] py-[3px] w-[80px] text-center rounded-[4px]'>Dining</Text>
                        </View>
                        <Text className='text-[16px] font-semibold'>-$44.56</Text>
                    </View>
                    <View className='flex-row items-center justify-between gap-3 pt-4'>
                        <View className='bg-[#f9eefa] p-3 rounded-lg'>
                            <Image source={Images.transaction3} />
                        </View>
                        <View className='flex-1 flex-col gap-1'>
                            <Text className='text-sm font-semibold'>Fashion Shop</Text>
                            <Text className='text-[12px] text-[#bd52cc] bg-[#f9eefa] px-[6px] py-[3px] w-[80px] text-center rounded-[4px]'>Clothes</Text>
                        </View>
                        <Text className='text-[16px] font-semibold'>-$12.99</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

export default BudgetCalendar;