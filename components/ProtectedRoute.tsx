// components/ProtectedRoute.tsx
import { Redirect, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { session, isLoading, hasCompletedPaywall } = useAuth();
    const segments = useSegments();
    const router = useRouter();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (!isLoading) {
            setIsReady(true);
        }
    }, [isLoading]);

    // Show loading indicator while checking auth state
    if (!isReady || (session && hasCompletedPaywall === null)) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    const inAuthGroup = segments[0] === '(auth)';
    const inPaywall = segments[0] === 'paywall';

    // If user is not signed in and the initial segment is not in the auth group
    if (!session && !inAuthGroup) {
        return <Redirect href="/(auth)" />;
    }

    // If user is signed in but hasn't completed paywall and not on paywall page
    if (session && !hasCompletedPaywall && !inPaywall) {
        return <Redirect href="/paywall" />;
    }

    // If user is signed in and has completed paywall but is on auth or paywall page
    if (session && hasCompletedPaywall && (inAuthGroup || inPaywall)) {
        return <Redirect href="/(tabs)" />;
    }

    return <>{children}</>;
}