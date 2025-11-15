import Slider from '@react-native-community/slider';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

// Dummy functions - replace with your actual implementations
const useTrackSignupProgress = (path: string) => {
    React.useEffect(() => {
        console.log(`Tracking signup progress: ${path}`);
    }, [path]);
};

const updateBudgetGuess = async (data: any) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock success response
    return {
        success: true,
        message: 'Budget guess saved successfully'
    };
};

export default function GuessPage() {
    useTrackSignupProgress('/guess');
    const [guessAmount, setGuessAmount] = useState(100);
    const [sliderTouched, setSliderTouched] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);

    const router = useRouter();

    const handleSliderChange = (value: number) => {
        setGuessAmount(value);
        setSliderTouched(true);

        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 150);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);

        const dataToSubmit = {
            daily_budget_guess: guessAmount,
            guess_timestamp: new Date().toISOString(),
        };

        try {
            const result = await updateBudgetGuess(dataToSubmit);

            if (result.success) {
                router.push('/(auth)/data');
            } else {
                setError(result.message);
                console.error('Error saving guess:', result.message);
            }
        } catch (err: unknown) {
            setError('Something went wrong. Please try again.');
            console.error('Error in handleSubmit:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
            >
                <View className="flex-1 justify-center px-4 py-8">
                    <View className="bg-[#F5F5F5] rounded-2xl shadow-lg p-6 space-y-6">

                        {/* Header */}
                        <View className="text-center">
                            <View className="flex justify-center mb-4">
                                <View className="p-3 bg-[#5C6BC0]/10 rounded-full">
                                    <Text className="text-2xl">🧠</Text>
                                </View>
                            </View>
                            <Text className="text-2xl font-bold text-[#2E2E2E] mb-2">
                                How well do you know your budget?
                            </Text>
                            <Text className="text-base text-gray-600 leading-relaxed">
                                After paying your bills, how much do you think you can spend each day?
                            </Text>
                        </View>

                        {/* Current Guess Display */}
                        <View className="text-center">
                            <View className="bg-gradient-to-r from-[#66BB6A]/10 to-[#4CAF50]/10 p-6 rounded-2xl border border-[#66BB6A]/30">
                                <Text className="text-sm text-gray-600 mb-2">
                                    Your guess:
                                </Text>
                                <Text
                                    className={`text-5xl font-bold text-[#66BB6A] ${isAnimating ? 'scale-110' : ''
                                        }`}
                                    style={{
                                        transform: [{ scale: isAnimating ? 1.1 : 1 }]
                                    }}
                                >
                                    ${guessAmount}
                                </Text>
                            </View>
                        </View>

                        {/* Slider */}
                        <View>
                            <Text className="block text-sm font-medium text-[#2E2E2E] mb-4 text-center">
                                Use the slider to make your guess:
                            </Text>

                            <View className="relative">
                                <Slider
                                    minimumValue={0}
                                    maximumValue={300}
                                    step={5}
                                    value={guessAmount}
                                    onValueChange={handleSliderChange}
                                    minimumTrackTintColor="#66BB6A"
                                    maximumTrackTintColor="#E5E7EB"
                                    thumbTintColor="#66BB6A"
                                    style={{ width: '100%', height: 40 }}
                                />

                                {/* Slider Labels */}
                                <View className="flex flex-row justify-between mt-2">
                                    <Text className="text-xs text-gray-500">$0</Text>
                                    <Text className="text-xs text-gray-500">$100</Text>
                                    <Text className="text-xs text-gray-500">$200</Text>
                                    <Text className="text-xs text-gray-500">$300</Text>
                                </View>
                            </View>
                        </View>

                        {/* Error Display */}
                        {error && (
                            <View className="p-3 bg-red-50 border border-red-200 rounded-2xl">
                                <Text className="text-sm text-red-600">
                                    {error}
                                </Text>
                            </View>
                        )}

                        {/* Submit Button */}
                        <View className="text-center pt-2">
                            <TouchableOpacity
                                onPress={handleSubmit}
                                disabled={!sliderTouched || loading}
                                className={`py-4 rounded-2xl shadow-lg ${!sliderTouched || loading
                                    ? 'bg-gray-300'
                                    : 'bg-[#66BB6A]'
                                    }`}
                            >
                                <Text className={`text-lg font-semibold text-center ${!sliderTouched || loading ? 'text-gray-500' : 'text-white'
                                    }`}>
                                    {loading ? 'Saving...' : 'Lock in my guess! 🔒'}
                                </Text>
                            </TouchableOpacity>

                            {!sliderTouched && (
                                <Text className="mt-2 text-xs text-gray-500">
                                    Move the slider to continue
                                </Text>
                            )}
                        </View>

                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}