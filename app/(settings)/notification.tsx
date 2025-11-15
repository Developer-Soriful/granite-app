import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Switch, Text, TextInput, View } from 'react-native';
import { Button } from 'react-native-paper'; // Using RNP Button for loading state/style consistency

// --- MOCK API AND TOAST REPLACEMENTS ---

// 1. MOCK API FUNCTION (Replaces the server action updateNotificationSettings)
// In a real app, this would be your fetch/axios call to the API endpoint
const mockUpdateNotificationSettings = async (enabled: boolean, percentage: number) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Basic validation mock
    if (percentage < 1 || percentage > 100) {
        return { success: false, message: 'Threshold must be between 1 and 100.' };
    }

    // Simulate success
    return { success: true, message: 'Notification settings updated successfully!' };
};

// 2. Simple Toast/Alert Replacement (Replaces sonner/toast)
const showToast = (message: string, isSuccess: boolean) => {
    Alert.alert(isSuccess ? 'Success' : 'Error', message);
};

// 3. Simple SubmitButton component (Replaces the React Server Component)
// This is now just a styled React Native Paper Button
interface SubmitButtonProps {
    isLoading: boolean;
    onPress: () => void;
    children: React.ReactNode;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isLoading, onPress, children }) => {
    return (
        <Button
            mode="contained"
            onPress={onPress}
            disabled={isLoading}
            loading={isLoading}
            className="mt-6 bg-blue-600 rounded-lg py-1"
            labelStyle={{ fontSize: 16, fontWeight: '600', color: 'white' }}
        >
            {children}
        </Button>
    );
};

// -------------------------------------------------------------------

type Props = {
    initialEnabled: boolean;
    initialPercentage: number;
};

export default function NotificationSettings({
    initialEnabled,
    initialPercentage,
}: Props) {
    // Local state replaces formData and defaultChecked/defaultValue
    const [isEnabled, setIsEnabled] = useState(initialEnabled);
    const [percentage, setPercentage] = useState(String(initialPercentage));
    const [isPending, setIsPending] = useState(false); // Replaces useTransition

    const handleSubmit = async () => {
        const percentageValue = parseInt(percentage, 10);

        // Basic Client-side Validation
        if (isNaN(percentageValue) || percentageValue < 1 || percentageValue > 100) {
            showToast('Please enter a valid percentage between 1 and 100.', false);
            return;
        }

        setIsPending(true);

        try {
            // Call the mock API function (or your real fetch/axios call)
            const result = await mockUpdateNotificationSettings(isEnabled, percentageValue);

            if (result.success) {
                showToast(result.message, true);
            } else {
                showToast(result.message, false);
            }
        } catch (error) {
            console.error("Submission error:", error);
            showToast('An unexpected error occurred.', false);
        } finally {
            setIsPending(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1"
        >
            <ScrollView className="mx-auto w-full max-w-3xl px-4 py-8 bg-white dark:bg-gray-900">
                <Text className="text-4xl font-semibold mb-8 text-gray-900 dark:text-gray-100">Notification Settings</Text>

                {/* Form Content */}
                <View className="space-y-6">
                    <View className="rounded-2xl border border-gray-200 p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700">
                        <Text className="mb-4 text-xl font-medium text-gray-900 dark:text-gray-100">
                            Budget Swing Alerts
                        </Text>

                        {/* Switch Control */}
                        <Pressable
                            onPress={() => setIsEnabled(prev => !prev)}
                            className="flex-row items-center justify-between"
                        >
                            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 w-4/5">
                                Email me if my daily budget changes more than the threshold
                            </Text>
                            <Switch
                                trackColor={{ false: "#767577", true: "#3b82f6" }} // blue-500
                                thumbColor={isEnabled ? "#f4f3f4" : "#f4f3f4"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={setIsEnabled}
                                value={isEnabled}
                            />
                        </Pressable>

                        {/* Threshold Input */}
                        <View className="mt-6">
                            <Text className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Threshold (%)
                            </Text>
                            <TextInput
                                // No 'id' or 'name' needed in React Native, data is managed by state
                                keyboardType="numeric"
                                onChangeText={setPercentage}
                                value={percentage}
                                maxLength={3}
                                className="mt-1 w-40 rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500"
                                placeholder="e.g., 10"
                            />
                            <Text className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                Triggers when today vs. yesterday changes by this percent or more.
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Submit Button */}
                <SubmitButton isLoading={isPending} onPress={handleSubmit}>
                    Save Settings
                </SubmitButton>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}