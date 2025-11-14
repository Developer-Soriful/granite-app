import React, { useMemo } from 'react';
import {
    Text,
    View,
} from 'react-native';

export interface GracePeriodNoticeProps {
    subscription: {
        status: string | null;
        cancel_at_period_end: boolean | null;
        current_period_end: string | null;
    } | null;
}

// Dummy function to calculate days remaining
const getDaysRemaining = (currentPeriodEnd: string | null): number | null => {
    if (!currentPeriodEnd) return null;

    try {
        const endDate = new Date(currentPeriodEnd);
        const today = new Date();
        const timeDiff = endDate.getTime() - today.getTime();
        const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

        return daysRemaining > 0 ? daysRemaining : 0;
    } catch (error) {
        console.error('Error calculating days remaining:', error);
        return null;
    }
};

// Alternative: Fixed demo values for testing
const getDemoDaysRemaining = (): number => {
    // Return random days between 0-10 for demo
    return Math.floor(Math.random() * 11);
};

export default function GracePeriodNotice({
    subscription,
}: GracePeriodNoticeProps) {
    const message = useMemo(() => {
        // For demo purposes, let's show the notice sometimes
        const showDemoNotice = Math.random() > 0.5; // 50% chance to show demo notice

        if (!showDemoNotice) {
            return null;
        }

        // Use actual subscription data if available, otherwise use demo data
        const daysRemaining = subscription?.current_period_end
            ? getDaysRemaining(subscription.current_period_end)
            : getDemoDaysRemaining();

        if (daysRemaining === null || daysRemaining < 0) {
            return null;
        }

        if (daysRemaining === 0) {
            return 'Your subscription expires today. After today you will lose access to Granite.';
        }

        if (daysRemaining === 1) {
            return 'Your subscription will end tomorrow. You retain full access until then.';
        }

        return `Your subscription will end in ${daysRemaining} days. You retain full access until then.`;
    }, [subscription]);

    if (!message) {
        return null;
    }

    return (
        <View className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-900/20">
            <Text className="font-bold text-amber-800 dark:text-amber-100 text-base">
                Subscription ending soon
            </Text>
            <Text className="mt-1 text-amber-900 dark:text-amber-200 text-sm">
                {message}
            </Text>

            {/* Demo indicator */}
            <Text className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                💡 Demo Notice - This appears randomly for testing
            </Text>
        </View>
    );
}