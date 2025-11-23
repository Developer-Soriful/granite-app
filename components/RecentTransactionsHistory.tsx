import { Images } from '@/assets';
import { Entypo, Feather } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from 'react-native';

// ─────────────────────────────────────
// Types
// ─────────────────────────────────────
interface Transaction {
    id: string | number;
    name: string;
    amount: number;
    date: string;
    category?: string;
}

interface RecentTransactionsHistoryProps {
    transactions?: Transaction[] | null | undefined;
    isLoading?: boolean;
}

// ─────────────────────────────────────
// 100% SAFE GROUPING FUNCTION (NO CRASH)
// ─────────────────────────────────────
const groupTransactionsByDate = (transactions: Transaction[] | null | undefined) => {
    // Agar kuch bhi nahi hai → empty array return
    if (!transactions || !Array.isArray(transactions) || transactions.length === 0) {
        return [];
    }

    const grouped: { [key: string]: Transaction[] } = {};

    transactions.forEach((t) => {
        const dateKey = new Date(t.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

        if (!grouped[dateKey]) grouped[dateKey] = [];
        grouped[dateKey].push(t);
    });

    return Object.entries(grouped).map(([date, items]) => ({ date, items }));
};

// ─────────────────────────────────────
// Single Transaction Row
// ─────────────────────────────────────
const TransactionItem = ({ name, amount }: { name: string; amount: number }) => {
    const isIncome = amount > 0;
    const displayAmount = isIncome
        ? `+$${Math.abs(amount).toFixed(2)}`
        : `-$${Math.abs(amount).toFixed(2)}`;

    return (
        <View className="p-3 bg-white border border-b border-[#dfe5e2] rounded-[12px] flex flex-row items-center justify-between">
            <View className="flex-row items-center">
                <View className={`p-2 rounded-lg ${isIncome ? 'bg-[#eff4ea]' : 'bg-[#fcedf0]'}`}>
                    <Image source={Images.transaction1} style={{ width: 24, height: 24 }} />
                </View>
                <Text className="ml-3 text-base text-gray-800 font-medium">{name}</Text>
            </View>
            <Text
                className={`text-base font-semibold ${isIncome ? 'text-green-600' : 'text-gray-900'}`}
            >
                {displayAmount}
            </Text>
        </View>
    );
};

// ─────────────────────────────────────
// MAIN COMPONENT — FULLY SAFE
// ─────────────────────────────────────
const RecentTransactionsHistory: React.FC<RecentTransactionsHistoryProps> = ({
    transactions,
    isLoading = false,
}) => {
    // Triple Safety: Default empty array
    const safeTransactions = Array.isArray(transactions) ? transactions : [];
    const groupedData = groupTransactionsByDate(safeTransactions);

    // Loading State
    if (isLoading) {
        return (
            <View className="p-4 rounded-2xl bg-white">
                <Text className="text-xl font-semibold text-black mb-4">
                    Recent Transactions History
                </Text>
                <ActivityIndicator size="large" color="#338059" />
            </View>
        );
    }

    // Empty State
    if (safeTransactions.length === 0) {
        return (
            <View className="p-4 rounded-2xl bg-white">
                <Text className="text-xl font-semibold text-black mb-4">
                    Recent Transactions History
                </Text>
                <Text className="text-center text-gray-500 mt-8">No transactions yet</Text>
            </View>
        );
    }

    // Real Data Render
    return (
        <View className="p-4 rounded-2xl bg-white flex flex-col gap-4 w-full">
            <Text className="text-xl font-semibold text-black">
                Recent Transactions History
            </Text>

            {/* Action Buttons */}
            <View className="flex flex-row gap-2 w-full">
                <TouchableOpacity className="px-5 py-4 bg-white border border-[#f1f4f3] rounded-[12px] flex flex-row items-center justify-between flex-1">
                    <Text className="text-sm text-[#4c8167] font-medium">Add manual</Text>
                    <Feather name="plus" size={18} color="#4B5563" />
                </TouchableOpacity>

                <TouchableOpacity className="px-5 py-4 bg-white border border-[#f1f4f3] rounded-[12px] flex flex-row items-center justify-between flex-1">
                    <Text className="text-sm text-[#4c8167] font-medium">Connect Bank</Text>
                    <Entypo name="link" size={20} color="#4c8166" />
                </TouchableOpacity>
            </View>

            {/* Filters */}
            <View className="w-full flex-row gap-2">
                <TouchableOpacity className="px-5 py-4 bg-white border border-[#f1f4f3] rounded-[12px] flex flex-row items-center justify-between flex-1">
                    <Text className="text-sm">All Accounts</Text>
                    <Feather name="chevron-down" size={14} color="#4B5563" />
                </TouchableOpacity>
                <TouchableOpacity className="px-5 py-4 bg-white border border-[#f1f4f3] rounded-[12px] flex flex-row items-center justify-between flex-1">
                    <Text className="text-sm">All Categories</Text>
                    <Feather name="chevron-down" size={14} color="#4B5563" />
                </TouchableOpacity>
            </View>

            <View className="px-5 py-4 bg-white border border-[#f1f4f3] rounded-[12px] flex flex-row items-center justify-between">
                <Text className="text-sm">Last 30 Days</Text>
                <Feather name="calendar" size={20} color="#909a94" />
            </View>

            {/* Transactions List */}
            <View className="flex-1">
                {groupedData.map(({ date, items }, index) => (
                    <View key={index} className="flex flex-col gap-1 mt-3">
                        <Text className="text-sm text-[#434c49] font-medium">{date}</Text>
                        <View className="flex flex-col gap-2 mt-2">
                            {items.map((item) => (
                                <TransactionItem key={item.id} name={item.name} amount={item.amount} />
                            ))}
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
};

export default RecentTransactionsHistory;