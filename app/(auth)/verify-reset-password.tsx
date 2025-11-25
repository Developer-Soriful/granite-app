import OtpInput from "@/components/OtpInput";
import supabase from "@/config/supabase.config";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const verifyResetOtp = async (email: string, otp: string) => {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token: otp,
    type: 'recovery',
  });

  if (error) {
    return { error: error.message };
  }
  return { success: true, redirectTo: "/(auth)/resetpass" };
};

const resendResetOtp = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) {
    return { error: error.message };
  }
  return { success: true };
};

export default function VerifyResetOtpScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [resendCountdown, setResendCountdown] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState("");

  const isError =
    message &&
    (message.toLowerCase().includes("error") ||
      message.toLowerCase().includes("invalid") ||
      message.toLowerCase().includes("expired") ||
      message.toLowerCase().includes("failed"));

  const isSuccess =
    message &&
    (message.toLowerCase().includes("sent") ||
      message.toLowerCase().includes("check your email"));

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setResendDisabled(false);
    }
  }, [resendCountdown]);

  const handleOtpComplete = (completedOtp: string) => {
    setOtp(completedOtp);
  };

  const handleSubmit = async () => {
    if (!otp || otp.length !== 6) return;
    if (!email) {
      setMessage("Email address is missing. Please try again.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await verifyResetOtp(email, otp);

      if (result?.redirectTo) {
        // @ts-ignore
        router.push(result.redirectTo);
      } else if (result?.error) {
        setMessage(result.error);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (resendDisabled || isResending) return;
    if (!email) {
      setMessage("Email address is missing. Please try again.");
      return;
    }

    setIsResending(true);
    setResendDisabled(true);
    setResendCountdown(60);

    try {
      const result = await resendResetOtp(email);

      if (result?.success) {
        setMessage("Verification code sent! Please check your email.");
      } else if (result?.error) {
        setMessage(result.error);
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      setMessage("Failed to resend code. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 px-6 justify-center py-8">
          <View className="flex flex-col justify-center items-center">
            <Text className="text-2xl font-bold text-gray-800 mb-4">
              Check Your Email
            </Text>
            <Text className="text-gray-600 text-center mb-6">
              We've sent a 6-digit verification code to your email address.
              Please enter it below to reset your password.
            </Text>
          </View>

          <View className="flex flex-col items-center justify-center gap-6">
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-3 text-center">
                Enter Verification Code
              </Text>
              <OtpInput
                length={6}
                onComplete={handleOtpComplete}
                disabled={isSubmitting}
              />
            </View>

            {message ? (
              <Text
                className={`text-sm text-center ${isError
                  ? "text-red-500"
                  : isSuccess
                    ? "text-green-500"
                    : "text-gray-600"
                  }`}
              >
                {message}
              </Text>
            ) : null}

            <TouchableOpacity
              className={`w-full bg-[#66BB6A] py-3 px-4 rounded-lg flex-row items-center justify-center ${isSubmitting || otp.length !== 6 ? "opacity-50" : ""
                }`}
              onPress={handleSubmit}
              disabled={isSubmitting || otp.length !== 6}
            >
              {isSubmitting ? (
                <>
                  <View className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  <Text className="text-white font-semibold">Verifying...</Text>
                </>
              ) : (
                <Text className="text-white font-semibold">
                  Verify & Continue
                </Text>
              )}
            </TouchableOpacity>

            <View className="space-y-4 w-full">
              <TouchableOpacity
                onPress={handleResend}
                disabled={resendDisabled || isResending}
                className={`flex-row items-center justify-start ${resendDisabled || isResending ? "opacity-50" : ""
                  }`}
              >
                {isResending ? (
                  <>
                    <View className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin mr-2" />
                    <Text className="text-sm font-medium text-gray-400">
                      Resending...
                    </Text>
                  </>
                ) : resendDisabled ? (
                  <Text className="text-sm font-medium text-gray-400">
                    Resend Code ({resendCountdown}s)
                  </Text>
                ) : (
                  <Text className="text-sm font-medium text-[#66BB6A]">
                    Resend Code
                  </Text>
                )}
              </TouchableOpacity>

              <View className="flex-row justify-center">
                <TouchableOpacity onPress={() => router.back()}>
                  <Text className="text-sm text-gray-500">
                    ← Back to Forgot Password
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <Text className="text-sm text-gray-500 text-center mt-6">
            (Remember to check your spam folder if you don't see it.)
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
