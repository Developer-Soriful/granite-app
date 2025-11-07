import Header from "@/components/Header";
import { Stack } from "expo-router";
import { View } from "react-native";
import "./global.css";

export default function RootLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: "#e6f5ee" }}>
      <View className="rounded-bl-[16px] rounded-br-[16px]" style={{ position: "absolute", backgroundColor: "#e6f5ee", top: 20, left: 0, right: 0, zIndex: 9, marginLeft: 16, paddingTop: 16, marginRight: 16 }}>
        <Header />
      </View>
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}
