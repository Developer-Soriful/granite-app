import supabase from "@/config/supabase.config";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { PlaidProvider } from "@/context/PlaidContext";
import * as Linking from "expo-linking";
import { Slot, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from 'react';
import { BackHandler, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import "./global.css";

/* -----------------------------
      APP ROUTES LOGIC
------------------------------ */
function AppRoutes() {
  const { session, isLoading, hasCompletedPaywall } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inTabsGroup = segments[0] === '(tabs)';

    if (!session) {
      // If no session and not in auth group, go to auth
      if (!inAuthGroup) {
        router.replace('/(auth)');
      }
    } else if (inAuthGroup && hasCompletedPaywall) {
      // If has session and in auth group, go to tabs
      router.replace('/(tabs)');
    }
  }, [session, segments, isLoading]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Slot />;
}
/* -----------------------------
        ROOT LAYOUT
------------------------------ */
export default function RootLayout() {
  const router = useRouter();

  // SUPABASE OAUTH DEEP LINK HANDLER
  useEffect(() => {
    const subscription = Linking.addEventListener("url", async ({ url }) => {
      console.log("🔗 OAuth Redirect URL:", url);

      const { data, error } = await supabase.auth.exchangeCodeForSession(url);

      if (error) {
        console.log("❌ OAuth Session Exchange Error:", error.message);
        return;
      }

      if (data?.session) {
        console.log("✅ OAuth Login Success → Redirecting to Tabs");
        router.replace("/(tabs)");
      }
    });

    return () => subscription.remove();
  }, []);

  // Android Back Button Handler
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
        <PlaidProvider>
          <SafeAreaView style={{ flex: 1 }} edges={['top', 'right', 'left']}>
            <StatusBar style="dark" />
            <View style={{ flex: 1 }}>
              <AppRoutes />
            </View>
          </SafeAreaView>
        </PlaidProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
