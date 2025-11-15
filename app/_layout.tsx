import { PlaidLinkProvider } from "@/components/settings/usePlaidLinkContext";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { BackHandler, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "./global.css";

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (router.canGoBack()) {
          router.back();
          return true; // Prevent default behavior
        }

        // If no history, you can exit app or show confirmation
        // BackHandler.exitApp();
        return false; // Let default behavior (exit app) happen
      }
    );

    return () => backHandler.remove();
  }, [router]);
  return (
    <PlaidLinkProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fffefe" }}>
        <View style={{ flex: 1 }}>
          <Stack screenOptions={{ headerShown: false }} />
        </View>
      </SafeAreaView>
    </PlaidLinkProvider>
  );
}
