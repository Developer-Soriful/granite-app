// app/(auth)/_layout.tsx

import { useAuth } from '@/context/AuthContext';
import { Redirect, Stack } from 'expo-router';

export default function AuthLayout() {
    const { session, isLoading } = useAuth();

    if (isLoading) {
        return null;
    }

    // If there's a session, redirect to the main app
    if (session) {
        return <Redirect href="/(tabs)" />;
    }

    // If no session, show the auth stack with signup as the initial route
    return (
        <Stack 
            screenOptions={{ 
                headerShown: false,
                animation: 'fade',
            }}
            initialRouteName="signup"
        >
            <Stack.Screen name="signup" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
        </Stack>
    );
}