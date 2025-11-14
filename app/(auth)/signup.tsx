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
import Svg, { Path } from "react-native-svg";

// Google Icon Component
const GoogleIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <Path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <Path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <Path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </Svg>
);

// Apple Icon Component
const AppleIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="black">
    <Path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
  </Svg>
);

// Check Icon Component
const CheckIcon = () => (
  <Svg
    width={16}
    height={16}
    fill="none"
    color={"#d1d5dc"}
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <Path
      color={"#d1d5dc"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </Svg>
);

// Cross Icon Component
const CrossIcon = () => (
  <Svg
    color={"#d1d5dc"}
    width={16}
    height={16}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </Svg>
);

// Requirement Item Component
const RequirementItem = ({ met, text }: { met: boolean; text: string }) => (
  <View className="flex-row items-center space-x-2">
    <View className={`${met ? "text-green-500" : "text-gray-300"}`}>
      {met ? <CheckIcon /> : <CrossIcon />}
    </View>
    <Text className={`text-xs ${met ? "text-[#00a63e]" : "text-[#6a7282]"}`}>
      {text}
    </Text>
  </View>
);

const signupWithOtp = async (email: string, password: string) => {
  console.log("Signup with OTP:", email, password);
  return { success: true, redirectTo: "/(auth)/verify" };
};

const signInWithGoogle = async () => {
  console.log("Google Sign In");
  return { success: true, message: "Google signup successful" };
};

const signInWithApple = async () => {
  console.log("Apple Sign In");
  return { success: true, message: "Apple signup successful" };
};

export default function SignupScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState("");

  const isError =
    message &&
    (message.toLowerCase().includes("error") ||
      message.toLowerCase().includes("already registered") ||
      message.toLowerCase().includes("invalid") ||
      message.toLowerCase().includes("does not meet") ||
      message.toLowerCase().includes("required") ||
      message.toLowerCase().includes("too many requests") ||
      message.toLowerCase().includes("failed") ||
      message.toLowerCase().includes("limit reached"));

  const isAlreadyRegistered =
    message && message.toLowerCase().includes("already registered");

  const requirements = {
    minLength: password.length >= 6,
    hasNumber: /\d/.test(password),
    hasUppercase: /[A-Z]/.test(password),
    hasSpecial: /[!@#$%^&*\-]/.test(password),
  };

  const handleSubmit = async () => {
    if (!email || !password) {
      setMessage("Please fill in all fields");
      return;
    }

    setIsPending(true);
    setMessage("");

    try {
      const result = await signupWithOtp(email, password);

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

  const handleGoogleSignup = async () => {
    setIsPending(true);
    try {
      const result = await signInWithGoogle();
      setMessage(result.message);

      if (result.success) {
        router.replace("/(tabs)");
      }
    } catch (error) {
      setMessage("Google signup failed.");
    } finally {
      setIsPending(false);
    }
  };

  const handleAppleSignup = async () => {
    setIsPending(true);
    try {
      const result = await signInWithApple();
      setMessage(result.message);

      if (result.success) {
        router.replace("/(tabs)");
      }
    } catch (error) {
      setMessage("Apple signup failed.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View>
        <HomeHeader />
      </View>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 px-6 justify-center py-8">
          {/* Title Section */}
          <Text className="text-2xl font-bold text-center text-black mb-2">
            Create Account
          </Text>
          <Text className="text-base text-gray-600 dark:text-gray-400 text-center mb-8">
            Enter your details below to create a new account
          </Text>

          {/* OAuth Buttons */}
          <View className="flex flex-col gap-3">
            {/* Google Signup Button */}
            <TouchableOpacity
              className="flex-row items-center justify-center bg-white border border-gray-300  rounded-lg py-3 px-4 shadow-sm"
              onPress={handleGoogleSignup}
              disabled={isPending}
            >
              <GoogleIcon />
              <Text className="text-base font-medium text-black ml-3">
                Continue with Google
              </Text>
            </TouchableOpacity>

            {/* Apple Signup Button */}
            <TouchableOpacity
              className="flex-row items-center justify-center bg-white border border-gray-300 rounded-lg py-3 px-4 shadow-sm"
              onPress={handleAppleSignup}
              disabled={isPending}
            >
              <AppleIcon />
              <Text className="text-base font-medium text-black ml-3">
                Continue with Apple
              </Text>
            </TouchableOpacity>
          </View>

          {/* Separator */}
          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px bg-[#d1d5dc]" />
            <Text className="mx-3 text-gray-500 dark:text-gray-400 text-sm">
              Or continue with email
            </Text>
            <View className="flex-1 h-px bg-[#d1d5dc]" />
          </View>

          {/* Signup Form */}
          <View className="flex flex-col gap-4">
            {/* Email Input */}
            <View>
              <Text className="text-base font-medium text-black mb-2">
                Email
              </Text>
              <TextInput
                className="border border-gray-300  rounded-lg py-3 px-4 text-base "
                placeholder="name@example.com"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password Input */}
            <View>
              <Text className="text-base font-medium text-black mb-2">
                Password
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg py-3 px-4 text-base bg-white"
                placeholder="Choose a strong password"
                placeholderTextColor="#999"
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
              />

              {/* Password Requirements Checker */}
              <View className="mt-2 space-y-2">
                <RequirementItem
                  met={requirements.minLength}
                  text="At least 6 characters"
                />
                <RequirementItem
                  met={requirements.hasNumber}
                  text="At least one number"
                />
                <RequirementItem
                  met={requirements.hasUppercase}
                  text="At least one uppercase letter"
                />
                <RequirementItem
                  met={requirements.hasSpecial}
                  text="At least one special character (!@#$%^&*-)"
                />
              </View>
            </View>

            {/* Continue Button */}
            <TouchableOpacity
              className={`w-full px-3 py-4 bg-[#338059] rounded-2xl flex-row items-center justify-center ${isPending ? "opacity-50" : ""
                }`}
              onPress={handleSubmit}
              disabled={isPending}
            >
              {isPending ? (
                <View className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Text className="text-white text-sm font-semibold">
                  Continue
                </Text>
              )}
            </TouchableOpacity>

            {/* Message Display */}
            {message ? (
              <View className="mt-2">
                {isAlreadyRegistered ? (
                  <View className="space-y-2">
                    <Text className="text-red-500 text-sm text-center">
                      {message}
                    </Text>
                  </View>
                ) : (
                  <Text
                    className={`text-sm text-center ${isError ? "text-red-500" : "text-green-500"
                      }`}
                  >
                    {message}
                  </Text>
                )}
              </View>
            ) : null}
          </View>

          {/* Login Link */}
          <View className="flex-row justify-center mt-4">
            <Text className="text-gray-600 dark:text-gray-400 text-sm">
              Already have an account?{" "}
            </Text>
            <Link href="/(auth)" asChild>
              <TouchableOpacity>
                <Text className="text-blue-600 dark:text-blue-400 text-sm font-medium">
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
