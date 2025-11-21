import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Redirect, Slot, Stack, useRouter } from "expo-router";
import React, { useEffect } from 'react';
import { BackHandler, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "./global.css";

function AppRoutes() {
  const { session, isLoading } = useAuth();
  const router = useRouter();

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
    console.log('No session found, redirecting to auth screen');
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Redirect href="/(auth)/signup" />
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
    // ... (BackHandler logic remains unchanged) ...
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
    <AuthProvider>
      <SafeAreaView style={{ flex: 1, paddingBottom: 0 }} edges={["top"]} >
        <View style={{ flex: 1 }}>
          <AppRoutes />
        </View>
      </SafeAreaView>
    </AuthProvider>
  );
}