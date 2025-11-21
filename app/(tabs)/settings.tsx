import { dummySupabase } from '@/api/supabase/dummy-client';
import Header from '@/components/Header';
import ConnectionManager from '@/components/settings/ConnectionManager';
import GracePeriodNotice from '@/components/settings/GracePeriodNotice';
import SettingsForm from '@/components/settings/SettingsForm';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    Text,
    View,
} from 'react-native';

// ---------------------------
// Type Definitions
// ---------------------------

interface FixedExpensesData {
    [key: string]: number | string | Array<{ amount?: number | string }> | undefined;
    additional?: Array<{ amount?: number | string }>;
}

interface FormDefaults {
    fullName: string;
    income: number;
    investments: number;
    savings: number;
    totalFixedExpenses: number;
}

interface PlaidItem {
    id: string;
    item_id: string;
    status: string;
    accounts: any[];
}

interface Subscription {
    status: string;
    cancel_at_period_end: boolean;
    current_period_end: string;
}

interface UserMetadata {
    fullName?: string;
    income?: number | string;
    investments?: number | string;
    savings?: number | string;
    fixedExpenses?: FixedExpensesData;
}

// ---------------------------
// Utility
// ---------------------------

const safeParseFloat = (value: number | string | undefined): number => {
    if (typeof value === 'number' && !isNaN(value)) return value;
    if (typeof value !== 'string' || value.trim() === '') return 0;
    const number = parseFloat(value);
    return isNaN(number) ? 0 : number;
};

// ---------------------------
// Component
// ---------------------------

export default function SettingsScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<any>(null);
    const [plaidItems, setPlaidItems] = useState<PlaidItem[]>([]);
    const [subscription, setSubscription] = useState<Subscription | null>(null);

    const [formDefaults, setFormDefaults] = useState<FormDefaults>({
        fullName: '',
        income: 0,
        investments: 0,
        savings: 0,
        totalFixedExpenses: 0,
    });

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            setLoading(true);

            const {
                data: { user },
                error: userError,
            } = await dummySupabase.auth.getUser();

            if (userError || !user) {
                router.replace('/(auth)');
                return;
            }

            setUserData({ user });

            // Plaid Items
            const { data: plaidData, error: plaidError } = await dummySupabase
                .from('user_plaid_items')
                .select('id, item_id, status, accounts')
                .eq('user_id', user.id);

            if (!plaidError && Array.isArray(plaidData)) {
                setPlaidItems(plaidData as PlaidItem[]);
            }

            // Subscription
            const { data: subscriptionData } = await dummySupabase
                .from('subscriptions')
                .select('status, cancel_at_period_end, current_period_end')
                .eq('user_id', user.id)
                .order('current_period_end', { ascending: false })
                .limit(1)
                .maybeSingle();

            if (subscriptionData) {
                setSubscription(subscriptionData as Subscription);
            }

            // Metadata
            const metadata: UserMetadata = user.user_metadata || {};
            const fixedExpenses: FixedExpensesData = metadata.fixedExpenses || {};

            let calculatedTotalFixedExpenses = 0;

            for (const key in fixedExpenses) {
                if (key !== 'additional') {
                    const value = fixedExpenses[key];
                    if (typeof value === 'number' || typeof value === 'string') {
                        calculatedTotalFixedExpenses += safeParseFloat(value);
                    }
                }
            }

            if (Array.isArray(fixedExpenses.additional)) {
                fixedExpenses.additional.forEach((item) => {
                    calculatedTotalFixedExpenses += safeParseFloat(item?.amount);
                });
            }

            setFormDefaults({
                fullName: metadata.fullName || '',
                income: safeParseFloat(metadata.income),
                investments: safeParseFloat(metadata.investments),
                savings: safeParseFloat(metadata.savings),
                totalFixedExpenses: calculatedTotalFixedExpenses,
            });

        } catch (error) {
            console.error('Error loading user data:', error);
            Alert.alert('Error', 'Failed to load user data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text className="mt-4 text-gray-600">Loading settings...</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-[#e6f5ee] relative">
            <View
                className="rounded-bl-[16px] rounded-br-[16px]"
                style={{
                    position: 'absolute',
                    backgroundColor: '#e6f5ee',
                    paddingTop: 16,
                    left: 0,
                    right: 0,
                    zIndex: 9,
                    marginLeft: 16,
                    marginRight: 16,
                }}
            >
                <Header />
            </View>

            <ScrollView
                contentContainerStyle={{
                    padding: 16,
                    paddingTop: 80,
                }}
            >
                <View className="mb-6">
                    <Text className="text-3xl font-bold text-black">Settings</Text>
                    <Text className="mt-2 text-sm text-black">
                        Manage your account preferences and financial information
                    </Text>
                </View>

                <View className="rounded-2xl bg-white p-6 mb-6">
                    <SettingsForm defaults={formDefaults} onUpdate={loadUserData} />
                </View>

                <View className="rounded-2xl bg-white p-6 mb-6">
                    <View className="mb-6">
                        <Text className="text-xl font-semibold text-black">Bank Connections</Text>
                        <Text className="mt-1 text-sm text-black">
                            Manage your connected bank accounts and financial institutions
                        </Text>
                    </View>
                    <ConnectionManager items={plaidItems} onUpdate={loadUserData} />
                </View>

                <GracePeriodNotice subscription={subscription} />
            </ScrollView>
        </View>
    );
}
