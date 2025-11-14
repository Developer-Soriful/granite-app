import HomeHeader from "@/components/HomeHeader";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const requestPasswordResetOtp = async (email: string) => {
  console.log("Password reset OTP requested for:", email);
  return { success: true, redirectTo: "/(auth)/verify-reset-password" };
};

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState("");

  const isError =
    message
      ?.toLowerCase()
      .match(
        /(error|could not|invalid|not found|no account|too many|limit)/
      ) !== null;

  const handleSubmit = async () => {
    if (!email) {
      setMessage("Please enter your email address");
      return;
    }

    setIsPending(true);
    setMessage("");

    try {
      const result = await requestPasswordResetOtp(email);

      if (result?.redirectTo) {
        router.push(result.redirectTo);
      } else if (result?.error) {
        setMessage(result.error);
      }
    } catch (error) {
      console.log(error);
      setMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
        <HomeHeader></HomeHeader>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 px-6 justify-center py-8">
          {/* Header Section */}
          <View className="text-center mb-6">
            <Text className="text-2xl text-center font-bold text-gray-800 mb-2">
              Forgot Password
            </Text>
            <Text className="text-sm text-gray-600 text-center">
              Enter your email address below and we'll send you a verification
              code to reset your password.
            </Text>
          </View>

          {/* Form */}
          <View className="flex flex-col gap-4">
            {/* Email Input */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Email
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg py-3 px-4 text-base bg-white"
                placeholder="name@example.com"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              className={`w-full bg-[#75c178] py-3 px-4 rounded-lg flex-row items-center justify-center ${
                isPending ? "opacity-50" : ""
              }`}
              onPress={handleSubmit}
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <View className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  <Text className="text-white font-semibold">Sending...</Text>
                </>
              ) : (
                <Text className="text-white font-semibold">
                  Send Verification Code
                </Text>
              )}
            </TouchableOpacity>

            {/* Message Display */}
            {message ? (
              <View
                className={`p-3 rounded-lg border ${
                  isError
                    ? "bg-red-50 text-red-600 border-red-200"
                    : "bg-green-50 text-green-600 border-green-200"
                }`}
              >
                <Text className="text-sm text-center">{message}</Text>
              </View>
            ) : null}
          </View>

          {/* Login Link */}
          <View className="flex-row justify-center mt-6">
            <Text className="text-sm text-gray-600">
              Remember your password?{" "}
            </Text>
            <Link href="/(auth)" asChild>
              <TouchableOpacity>
                <Text className="text-[#66BB6A] font-medium text-sm">
                  Login
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
