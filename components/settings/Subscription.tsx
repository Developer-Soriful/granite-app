import { format } from 'date-fns';
import * as Linking from 'expo-linking';
import React, { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { Button } from 'react-native-paper'; // Keeping React Native Paper

// --- SUBSCRIPTION TYPE ---
interface SubscriptionData {
    status: 'active' | 'canceled' | 'trialing' | 'past_due' | string;
    current_period_end: string | number | null;
    cancel_at: string | number | null;
    cancel_at_period_end: boolean | null;
    stripe_subscription_id: string;
    price_id: string;
    next_price_id?: string;
}

// --- NEW PROPS INTERFACE ---
interface SubscriptionComponentProps {
    subscription: SubscriptionData | null;
    // Configuration Props (Now passed from the parent screen)
    config: {
        CANCELLATION_POLICY_URL: string;
        STRIPE_PRICE_ANNUAL: string;
        STRIPE_PRICE_MONTHLY: string;
        REACTIVATE_API_ENDPOINT: string;
        CANCEL_API_ENDPOINT: string;
    };
}

// --- MOCK API FUNCTIONS (KEPT FOR COMPONENT'S INTERNAL MOCKING) ---
const mockReactivateSubscriptionApi = async (subscriptionId: string) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    if (Math.random() < 0.9) {
        return { success: true, message: 'Reactivation successful.' };
    } else {
        return { success: false, error: 'Mock server busy, try again later.' };
    }
};

const mockCancelSubscriptionApi = async (subscriptionId: string) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return { success: true, message: 'Cancellation scheduled.' };
};
// ------------------------------------------------------------------

// --- DATE COERCION UTILITY ---
const coerceDate = (value: unknown): Date | null => {
    if (!value) { return null; }
    let parsableValue = value;
    if (typeof value === 'string') { parsableValue = value.replace(' ', 'T'); }
    if (typeof parsableValue === 'number' && parsableValue < 1e12) { parsableValue = parsableValue * 1000; }
    try {
        const date = new Date(parsableValue as string | number);
        if (Number.isNaN(date.getTime())) { return null; }
        return date;
    } catch (e) {
        console.error('Date coercion error:', e);
        return null;
    }
};

