import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Redirect, Slot, Stack, useRouter, useSegments } from "expo-router";
import React, { useEffect } from 'react';
import { BackHandler, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import "./global.css";

function AppRoutes() {
  const { session, isLoading, hasCompletedPaywall } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inTabsGroup = segments[0] === '(tabs)';
    const inSettingsGroup = segments[0] === 'settings';

    if (!session) {
      // If no session and not in auth group, redirect to auth
      if (!inAuthGroup) {
        router.replace('/');
      }
    } else {
      // If has session but not completed paywall, redirect to paywall
      if (!hasCompletedPaywall) {
        if (segments[0] !== 'paywall') {
          router.replace('/paywall');
        }
      }
      // If in auth group but has session, redirect to tabs
      else if (inAuthGroup) {
        router.replace('/(tabs)');
      }
    }
  }, [session, segments, isLoading, hasCompletedPaywall]);

  // Show loading indicator only for a very short time
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // If no session, redirect to auth screen
  if (!session) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Redirect href="/" />
      </Stack>
    );
  }

  // If session exists, show the main app
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Slot />
    </Stack>
  );
}

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (router.canGoBack()) {
          router.back();
          return true;
        }
        return false;
      }
    );
    return () => backHandler.remove();
  }, [router]);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <SafeAreaView style={{ flex: 1 }} edges={['top', 'right', 'left']}>
          <View style={{ flex: 1 }}>
            <AppRoutes />
          </View>
        </SafeAreaView>
      </AuthProvider>
    </SafeAreaProvider>
  );
}