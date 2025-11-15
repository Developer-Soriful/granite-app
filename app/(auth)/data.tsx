import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

// Dummy functions - replace with your actual implementations
const useTrackSignupProgress = (path: string) => {
    React.useEffect(() => {
        console.log(`Tracking signup progress: ${path}`);
    }, [path]);
};

const updateFinancialData = async (data: any) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock success response
    return {
        success: true,
        message: 'Financial data saved successfully'
    };
};

interface AdditionalExpense {
    name: string;
    amount: string;
}

export default function DataCollectionPage() {
    const router = useRouter();
    useTrackSignupProgress('/data');

    const [income, setIncome] = useState('');
    const [investments, setInvestments] = useState('');
    const [savings, setSavings] = useState('');
    const [expenses, setExpenses] = useState({
        rentMortgage: '',
        utilities: '',
        internet: '',
        phone: '',
    });
    const [additionalExpenses, setAdditionalExpenses] = useState<AdditionalExpense[]>([
        { name: '', amount: '' }
    ]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleNumericChange = (setter: React.Dispatch<React.SetStateAction<string>>) =>
        (text: string) => {
            if (text === '' || /^\d*\.?\d*$/.test(text)) {
                setter(text);
            }
        };

    const handleExpenseChange = (field: string) => (text: string) => {
        if (text === '' || /^\d*\.?\d*$/.test(text)) {
            setExpenses(prev => ({ ...prev, [field]: text }));
        }
    };

    const handleAdditionalExpenseChange = (index: number, field: keyof AdditionalExpense, text: string) => {
        const list = [...additionalExpenses];
        if (field === 'amount' && text !== '' && !/^\d*\.?\d*$/.test(text)) {
            return;
        }
        list[index] = { ...list[index], [field]: text };
        setAdditionalExpenses(list);
    };

    const addExpenseField = () => {
        setAdditionalExpenses(prev => [...prev, { name: '', amount: '' }]);
    };

    const removeExpenseField = (index: number) => {
        setAdditionalExpenses(prev => prev.filter((_, i) => i !== index));
    };

    const formatLabel = (key: string) => {
        switch (key) {
            case 'rentMortgage':
                return 'Rent / Mortgage';
            case 'internet':
                return 'Internet / Wifi';
            default:
                return key
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, str => str.toUpperCase());
        }
    };

    const handleSubmit = async () => {
        setErrorMessage('');
        setLoading(true);

        const dataToSubmit = {
            income: income || '0',
            investments: investments || '0',
            savings: savings || '0',
            fixedExpenses: {
                rentMortgage: expenses.rentMortgage || '0',
                utilities: expenses.utilities || '0',
                internet: expenses.internet || '0',
                phone: expenses.phone || '0',
                additional: additionalExpenses.filter(
                    exp => exp.name.trim() !== '' && exp.amount.trim() !== ''
                ),
            },
        };

        console.log('Submitting data:', dataToSubmit);

        try {
            const result = await updateFinancialData(dataToSubmit);
            if (result.success) {
                Alert.alert('Success', result.message);
                router.push('/(auth)/paln_summary');
            } else {
                setErrorMessage(result.message);
                Alert.alert('Error', result.message);
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
            setErrorMessage(message);
            Alert.alert('Error', message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
                className="py-6"
            >
                <View className="flex-1 justify-center px-4">
                    <View className="bg-white rounded-2xl shadow-lg p-6">

                        {/* Header */}
                        <View className="text-center mb-6">
                            <Text className="text-2xl font-bold text-gray-900 mb-2">
                                Let's see if you were right
                            </Text>
                            <Text className="text-gray-600 text-center">
                                Fill in the fields below to calculate your daily budget
                            </Text>
                        </View>

                        {/* Income Section */}
                        <View className="space-y-4 border-t border-gray-200 pt-6 mb-6">
                            <Text className="text-lg font-semibold text-gray-800 mb-2">
                                Monthly Income
                            </Text>

                            <View>
                                <Text className="block text-sm font-medium text-gray-700 mb-1">
                                    Your typical take-home pay per month
                                </Text>
                                <View className="relative">
                                    <Text className="absolute left-3 top-3 text-gray-500">$</Text>
                                    <TextInput
                                        value={income}
                                        onChangeText={handleNumericChange(setIncome)}
                                        placeholder="e.g., 3500"
                                        keyboardType="decimal-pad"
                                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg bg-white"
                                    />
                                </View>
                                <Text className="mt-1 text-xs text-gray-500">
                                    After taxes and deductions. If variable, estimate an average.
                                </Text>
                            </View>
                        </View>

                        {/* Savings & Investments Section */}
                        <View className="space-y-4 border-t border-gray-200 pt-6 mb-6">
                            <Text className="text-lg font-semibold text-gray-800 mb-2">
                                Monthly Savings & Investments
                            </Text>
                            <Text className="text-sm text-gray-600 mb-4">
                                Money you set aside after receiving your paycheck (not payroll deductions like 401k). Leave blank if not applicable.
                            </Text>

                            {/* Investments */}
                            <View>
                                <Text className="block text-sm font-medium text-gray-700 mb-1">
                                    Investment Accounts (IRA, Crypto, etc.)
                                </Text>
                                <View className="relative">
                                    <Text className="absolute left-3 top-3 text-gray-500">$</Text>
                                    <TextInput
                                        value={investments}
                                        onChangeText={handleNumericChange(setInvestments)}
                                        placeholder="e.g., 500"
                                        keyboardType="decimal-pad"
                                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg bg-white"
                                    />
                                </View>
                            </View>

                            {/* Savings */}
                            <View>
                                <Text className="block text-sm font-medium text-gray-700 mb-1">
                                    High-Yield Savings (Emergency Fund, Vacation fund, etc.)
                                </Text>
                                <View className="relative">
                                    <Text className="absolute left-3 top-3 text-gray-500">$</Text>
                                    <TextInput
                                        value={savings}
                                        onChangeText={handleNumericChange(setSavings)}
                                        placeholder="e.g., 300"
                                        keyboardType="decimal-pad"
                                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg bg-white"
                                    />
                                </View>
                            </View>
                        </View>

                        {/* Fixed Expenses Section */}
                        <View className="space-y-4 border-t border-gray-200 pt-6 mb-6">
                            <Text className="text-lg font-semibold text-gray-800 mb-2">
                                Fixed Monthly Expenses
                            </Text>
                            <Text className="text-sm text-gray-600 mb-4">
                                Enter the amounts for recurring bills each month. Leave blank if not applicable.
                            </Text>

                            {/* Fixed Expenses */}
                            {Object.entries(expenses).map(([key, value]) => (
                                <View key={key} className="mb-3">
                                    <Text className="block text-sm font-medium text-gray-700 mb-1">
                                        {formatLabel(key)}
                                    </Text>
                                    <View className="relative">
                                        <Text className="absolute left-3 top-3 text-gray-500">$</Text>
                                        <TextInput
                                            value={value}
                                            onChangeText={handleExpenseChange(key)}
                                            placeholder="0.00"
                                            keyboardType="decimal-pad"
                                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg bg-white"
                                        />
                                    </View>
                                </View>
                            ))}

                            {/* Additional Expenses */}
                            {additionalExpenses.map((expense, index) => (
                                <View key={index} className="border-t border-gray-200 pt-4 mb-4">
                                    <View className="flex-row items-start space-x-3">
                                        <View className="flex-1">
                                            <Text className="block text-sm font-medium text-gray-700 mb-1">
                                                Other Expense #{index + 1}
                                            </Text>
                                            <TextInput
                                                value={expense.name}
                                                onChangeText={(text) => handleAdditionalExpenseChange(index, 'name', text)}
                                                placeholder="Gym, Netflix, Insurance..."
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white mb-3"
                                            />
                                            <View className="relative">
                                                <Text className="absolute left-3 top-3 text-gray-500">$</Text>
                                                <TextInput
                                                    value={expense.amount}
                                                    onChangeText={(text) => handleAdditionalExpenseChange(index, 'amount', text)}
                                                    placeholder="e.g., 50"
                                                    keyboardType="decimal-pad"
                                                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg bg-white"
                                                />
                                            </View>
                                        </View>
                                        <TouchableOpacity
                                            onPress={() => removeExpenseField(index)}
                                            className="p-2 mt-6"
                                        >
                                            <Ionicons name="close-circle" size={24} color="#DC2626" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}

                            <TouchableOpacity
                                onPress={addExpenseField}
                                className="flex-row items-center justify-center py-3 border border-[#66BB6A] rounded-lg bg-[#66BB6A]/10"
                            >
                                <Ionicons name="add" size={20} color="#66BB6A" />
                                <Text className="text-[#66BB6A] font-medium ml-2">
                                    Add Other Expense
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Info Box */}
                        <View className="flex-row items-start p-3 bg-[#66BB6A]/10 border border-[#66BB6A]/30 rounded-lg mb-6">
                            <Ionicons name="information-circle" size={20} color="#66BB6A" style={{ marginRight: 8, marginTop: 2 }} />
                            <Text className="text-sm text-[#66BB6A] flex-1">
                                Don't worry if it's not perfect right now. You can always edit these amounts later in your settings.
                            </Text>
                        </View>

                        {/* Error Message */}
                        {errorMessage && (
                            <Text className="text-red-600 text-sm text-center mb-4">
                                {errorMessage}
                            </Text>
                        )}

                        {/* Submit Button */}
                        <TouchableOpacity
                            onPress={handleSubmit}
                            disabled={loading || !income}
                            className={`py-4 rounded-lg ${loading || !income ? 'bg-gray-400' : 'bg-[#66BB6A]'}`}
                        >
                            <View className="flex-row items-center justify-center">
                                {loading && (
                                    <Ionicons name="refresh" size={20} color="white" style={{ marginRight: 8 }} />
                                )}
                                <Text className="text-white font-semibold text-center text-lg">
                                    {loading ? 'Saving...' : 'Calculate My Budget'}
                                </Text>
                            </View>
                        </TouchableOpacity>

                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}