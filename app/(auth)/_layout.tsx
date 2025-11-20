// app/(auth)/_layout.tsx

import { useAuth } from '@/context/AuthContext';
import { Redirect, Stack } from 'expo-router';
import React from 'react';

export default function AuthLayout() {
    const { session, isLoading } = useAuth();
    if (isLoading) {
        return null;
    }

    if (session) {
        return <Redirect href="/(tabs)" />;
    }
    return <Stack screenOptions={{ headerShown: false }} />;
}