import ProtectedRoute from "@/components/ProtectedRoute";
import supabase from "@/config/supabase.config";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { PlaidProvider } from "@/context/PlaidContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as Linking from "expo-linking";
import { Slot, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from 'react';
import { BackHandler, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import "./global.css";

const queryClient = new QueryClient();

/* -----------------------------
      APP ROUTES LOGIC
------------------------------- */
function AppRoutes() {
  const { isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  // Handle deep linking for OAuth
  useEffect(() => {
    const handleDeepLink = async (event: { url: string }) => {
      const { data, error } = await supabase.auth.getSession();
      if (data?.session) {
        router.replace('/(tabs)');
      }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);
    return () => subscription.remove();
  }, []);

  // Handle Android back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (router.canGoBack()) {
        router.back();
        return true;
      }
      return false;
    });
    return () => backHandler.remove();
  }, []);

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
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <AuthProvider>
          <PlaidProvider>
            <SafeAreaView style={{ flex: 1 }} edges={['top', 'right', 'left']}>
              <StatusBar style="dark" />
              <ProtectedRoute>
                <View style={{ flex: 1 }}>
                  <AppRoutes />
                </View>
              </ProtectedRoute>
            </SafeAreaView>
          </PlaidProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}