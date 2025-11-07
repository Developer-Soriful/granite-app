import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
// --- Expo Icon Imports ---
import { Images } from '@/assets';
import { Entypo, Feather } from '@expo/vector-icons';
const transactionsData = [
    {
        date: '2025-09-19', items: [
            { id: 1, name: 'Transaction Name', amount: '-$435.00', icon: Images.transaction1, iconSet: 'Feather', iconBg: 'bg-[#eff4ea]' },
            { id: 2, name: 'Transaction Name', amount: '-$88.00', icon: Images.transaction2, iconSet: 'Feather', iconBg: 'bg-[#fcedf0]' },
            { id: 3, name: 'Transaction Name', amount: '-$24.50', icon: Images.transaction3, iconSet: 'Ionicons', iconBg: 'bg-[#f9edf8]' },
            { id: 4, name: 'Transaction Name', amount: '-$67.80', icon: Images.transaction1, iconSet: 'Feather', iconBg: 'bg-[#eff4ea]' },
        ]
    },
    {
        date: '2025-09-18', items: [
            { id: 5, name: 'Transaction Name', amount: '-$12.99', icon: Images.transaction4, iconSet: 'Ionicons', iconBg: 'bg-[#e9f4f9]' },
            { id: 6, name: 'Transaction Name', amount: '-$24.50', icon: Images.transaction2, iconSet: 'Feather', iconBg: 'bg-[#fcedf0]' },
            { id: 7, name: 'Transaction Name', amount: ' -$24.50', icon: Images.transaction5, iconSet: 'Ionicons', iconBg: 'bg-[#fcf1ea]' },
        ]
    },
];
// --- End Dummy Data ---

// Reusable component for a single transaction row
const TransactionItem = ({ icon, iconBg, name, amount }: any) => {
    return (
        <View className="p-3 bg-white border border-b border-[#dfe5e2] rounded-[12px] flex flex-row items-center justify-between">
            <View className="flex-row items-center">
                <View className={`p-2 rounded-lg ${iconBg}`}>
                    <Image source={icon} />
                </View>
                <Text className="ml-3 text-base text-gray-800 font-medium">{name}</Text>
            </View>
            <Text className="text-base font-semibold text-gray-900">{amount}</Text>
        </View>
    );
};


const RecentTransactionsHistory = () => {
    return (
        <View className="p-4 rounded-2xl bg-white flex flex-col gap-4 w-full">
            <Text className="text-xl font-semibold text-black">
                Recent Transactions History
            </Text>

            {/* Action Buttons - CORRECTED */}
            <View className="flex flex-row gap-2 w-full">
                {/* Change w-full to flex-1 here */}
                <TouchableOpacity className="px-5 py-4 bg-white border border-[#f1f4f3] rounded-[12px] flex flex-row items-center justify-between flex-1">
                    <Text className="text-sm text-[#4c8166] font-medium">Add manual</Text>
                    <Feather name="plus" size={18} color="#4B5563" />
                </TouchableOpacity>

                {/* Change w-full to flex-1 here */}
                <TouchableOpacity className="px-5 py-4 bg-white border border-[#f1f4f3] rounded-[12px] flex flex-row items-center justify-between flex-1">
                    <Text className="text-sm text-[#4c8166] font-medium">Connect Bank</Text>
                    <Entypo name="link" size={20} color="#4c8166" />
                </TouchableOpacity>
            </View>

            {/* Filter/Date Row */}
            <View className="w-full flex-row gap-2">
                {/* Accounts Dropdown */}
                <TouchableOpacity className="px-5 py-4 bg-white border border-[#f1f4f3] rounded-[12px] flex flex-row items-center justify-between flex-1">
                    <Text className="text-sm">All Accounts</Text>
                    <Feather name="chevron-down" size={14} color="#4B5563" />
                </TouchableOpacity>

                {/* Categories Dropdown */}
                <TouchableOpacity className="px-5 py-4 bg-white border border-[#f1f4f3] rounded-[12px] flex flex-row items-center justify-between flex-1">
                    <Text className="text-sm">All Categories</Text>
                    <Feather name="chevron-down" size={14} color="#4B5563" />
                </TouchableOpacity>
            </View>

            {/* Date Picker Input */}
            <View className="px-5 py-4 bg-white border border-[#f1f4f3] rounded-[12px] flex flex-row items-center justify-between ">
                <Text className="text-sm">September, 2025</Text>
                <Feather name="calendar" size={20} color="#909a94" />
            </View>

            {/* Transactions List */}
            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                {transactionsData.map((section, index) => (
                    <View className='flex flex-col gap-1 mt-3' key={index}>
                        {/* Date Header */}
                        <Text className="text-sm text-[#434c49]">
                            {section.date}
                        </Text>

                        {/* List of Transactions for the Date */}
                        <View className=" flex flex-col gap-2">
                            {section.items.map(item => (
                                <TransactionItem
                                    key={item.id}
                                    icon={item.icon}
                                    iconBg={item.iconBg}
                                    name={item.name}
                                    amount={item.amount}
                                />
                            ))}
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

export default RecentTransactionsHistory;