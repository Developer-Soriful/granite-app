import OtpVerifyPage from "@/components/signup_compo/OtpVerifyPage";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View } from "react-native";

const VerifyPage = () => {
  const { email, message } = useLocalSearchParams<{
    email: string;
    message?: string;
  }>();

  return (
    <View className="flex-1">
      <OtpVerifyPage email={email} message={message} />
    </View>
  );
};

export default VerifyPage;