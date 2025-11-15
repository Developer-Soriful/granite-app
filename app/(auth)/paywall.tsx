import { AntDesign, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Dummy hook implementation
const useTrackSignupProgress = (path: string) => {
    React.useEffect(() => {
        console.log(`Tracking signup progress for: ${path}`);
    }, [path]);
};

// Dummy Stripe implementation
const stripePromise = {
    redirectToCheckout: async ({ sessionId }: { sessionId: string }) => {
        console.log('Redirecting to checkout with session:', sessionId);
        // In real app, this would handle Stripe checkout
        Alert.alert('Success', 'Redirecting to payment...');
    }
};

const pricing = {
    monthly: {
        id: 'price_monthly_123',
        amount: 5.99,
        interval: 'month',
        trialDays: 3,
    },
    annual: {
        id: 'price_annual_123',
        amount: 34.99,
        interval: 'year',
        monthlyEquivalent: 3,
        trialDays: 7,
    },
} as const;

export default function Paywall() {
    useTrackSignupProgress('/paywall');
    const params = useLocalSearchParams();
    const message = params.message as string;
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
    const [isLoading, setLoading] = useState(false);
    const currentPlan = pricing[billingCycle];
    const router = useRouter();

    const handleSubscribe = async () => {
        setLoading(true);
        try {
            // Mock API call - replace with your actual payment integration
            const mockSessionId = 'mock_session_' + Date.now();

            const stripe = await stripePromise;
            await stripe.redirectToCheckout({ sessionId: mockSessionId });

            // In real app, you would navigate to success page after payment
            // router.push('/(auth)/payment-success');

        } catch (err: unknown) {
            console.error('subscribe error:', err);
            Alert.alert('Error', 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
            >
                <View className="w-full mx-auto px-6 py-12">
                    {message && (
                        <View className="border border-red-600 bg-red-50 p-4 rounded-lg mb-4">
                            <Text className="text-center text-red-700">{message}</Text>
                        </View>
                    )}

                    <Text className="text-4xl font-bold text-center mb-4">Choose your plan</Text>
                    <Text className="text-lg text-center text-gray-600 mb-8">
                        Get unlimited access to premium savings features.
                    </Text>

                    {/* Billing Toggle */}
                    <View className="flex-row bg-gray-200 rounded-xl mb-8 overflow-hidden self-center">
                        {(['annual', 'monthly'] as const).map((cycle) => (
                            <TouchableOpacity
                                key={cycle}
                                onPress={() => setBillingCycle(cycle)}
                                className={`px-5 py-3 ${billingCycle === cycle
                                    ? 'bg-white text-[#66BB6A]'
                                    : 'text-gray-600'
                                    }`}
                            >
                                <Text className={`font-medium ${billingCycle === cycle ? 'text-[#66BB6A]' : 'text-gray-600'}`}>
                                    {cycle === 'annual' ? 'Annual' : 'Monthly'}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Price Display */}
                    <View className="items-center mb-2">
                        <Text className="text-5xl font-extrabold text-gray-900">
                            ${currentPlan.amount}
                            <Text className="text-xl font-medium text-gray-600">/{currentPlan.interval}</Text>
                        </Text>
                    </View>

                    {billingCycle === 'annual' && (
                        <Text className="text-sm text-gray-500 text-center mb-6">
                            Equivalent to ${pricing.annual.monthlyEquivalent}/month
                        </Text>
                    )}

                    {/* Trial Badge */}
                    <View className="flex-row items-center justify-center bg-green-100 self-center px-4 py-2 rounded-full mb-8">
                        <AntDesign name="safety" size={16} color="#016630" />
                        <Text className="text-green-800 ml-2 font-medium">
                            {currentPlan.trialDays}-Day Free Trial
                        </Text>
                    </View>

                    {/* Call to Action */}
                    <TouchableOpacity
                        onPress={handleSubscribe}
                        disabled={isLoading}
                        className={`w-full py-4 rounded-lg font-semibold flex-row items-center justify-center ${isLoading
                            ? 'bg-gray-400'
                            : 'bg-[#66BB6A]'
                            }`}
                    >
                        <FontAwesome name="lock" size={16} color="white" />
                        <Text className="text-white font-semibold text-lg ml-2">
                            {isLoading
                                ? 'Processing...'
                                : `Subscribe ${billingCycle.charAt(0).toUpperCase() + billingCycle.slice(1)}`}
                        </Text>
                    </TouchableOpacity>

                    {/* Benefits List */}
                    <View className="mt-10 space-y-4">
                        {[
                            'View changes to your daily budget',
                            'Track transactions across all your cards',
                            'See your expected end of month balance',
                        ].map((benefit) => (
                            <View key={benefit} className="flex-row items-center">
                                <AntDesign name="check" size={20} color="#22c55e" />
                                <Text className="text-gray-700 ml-3 text-base">{benefit}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Additional security info */}
                    <View className="mt-8 flex-row items-center justify-center">
                        <MaterialIcons name="security" size={16} color="#6b7280" />
                        <Text className="text-gray-500 text-sm ml-2">
                            Secure payment • Cancel anytime
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}