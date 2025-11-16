import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

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

    const ConstBrainIcon = (props: any) => (

        <Svg
            width={props.width || 24}
            height={props.height || 24}
            viewBox="0 0 24 24"
            fill="none"
            stroke={props.color || "currentColor"}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >

            <Path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
            <Path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
            <Path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
            <Path d="M17.599 6.5a3 3 0 0 0 .399-1.375" />
            <Path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
            <Path d="M3.477 10.896a4 4 0 0 1 .585-.396" />
            <Path d="M19.938 10.5a4 4 0 0 1 .585.396" />
            <Path d="M6 18a4 4 0 0 1-1.967-.516" />
            <Path d="M19.967 17.484A4 4 0 0 1 18 18" />
        </Svg>
    );
    return (
        <View className="flex-1 bg-gray-50">
            <View className='px-4 py-6'>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
            >
                <View className="flex-1 px-4 py-8">
                    <View style={styles.card}>

                        {/* Header */}
                        <View className="text-center">
                            <View className="flex justify-center mb-4">
                                <View className="p-3 rounded-full flex justify-center items-center">
                                    <ConstBrainIcon height={40} width={40} style={{
                                        borderRadius: "100%"
                                    }} color="#5c6bc0" backgroundColor="#e5e7ef" />
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
                                <Text className="mt-2 text-xs text-gray-500 text-center">
                                    Move the slider to continue
                                </Text>
                            )}
                        </View>

                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: '100%',
        backgroundColor: '#F5F5F5',
        borderRadius: 16,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
})