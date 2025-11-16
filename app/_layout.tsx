import { PlaidLinkProvider } from "@/components/settings/usePlaidLinkContext";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { BackHandler, KeyboardAvoidingView, Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "./global.css";

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
    <PlaidLinkProvider>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fffefe" }}>
          <View style={{ flex: 1 }}>
            <Stack screenOptions={{ headerShown: false }} />
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </PlaidLinkProvider>
  );
}
