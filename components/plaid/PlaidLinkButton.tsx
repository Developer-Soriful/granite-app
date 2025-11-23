// src/components/plaid/ConnectBankButton.tsx
import { usePlaid } from "@/context/PlaidContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

export default function PlaidLinkButton() {
  const { connectBank, isLoading, error } = usePlaid();

  return (
    <View className="p-4">
      <TouchableOpacity
        onPress={connectBank}
        disabled={isLoading}
        className="bg-emerald-600 py-5 px-8 rounded-2xl flex-row items-center justify-center space-x-3 shadow-lg"
      >
        {isLoading ? (
          <>
            <ActivityIndicator color="white" size="small" />
            <Text className="text-white font-bold text-lg">Connecting...</Text>
          </>
        ) : (
          <>
            <MaterialCommunityIcons name="bank-outline" size={24} color="white" />
            <Text className="text-white font-bold text-lg">Connect Your Bank</Text>
          </>
        )}
      </TouchableOpacity>

      {error && (
        <Text className="text-red-500 text-center mt-3 font-medium">
          {error}
        </Text>
      )}
    </View>
  );
}