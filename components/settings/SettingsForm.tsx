import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
// import { supabase } from '@/api/supabase/client';
import { Ionicons } from '@expo/vector-icons';

interface Defaults {
    fullName?: string;
    income?: number;
    investments?: number;
    savings?: number;
    totalFixedExpenses?: number;
}

interface SettingsFormProps {
    defaults: Defaults;
    onUpdate?: () => void;
}

const formatCurrency = (amount: number | string | undefined): string => {
    const numberAmount = Number(amount);
    if (isNaN(numberAmount)) {
        return '$0.00';
    }
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(numberAmount);
};

export default function SettingsForm({ defaults, onUpdate }: SettingsFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        fullName: defaults?.fullName || '',
        income: defaults?.income?.toString() || '',
        investments: defaults?.investments?.toString() || '',
        savings: defaults?.savings?.toString() || '',
    });

    const handleSubmit = async () => {
        try {
            setLoading(true);
            setErrorMessage(null);
            setSuccessMessage(null);

            // Validation
            if (!formData.fullName.trim()) {
                setErrorMessage('Full name is required');
                return;
            }

            const income = parseFloat(formData.income) || 0;
            const investments = parseFloat(formData.investments) || 0;
            const savings = parseFloat(formData.savings) || 0;

            if (income < 0 || investments < 0 || savings < 0) {
                setErrorMessage('Values cannot be negative');
                return;
            }

            // Get current user
            // const { data: { user }, error: userError } = await supabase.auth.getUser();

            // if (userError || !user) {
            //     setErrorMessage('User not found');
            //     return;
            // }

            // Update user metadata
            // const { error } = await supabase.auth.updateUser({
            //     data: {
            //         fullName: formData.fullName.trim(),
            //         income: income,
            //         investments: investments,
            //         savings: savings,
            //     }
            // });

            // if (error) {
            //     throw error;
            // }

            setSuccessMessage('Settings updated successfully!');

            // Show success alert
            Alert.alert('Success', 'Settings updated successfully!');

            // Call onUpdate callback if provided
            if (onUpdate) {
                onUpdate();
            }

        } catch (error: any) {
            console.error('Error updating settings:', error);
            const errorMsg = error.message || 'Failed to update settings';
            setErrorMessage(errorMsg);
            Alert.alert('Error', errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const clearMessages = () => {
        setErrorMessage(null);
        setSuccessMessage(null);
    };

    return (
        <ScrollView className="flex-1">
            <View className="space-y-6">
                {/* Error Message */}
                {errorMessage && (
                    <View className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <Text className="text-red-800 text-sm">{errorMessage}</Text>
                    </View>
                )}

                {/* Success Message */}
                {successMessage && (
                    <View className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <Text className="text-green-800 text-sm">{successMessage}</Text>
                    </View>
                )}

                {/* Personal Details Section */}
                <View>
                    <Text className="text-lg font-medium text-gray-900 mb-4">
                        Personal Details
                    </Text>
                    <View className="space-y-4">
                        <View>
                            <Text className="block text-sm font-medium text-gray-700  mb-2">
                                Full Name
                            </Text>
                            <TextInput
                                className="w-full rounded-lg border border-gray-300  px-4 py-3 text-base placeholder-gray-400 focus:border-[#507C65]  text-gray-900 "
                                value={formData.fullName}
                                onChangeText={(text) => {
                                    clearMessages();
                                    setFormData(prev => ({ ...prev, fullName: text }));
                                }}
                                placeholder="Enter your full name"
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>
                    </View>
                </View>

                {/* Financial Information Section */}
                <View className=''>
                    <Text className="text-lg font-medium text-gray-900 mb-4">
                        Financial Information
                    </Text>
                    <View className="flex flex-col gap-4">
                        {/* Monthly Income */}
                        <View>
                            <Text className="block text-sm font-medium text-gray-700 mb-2">
                                Monthly Income
                            </Text>
                            <View className="relative">
                                <Ionicons
                                    name="card"
                                    size={16}
                                    color="#9CA3AF"
                                    style={{ position: 'absolute', left: 12, top: 14, zIndex: 10 }}
                                />
                                <TextInput
                                    className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-3 text-base placeholder-gray-400 focus:border-[#507C65] bg-white text-gray-900"
                                    value={formData.income}
                                    onChangeText={(text) => {
                                        clearMessages();
                                        setFormData(prev => ({ ...prev, income: text }));
                                    }}
                                    placeholder="5000.00"
                                    placeholderTextColor="#9CA3AF"
                                    keyboardType="decimal-pad"
                                />
                            </View>
                        </View>

                        {/* Monthly Investments */}
                        <View>
                            <Text className="block text-sm font-medium text-gray-700 mb-2">
                                Monthly Investments
                            </Text>
                            <View className="relative">
                                <Ionicons
                                    name="trending-up"
                                    size={16}
                                    color="#9CA3AF"
                                    style={{ position: 'absolute', left: 12, top: 14, zIndex: 10 }}
                                />
                                <TextInput
                                    className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-3 text-base placeholder-gray-400 focus:border-[#507C65]  text-gray-900"
                                    value={formData.investments}
                                    onChangeText={(text) => {
                                        clearMessages();
                                        setFormData(prev => ({ ...prev, investments: text }));
                                    }}
                                    placeholder="1000.00"
                                    placeholderTextColor="#9CA3AF"
                                    keyboardType="decimal-pad"
                                />
                            </View>
                        </View>

                        {/* Monthly Savings */}
                        <View>
                            <Text className="block text-sm font-medium text-gray-700 mb-2">
                                Monthly Savings
                            </Text>
                            <View className="relative">
                                <Ionicons
                                    name="save"
                                    size={16}
                                    color="#9CA3AF"
                                    style={{ position: 'absolute', left: 12, top: 14, zIndex: 10 }}
                                />
                                <TextInput
                                    className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-3 text-base placeholder-gray-400 focus:border-[#507C65] bg-white text-gray-900"
                                    value={formData.savings}
                                    onChangeText={(text) => {
                                        clearMessages();
                                        setFormData(prev => ({ ...prev, savings: text }));
                                    }}
                                    placeholder="500.00"
                                    placeholderTextColor="#9CA3AF"
                                    keyboardType="decimal-pad"
                                />
                            </View>
                        </View>

                        {/* Total Monthly Fixed Expenses (Read-only with Edit Link) */}
                        <View>
                            <Text className="block text-sm font-medium text-gray-700 mb-2">
                                Total Monthly Fixed Expenses
                            </Text>
                            <View className="relative">
                                <View className="w-full rounded-lg border border-gray-300 px-4 py-3">
                                    <Text className="text-gray-900 font-medium">
                                        {formatCurrency(defaults?.totalFixedExpenses)}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    className="absolute right-3 top-3"
                                // onPress={() => router.push('/(tabs)/settings/expenses')}
                                >
                                    <Ionicons name="create-outline" size={16} color="#507C65" />
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity
                                // onPress={() => router.push('/(dashboard)/settings/expenses')}
                                className="mt-1"
                            >
                                <Text className="text-xs text-[#507C65]">
                                    Tap here to edit fixed expenses
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Submit Button */}
                <View className="pt-4 border-t border-gray-200">
                    <TouchableOpacity
                        className="px-6 py-3 bg-[#4c8167] rounded-lg flex items-center justify-center"
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        <Text className="text-white text-base font-medium">
                            {loading ? 'Updating...' : 'Update Settings'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}