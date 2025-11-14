import { PlaidLinkProvider } from "@/components/settings/usePlaidLinkContext";
import { Stack } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "./global.css";

export default function RootLayout() {
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
