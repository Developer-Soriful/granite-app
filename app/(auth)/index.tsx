import HomeHeader from "@/components/HomeHeader";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
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

interface Props {
  placeholder: string;
  secureTextEntry?: boolean;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: string;
}
// Custom Input Component
const Input = ({
  placeholder,
  secureTextEntry = false,
  value,
  onChangeText,
  keyboardType = "default",
}: Props) => (
  <TextInput
    className="border border-gray-300 rounded-lg py-3 px-4 text-base bg-white "
    placeholder={placeholder}
    placeholderTextColor="#999"
    secureTextEntry={secureTextEntry}
    value={value}
    onChangeText={onChangeText}
    keyboardType={keyboardType}
    autoCapitalize="none"
  />
);

// Submit Button Component
const SubmitButton = ({ onPress, children, disabled = false }) => (
  <TouchableOpacity
    className={`bg-[#338059] py-[6px] rounded-[16px] ${disabled ? "opacity-50" : ""}`}
    onPress={onPress}
    disabled={disabled}
  >
    <Text className="text-white text-center text-base font-semibold">
      {children}
    </Text>
  </TouchableOpacity>
);

const emailLogin = async (email: string, password: string) => {
  console.log("Email Login:", email, password);
  return { success: true, message: "Logged in successfully" };
};

const signInWithGoogle = async () => {
  console.log("Google Sign In");
  return { success: true, message: "Google login successful" };
};

const signInWithApple = async () => {
  console.log("Apple Sign In");
  return { success: true, message: "Apple login successful" };
};

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleEmailLogin = async () => {
    if (!email || !password) {
      setMessage("Please fill in all fields");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const result = await emailLogin(email, password);
      setMessage(result.message);

      if (result.success) {
        // Successfully logged in, navigate to home
        router.replace("/(tabs)");
      }
    } catch (error) {
      setMessage("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithGoogle();
      setMessage(result.message);

      if (result.success) {
        router.replace("/(tabs)");
      }
    } catch (error) {
      setMessage("Google login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithApple();
      setMessage(result.message);

      if (result.success) {
        router.replace("/(tabs)");
      }
    } catch (error) {
      setMessage("Apple login failed.");
    } finally {
      setLoading(false);
    }
  };

  const isError =
    message &&
    (message.toLowerCase().includes("error") ||
      message.toLowerCase().includes("could not") ||
      message.toLowerCase().includes("invalid") ||
      message.toLowerCase().includes("failed") ||
      message.toLowerCase().includes("does not meet"));

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 bg-white">
      <HomeHeader />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ flex: 1 }} className="px-6 justify-center py-8">
          {/* Title Section */}
          <Text className="text-2xl font-bold text-center text-black mb-2">
            Welcome Back
          </Text>
          <Text className="text-sm text-[#4a5565] text-center mb-8">
            Enter your email below to login to your account
          </Text>

          {/* OAuth Buttons */}
          <View className="flex flex-col gap-3">
            {/* Google Login Button */}
            <TouchableOpacity
              className="flex-row items-center justify-center bg-white border border-gray-300 rounded-lg py-3 px-4 shadow-sm"
              onPress={handleGoogleLogin}
              disabled={loading}
            >
              <GoogleIcon />
              <Text className="text-base font-medium text-gray-700 ml-3">
                Continue with Google
              </Text>
            </TouchableOpacity>

            {/* Apple Login Button */}
            <TouchableOpacity
              className="flex-row items-center justify-center bg-white border border-gray-300 rounded-lg py-3 px-4 shadow-sm"
              onPress={handleAppleLogin}
              disabled={loading}
            >
              <AppleIcon />
              <Text className="text-base font-medium text-gray-700 ml-3">
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

          {/* Login Form */}
          <View className="flex flex-col gap-4">
            {/* Email Input */}
            <View>
              <Text className="text-sm font-medium text-black mb-2">Email</Text>
              <Input
                placeholder="name@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
            </View>

            {/* Password Input */}
            <View>
              <Text className="text-sm font-medium text-black mb-2">
                Password
              </Text>
              <Input
                placeholder="Enter your password"
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
              />
              <View className="flex-row justify-end mt-1">
                <Link href="/(auth)/forget-password" asChild>
                  <TouchableOpacity>
                    <Text className="text-[#155dfc] text-sm">
                      Forgot password?
                    </Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>

            {/* Login Button */}
            <SubmitButton onPress={handleEmailLogin} disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </SubmitButton>

            {/* Message Display */}
            {message ? (
              <Text
                className={`text-sm text-center mt-2 ${isError ? "text-red-500" : "text-green-500"
                  }`}
              >
                {message}
              </Text>
            ) : null}
          </View>

          {/* Sign Up Link */}
          <View className="flex-row justify-center mt-4">
            <Text className="text-gray-600 dark:text-gray-400 text-sm">
              Don't have an account?{" "}
            </Text>
            <Link href="/signup" asChild>
              <TouchableOpacity>
                <Text className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                  Sign up
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
