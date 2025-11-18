import SubscriptionComponent from '@/components/settings/Subscription';
import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Define Subscription Type (Must match what SubscriptionComponent expects)
interface SubscriptionType {
    id: string;
    user_id: string;
    status: 'active' | 'canceled' | 'trialing' | 'past_due' | string;
    current_period_end: string | number | null;
    cancel_at: string | number | null;
    cancel_at_period_end: boolean | null;
    stripe_subscription_id: string;
    price_id: string;
    next_price_id?: string;
}

// Define the State for the screen
interface ScreenState {
    loading: boolean;
    subscription: SubscriptionType | null;
    error: string | null;
}

// 💡 MOCK SUBSCRIPTION DATA for UI testing
const MOCK_SUBSCRIPTION: SubscriptionType = {
    id: 'mock-sub-123',
    user_id: 'mock-user-456',
    status: 'active', // 'canceled' or 'active' diye test korte paren
    current_period_end: '2025-12-31 23:59:59+00',
    cancel_at: null,
    cancel_at_period_end: false,
    stripe_subscription_id: 'sub_mockid',
    price_id: 'price_annual_123',
    next_price_id: undefined,
};

// 💡 CONFIGURATION PROPS (Must be defined here to pass to the child component)
const APP_CONFIG = {
    CANCELLATION_POLICY_URL: 'https://yourdomain.com/cancellation-policy',
    STRIPE_PRICE_ANNUAL: 'price_annual_123',
    STRIPE_PRICE_MONTHLY: 'price_monthly_456',
    REACTIVATE_API_ENDPOINT: 'https://api.yourdomain.com/reactivate-subscription',
    CANCEL_API_ENDPOINT: 'https://api.yourdomain.com/cancel-subscription',
};

export default function SubscriptionScreen() {
    const [state, setState] = useState<ScreenState>({
        loading: true,
        subscription: null,
        error: null,
    });

    useEffect(() => {
        const fetchSubscriptionData = async () => {
            setState(prev => ({ ...prev, loading: true }));

            // --- PURE MOCK LOGIC START ---

            // 1. Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // 2. Simulate user authentication check (Mock: always succeed)
            const isUserLoggedIn = true;
            if (!isUserLoggedIn) {
                console.log("User not logged in. Redirecting.");
                // Replace with your actual login route if using a router
                Linking.openURL('/login');
                return;
            }

            // 3. Simulate Data Fetching Success (90% success, 10% error)
            const success = Math.random() < 0.9;

            if (success) {
                setState({
                    loading: false,
                    // You can change MOCK_SUBSCRIPTION here for different test scenarios
                    subscription: MOCK_SUBSCRIPTION,
                    error: null,
                });
            } else {
                setState({
                    loading: false,
                    subscription: null,
                    error: 'Mock API failed to return data for testing.',
                });
            }

            // --- PURE MOCK LOGIC END ---
        };

        fetchSubscriptionData();
    }, []);

    // --- Conditional Rendering ---

    if (state.loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#006C76" />
                <Text style={styles.loadingText}>Loading subscription data...</Text>
            </View>
        );
    }

    if (state.error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Error fetching data: {state.error}</Text>
                <Text style={styles.errorText}>Please check your network setup.</Text>
            </View>
        );
    }

    // Pass the fetched subscription data and the configuration to the UI component
    return (
        <View style={styles.container}>
            <View className='px-4 py-6'>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <SubscriptionComponent
                subscription={state.subscription}
                config={APP_CONFIG} // Pass the necessary config props
            />
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e6f5ee',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#6b7280',
    },
    errorText: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
    },
});