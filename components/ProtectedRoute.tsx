// components/ProtectedRoute.tsx
import { useAuth } from '@/context/AuthContext';
import { Redirect, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

type RouteGroup = '(auth)' | '(app)' | '(tabs)' | string;

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { session, isLoading, hasCompletedPaywall } = useAuth();
    const segments = useSegments();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (!isLoading) {
            setIsReady(true);
        }
    }, [isLoading]);

    // Show loading indicator while checking auth state
    if (!isReady || isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    const currentRouteGroup: RouteGroup = segments[0] || '';

    // 1. If user is not logged in, redirect to auth
    if (!session) {
        if (currentRouteGroup !== '(auth)') {
            return <Redirect href="/(auth)" />;
        }
        return <>{children}</>;
    }

    // 2. If user is logged in but hasn't completed paywall
    if (session && !hasCompletedPaywall) {
        if (currentRouteGroup !== '(app)') {
            return <Redirect href="/(app)" />;
        }
        return <>{children}</>;
    }

    // 3. If user is logged in and has completed paywall
    if (session && hasCompletedPaywall) {
        if (currentRouteGroup !== '(tabs)') {
            return <Redirect href="/(tabs)" />;
        }
    }

    return <>{children}</>;
}