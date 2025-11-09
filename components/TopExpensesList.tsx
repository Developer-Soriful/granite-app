import { Images } from '@/assets';
import { Feather } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

// --- 1. Data Structure and Types ---
interface Expense {
    id: string;
    icon: string;       // Emoji or custom icon
    iconBgColor: string; // Tailwind color class for background
    name: string;
    date: string;       // e.g., "2025-09-19"
    amount: number;     // Negative for expenses
}

// --- 2. Mock Data (Matches the Image) ---
const MOCK_EXPENSES: Expense[] = [
    {
        id: '1',
        icon: Images.transaction2,
        iconBgColor: 'bg-red-100', // bg-pink-100 in image, red-100 is close
        name: 'Restaurant Name',
        date: '2025-09-19',
        amount: -175.00,
    },
    {
        id: '2',
        icon: Images.bolt,
        iconBgColor: 'bg-yellow-100',
        name: 'Utility Example',
        date: '2025-09-19',
        amount: -108.60,
    },
    {
        id: '3',
        icon: Images.transaction2,
        iconBgColor: 'bg-red-100', // bg-pink-100 in image, red-100 is close
        name: 'Restaurant Name',
        date: '2025-09-19',
        amount: -90.00,
    },
    {
        id: '4',
        icon: Images.transaction3,
        iconBgColor: 'bg-purple-100',
        name: 'Fashion Shop',
        date: '2025-09-19',
        amount: -89.99,
    },
    {
        id: '5',
        icon: Images.wallet,
        iconBgColor: 'bg-green-100',
        name: 'Fresh Market',
        date: '2025-09-19',
        amount: -74.56,
    },
];

const TopExpensesList = () => {
    const [expenses, setExpenses] = useState<Expense[]>(MOCK_EXPENSES);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // --- 3. API Integration Placeholder ---
    const fetchExpenses = async () => {
        setLoading(true);
        setError(null);
        try {
            // Replace with your actual API call
            // const response = await fetch('YOUR_API_ENDPOINT/expenses');
            // const data = await response.json();

            // Example of mapping API data to our Expense interface if needed
            /*
            const transformedData: Expense[] = data.map((item: any) => ({
                id: item.id,
                icon: item.categoryIcon || '💸', // Default icon if not provided by API
                iconBgColor: item.categoryColor || 'bg-gray-100', // Default color
                name: item.description,
                date: new Date(item.transactionDate).toISOString().split('T')[0], // Format date
                amount: -Math.abs(item.amount), // Ensure it's negative for expense
            }));
            setExpenses(transformedData.slice(0, 5)); // Limit to top 5
            */

            // For now, we'll just simulate a delay for the mock data
            await new Promise(resolve => setTimeout(resolve, 500));
            setExpenses(MOCK_EXPENSES); // Using mock data
        } catch (err) {
            console.error("Failed to fetch expenses:", err);
            setError("Failed to load expenses. Please try again.");
            setExpenses([]); // Clear expenses on error
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    // --- 4. Render Expense Item ---
    const renderExpenseItem = (expense: Expense, isLast: boolean) => (
        <View
            key={expense.id}
            className={`flex-row items-center py-3 ${!isLast ? 'border-b border-gray-200' : ''}`}
        >
            {/* Icon */}
            <View className={`w-10 h-10 rounded-lg items-center justify-center mr-3 ${expense.iconBgColor}`}>
                <Image source={expense.icon} />
            </View>

            {/* Details (Name & Date) */}
            <View className="flex-1">
                <Text className="text-sm font-semibold text-black">{expense.name}</Text>
                <Text className="text-[12px] text-gray-500">{expense.date}</Text>
            </View>

            {/* Amount */}
            <Text className="text-[16px] font-semibold text-gray-800">
                {`$${expense.amount.toFixed(2)}`}
            </Text>
        </View>
    );

    // --- 5. Component Render ---
    return (
        <View className="bg-white rounded-[16px] p-4 w-full">
            {/* Header */}
            <Text className="text-xl font-semibold text-black mb-4">
                Top 5 Largest Expenses
            </Text>

            {/* Loading/Error/Expense List */}
            {loading ? (
                <Text className="text-center text-black py-8">Loading expenses...</Text>
            ) : error ? (
                <Text className="text-center text-red-500 py-8">{error}</Text>
            ) : expenses.length === 0 ? (
                <Text className="text-center text-gray-500 py-8">No expenses found.</Text>
            ) : (
                <ScrollView showsVerticalScrollIndicator={false} className="max-h-[300px]">
                    {expenses.map((expense, index) =>
                        renderExpenseItem(expense, index === expenses.length - 1)
                    )}
                </ScrollView>
            )}

            {/* "View all transactions" button */}
            <TouchableOpacity
                className="mt-6 bg-[#4c8167] py-3 rounded-xl flex-row items-center justify-between px-5"
            // onPress={() => navigation.navigate('AllTransactions')} // Example navigation
            >
                <Text className="text-base font-semibold text-white mr-2">
                    View all transactions
                </Text>
                <Feather name="arrow-up-right" size={24} color="white" />
            </TouchableOpacity>
        </View>
    );
};

export default TopExpensesList;