// --- MAIN COMPONENT ---
export default function SubscriptionComponent({ subscription, config }: SubscriptionComponentProps) {
    const [loading, setLoading] = useState(false);
    const [localSubscription, setLocalSubscription] = useState(subscription);
    const sub = localSubscription || subscription;

    // Destructure config for easy access
    const {
        CANCELLATION_POLICY_URL,
        STRIPE_PRICE_ANNUAL,
        STRIPE_PRICE_MONTHLY,
        REACTIVATE_API_ENDPOINT,
        CANCEL_API_ENDPOINT
    } = config;

    // --- Component Logic (Unchanged) ---
    const activeStatus = sub?.status === 'active';
    const cancelledStatus = sub?.status === 'canceled';
    const trialingStatus = sub?.status === 'trialing';

    const currentPeriodEndDate = coerceDate(sub?.current_period_end);
    const cancelAtDate = coerceDate(sub?.cancel_at);
    const cancellationScheduled = Boolean(
        cancelAtDate || sub?.cancel_at_period_end || cancelledStatus,
    );

    const accessEndsDate = cancellationScheduled
        ? (cancelAtDate ?? currentPeriodEndDate)
        : null;

    const isExpired = Boolean(
        cancellationScheduled &&
        accessEndsDate &&
        accessEndsDate.getTime() < new Date().getTime(),
    );

    const formattedAccessEnds = accessEndsDate
        ? format(accessEndsDate, 'MMMM d, yyyy')
        : null;

    const formattedCurrentPeriodEnd = currentPeriodEndDate
        ? format(currentPeriodEndDate, 'MMMM d, yyyy')
        : null;


    const cancellationNotice = cancellationScheduled
        ? formattedAccessEnds
            ? isExpired
                ? `Your subscription ended on ${formattedAccessEnds}.`
                : `Your subscription will end on ${formattedAccessEnds}.`
            : isExpired
                ? 'Your subscription has ended.'
                : 'Your subscription will end at the end of your current billing period.'
        : null;

    const isDowngradeSet = sub?.next_price_id;

    const currentPlan =
        sub?.price_id === STRIPE_PRICE_ANNUAL
            ? 'Annual'
            : sub?.price_id === STRIPE_PRICE_MONTHLY
                ? 'Monthly'
                : 'Unknown';

    const renewalLabel = cancellationScheduled
        ? 'Access ends on:'
        : 'Renewal date:';

    const renewalDate = cancellationScheduled
        ? (formattedAccessEnds ?? formattedCurrentPeriodEnd ?? 'Pending')
        : (formattedCurrentPeriodEnd ?? 'N/A');

    const statusDisplay = isExpired
        ? 'Expired'
        : cancellationScheduled
            ? 'Cancelling'
            : (sub?.status ?? 'Unknown');

    const statusClassName = cancellationScheduled
        ? 'text-red-600'
        : 'text-gray-700';

    const showReactivationButton = Boolean(
        sub?.stripe_subscription_id && cancellationScheduled && !isExpired,
    );

    const showCancelButton = Boolean(
        sub && (activeStatus || trialingStatus) && !cancellationScheduled,
    );


    // --- API HANDLERS (Still using mocks, but referencing config endpoints) ---
    const reactivateSubscription = async () => {
        setLoading(true);
        try {
            // NOTE: In production, replace mockReactivateSubscriptionApi with a real fetch
            // using the REACTIVATE_API_ENDPOINT from props.
            const result = await mockReactivateSubscriptionApi(sub?.stripe_subscription_id || '');

            if (result.success) {
                Alert.alert('Success', result.message || 'Your subscription has been reactivated.');
                setLocalSubscription(prev => ({
                    ...prev!,
                    status: 'active',
                    cancel_at: null,
                    cancel_at_period_end: false,
                }));

            } else {
                Alert.alert('Failed', result.error || 'Failed to reactivate subscription.');
            }
        } catch (err) {
            console.error('Reactivate error:', err);
            Alert.alert('Error', 'Something went wrong while reactivating subscription.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelSubscription = () => {
        Alert.alert(
            'Confirm Cancellation',
            'Are you sure you want to cancel your subscription? Your access will continue until the end of the current billing period.',
            [
                {
                    text: 'Review Policy',
                    onPress: () => Linking.openURL(CANCELLATION_POLICY_URL), // Uses prop value
                    style: 'cancel',
                },
                {
                    text: 'Confirm Cancel',
                    onPress: async () => {
                        setLoading(true);
                        try {
                            // NOTE: In production, replace mockCancelSubscriptionApi with a real fetch
                            // using the CANCEL_API_ENDPOINT from props.
                            const result = await mockCancelSubscriptionApi(sub?.stripe_subscription_id || '');

                            if (result.success) {
                                Alert.alert('Success', result.message || 'Your subscription is now scheduled for cancellation.');
                                setLocalSubscription(prev => ({
                                    ...prev!,
                                    status: 'active',
                                    cancel_at_period_end: true,
                                }));
                            } else {
                                Alert.alert('Failed', result.message || 'Failed to schedule cancellation.');
                            }
                        } catch (err) {
                            console.error('Cancel error:', err);
                            Alert.alert('Error', 'Something went wrong while cancelling subscription.');
                        } finally {
                            setLoading(false);
                        }
                    },
                    style: 'destructive',
                },
            ],
            { cancelable: true }
        );
    };

    // --- RENDERING (Unchanged, uses NativeWind) ---

    return (
        <View className="flex-1 px-4">
            <Text className="text-3xl font-semibold mb-6 text-gray-900">Subscription Settings</Text>

            {/* Plan Overview */}
            <View className="mb-6 p-5 bg-white shadow-md rounded-lg">
                <Text className="text-xl font-semibold mb-4 text-gray-900">
                    Plan Overview
                </Text>
                {sub ? (
                    <>
                        <View className="">
                            <View className="flex-row items-center">
                                <Text className="font-medium min-w-[120px]">Current plan:</Text>
                                <Text className="text-base">{currentPlan}</Text>
                            </View>

                            <View className="flex-row items-center">
                                <Text className="font-medium min-w-[120px]">Status:</Text>
                                <Text className={`capitalize text-base ${statusClassName}`}>{statusDisplay}</Text>
                            </View>

                            {cancellationNotice && (
                                <Text className="text-sm text-red-500">{cancellationNotice}</Text>
                            )}

                            <View className="flex-row items-center">
                                <Text className="font-medium min-w-[120px]">{renewalLabel}</Text>
                                <Text className="text-base">{renewalDate}</Text>
                            </View>
                        </View>

                        {/* Action Button/Notice */}
                        {isExpired ? (
                            <Button
                                mode="contained"
                                onPress={() => Linking.openURL('/paywall')}
                                className="mt-6 bg-blue-600"
                            >
                                Subscribe Again
                            </Button>
                        ) : showReactivationButton ? (
                            <Text className="text-sm text-red-500 mt-4">
                                Want to keep your access past {renewalDate}? Reactivate below.
                            </Text>
                        ) : (
                            isDowngradeSet && (
                                <Text className="mt-4 text-gray-700 text-sm">
                                    You’ll remain on the Annual Plan until {renewalDate}, then switch to Monthly.
                                </Text>
                            )
                        )}
                    </>
                ) : (
                    <Text className="text-gray-600">
                        No subscription found.
                    </Text>
                )}
            </View>

            {/* Subscription Controls */}
            <View className="mb-6 p-5 bg-white shadow-md rounded-lg">
                <Text className="text-xl font-semibold mb-4 text-gray-900">
                    Subscription Controls
                </Text>
                {sub ? (
                    <View>
                        {cancellationNotice && (
                            <Text className="text-sm text-red-500 mb-4">{cancellationNotice}</Text>
                        )}

                        {showCancelButton && (
                            <Button
                                mode="outlined"
                                onPress={handleCancelSubscription}
                                disabled={loading}
                                loading={loading}
                                className="mt-2 border-red-600"
                                labelStyle={{ color: '#dc2626' }}
                            >
                                Cancel Subscription
                            </Button>
                        )}

                        {showReactivationButton && (
                            <Button
                                mode="contained"
                                onPress={reactivateSubscription}
                                disabled={loading || !sub?.stripe_subscription_id}
                                loading={loading}
                                className="mt-2 bg-blue-600"
                            >
                                {loading ? 'Reactivating…' : 'Keep Subscription'}
                            </Button>
                        )}

                        {(showCancelButton || showReactivationButton) && (
                            <Pressable onPress={() => Linking.openURL(CANCELLATION_POLICY_URL)}>
                                <Text className="text-xs mt-2 text-gray-500 underline">
                                    Cancellation policy
                                </Text>
                            </Pressable>
                        )}

                        {isExpired && (
                            <Text className="text-sm text-red-500 mt-4">
                                Your previous plan ended on {renewalDate}.{' '}
                                <Pressable onPress={() => Linking.openURL('/paywall')}>
                                    <Text className="text-blue-600 underline">Subscribe again</Text>
                                </Pressable> to regain access.
                            </Text>
                        )}
                    </View>
                ) : (
                    <Text className="text-gray-600">
                        No subscription found.
                    </Text>
                )}
            </View>

            {/* Billing Help */}
            <View className="p-5 bg-white shadow-md rounded-lg">
                <Text className="text-xl font-semibold mb-4 text-gray-900">
                    Billing Help
                </Text>
                <Text className="mb-3 text-gray-600">
                    Need help with your subscription?
                </Text>
                <Button
                    mode="outlined"
                    onPress={() => Linking.openURL('/contact')}
                    className="border-gray-300"
                    labelStyle={{ color: '#4b5563' }}
                >
                    Contact Us
                </Button>
            </View>
        </View>
    );
}