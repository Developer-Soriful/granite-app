import { Feather } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

interface Transaction {
    id: string | number;
    name: string;
    amount: number;
    date: string;
    category?: string;
}

interface Bill {
    id: string | number;
    name: string;
    amount: number;
    dueDate: string;
    paid?: boolean;
}

interface CalenderSectionProps {
    transactions?: Transaction[] | null | undefined;
    upcomingBills?: Bill[] | null | undefined;
    isLoading?: boolean;
}

const CalenderSection: React.FC<CalenderSectionProps> = ({
    transactions,
    upcomingBills,
    isLoading = false,
}) => {
    // 100% SAFE — kono bhabei crash hobe na
    const safeTransactions = Array.isArray(transactions) ? transactions : [];
    const safeBills = Array.isArray(upcomingBills) ? upcomingBills : [];

    if (isLoading) {
        return (
            <View className="p-6 bg-white rounded-2xl items-center">
                <ActivityIndicator size="large" color="#338059" />
                <Text className="mt-4 text-gray-600">Loading calendar...</Text>
            </View>
        );
    }

    return (
        <View className="bg-white rounded-2xl p-6">
            <Text className="text-2xl font-bold text-[#061F12] mb-6">Calendar Overview</Text>

            {/* Upcoming Bills */}
            <View className="mb-8">
                <Text className="text-lg font-semibold text-[#061F12] mb-4">Upcoming Bills</Text>
                {safeBills.length === 0 ? (
                    <Text className="text-gray-500 text-center py-8">No upcoming bills</Text>
                ) : (
                    <View className="space-y-3">
                        {safeBills.map((bill) => (
                            <View
                                key={bill.id}
                                className="flex-row items-center justify-between p-4 bg-[#fcedf0] rounded-xl border border-[#f9d9dd]"
                            >
                                <View className="flex-row items-center gap-4">
                                    <View className="p-3 bg-red-100 rounded-full">
                                        <Feather name="alert-circle" size={24} color="#e11d48" />
                                    </View>
                                    <View>
                                        <Text className="font-semibold text-gray-900">{bill.name}</Text>
                                        <Text className="text-sm text-gray-600">
                                            Due: {new Date(bill.dueDate).toLocaleDateString()}
                                        </Text>
                                    </View>
                                </View>
                                <Text className="font-bold text-red-600">
                                    -${Math.abs(bill.amount).toFixed(2)}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}
            </View>

            {/* This Month's Transactions */}
            <View>
                <Text className="text-lg font-semibold text-[#061F12] mb-4">
                    This Month's Transactions ({safeTransactions.length})
                </Text>
                {safeTransactions.length === 0 ? (
                    <Text className="text-gray-500 text-center py-8">No transactions this month</Text>
                ) : (
                    <View className="space-y-3">
                        {safeTransactions.slice(0, 5).map((t) => (
                            <View
                                key={t.id}
                                className="flex-row items-center justify-between p-4 bg-[#e7f4ee] rounded-xl"
                            >
                                <View className="flex-row items-center gap-4">
                                    <View className="p-3 bg-green-100 rounded-full">
                                        <Feather name="dollar-sign" size={20} color="#22c55e" />
                                    </View>
                                    <View>
                                        <Text className="font-medium text-gray-900">{t.name}</Text>
                                        <Text className="text-xs text-gray-600">
                                            {new Date(t.date).toLocaleDateString()}
                                        </Text>
                                    </View>
                                </View>
                                <Text className={`font-bold ${t.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                    {t.amount < 0 ? '-' : '+'}${Math.abs(t.amount).toFixed(2)}
                                </Text>
                            </View>
                        ))}
                        {safeTransactions.length > 5 && (
                            <Text className="text-center text-gray-600 mt-4">
                                + {safeTransactions.length - 5} more transactions
                            </Text>
                        )}
                    </View>
                )}
            </View>
        </View>
    );
};

export default CalenderSection;