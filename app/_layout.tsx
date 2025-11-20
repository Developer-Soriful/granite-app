import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Redirect, Slot, Stack, useRouter } from "expo-router";
import React, { useEffect } from 'react';
import { BackHandler, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "./global.css";

function AppRoutes() {
  const { session, isLoading } = useAuth();

  // 1. Loading Check
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {/* <ActivityIndicator size="large" color="#338059" /> */}
        <Text>loading</Text>
      </View>
    );
  }

  if (!session) {
    return <Redirect href="/(auth)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
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