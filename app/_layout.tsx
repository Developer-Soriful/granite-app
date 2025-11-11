import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import "./global.css";

export default function RootLayout() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fffefe" }}>
      {/* <View className="rounded-bl-[16px] rounded-br-[16px]" style={{ position: "absolute", backgroundColor: "#e6f5ee", top: 20, left: 0, right: 0, zIndex: 9, marginLeft: 16, paddingTop: 16, marginRight: 16 }}>
        <Header />
      </View> */}
      {/* <View className="p-4">
        <HomeHeader />
      </View> */}
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaView>
  );
}
