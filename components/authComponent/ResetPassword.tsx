// components/authComponent/ResetPassword.tsx (fixed version)
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface ResetPasswordScreenProps {
  email?: string;
}

const updatePasswordWithOtp = async (
  password: string,
  confirmPassword: string
) => {
  console.log("Updating password:", password);
  return { success: true, redirectTo: "/(auth)" };
};

// Simple icons using Ionicons
const CheckIcon = () => (
  <Ionicons name="checkmark-circle" size={16} color="green" />
);
const CrossIcon = () => <Ionicons name="close-circle" size={16} color="gray" />;
const EyeIcon = () => <Ionicons name="eye" size={20} color="gray" />;
const EyeOffIcon = () => <Ionicons name="eye-off" size={20} color="gray" />;

const RequirementItem = ({ met, text }: { met: boolean; text: string }) => (
  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
    {met ? <CheckIcon /> : <CrossIcon />}
    <Text style={{ fontSize: 12, color: met ? "green" : "gray" }}>{text}</Text>
  </View>
);

export default function ResetPasswordScreen({
  email,
}: ResetPasswordScreenProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  console.log("ResetPasswordScreen loaded");

  useEffect(() => {
    if (!email) {
      router.push("/(auth)/forget-password");
    } else {
      setIsVerifying(false);
    }
  }, [email, router]);

  const requirements = {
    minLength: password.length >= 6,
    hasNumber: /\d/.test(password),
    hasUppercase: /[A-Z]/.test(password),
    hasSpecial: /[!@#$%^&*\-]/.test(password),
  };

  const allRequirementsMet = Object.values(requirements).every(Boolean);

  const handleSubmit = async () => {
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!allRequirementsMet) {
      setError("Password does not meet all requirements.");
      return;
    }

    setIsPending(true);

    try {
      const result = await updatePasswordWithOtp(password, confirmPassword);
      if (result?.redirectTo) {
        router.push(result.redirectTo);
      }
    } catch (error) {
      setError("An unexpected error occurred.");
    } finally {
      setIsPending(false);
    }
  };

  if (isVerifying) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>Verifying session...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: "white",
        }}
      >
        <View
          style={{
            flex: 1,
            padding: 24,
            justifyContent: "center",
            backgroundColor: "white",
          }}
        >
          {/* ✅ Title Section - Text components properly wrapped */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: 8,
                color: "black",
              }}
            >
              Set New Password
            </Text>
            <Text
              style={{
                textAlign: "center",
                color: "gray",
                marginBottom: 4,
              }}
            >
              Enter your new password for
            </Text>
            <Text
              style={{
                textAlign: "center",
                color: "green",
                fontWeight: "500",
              }}
            >
              {email || "No email provided"} {/* ✅ Fallback text */}
            </Text>
          </View>

          <View style={{ gap: 16 }}>
            {/* ✅ Password Input Section */}
            <View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "500",
                  marginBottom: 8,
                  color: "black",
                }}
              >
                New Password
              </Text>
              <View style={{ position: "relative" }}>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: "#d1d5db",
                    borderRadius: 8,
                    padding: 12,
                    fontSize: 16,
                    paddingRight: 48,
                    backgroundColor: "white",
                    color: "black",
                  }}
                  placeholder="Enter new password"
                  placeholderTextColor="#999"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={{ position: "absolute", right: 12, top: 12 }}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </TouchableOpacity>
              </View>

              {/* ✅ Requirements List */}
              <View style={{ marginTop: 8, gap: 4 }}>
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
                  text="At least one special character"
                />
              </View>
            </View>

            {/* ✅ Confirm Password Section */}
            <View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "500",
                  marginBottom: 8,
                  color: "black",
                }}
              >
                Confirm New Password
              </Text>
              <View style={{ position: "relative" }}>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: "#d1d5db",
                    borderRadius: 8,
                    padding: 12,
                    fontSize: 16,
                    paddingRight: 48,
                    backgroundColor: "white",
                    color: "black",
                  }}
                  placeholder="Confirm new password"
                  placeholderTextColor="#999"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={{ position: "absolute", right: 12, top: 12 }}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                </TouchableOpacity>
              </View>
            </View>

            {/* ✅ Error Message - Properly wrapped */}
            {error ? (
              <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>
            ) : null}

            {/* ✅ Submit Button */}
            <TouchableOpacity
              style={{
                backgroundColor:
                  allRequirementsMet && password === confirmPassword
                    ? "#66bb6a"
                    : "#bae0bb",
                padding: 12,
                borderRadius: 8,
                opacity:
                  isPending ||
                  !allRequirementsMet ||
                  password !== confirmPassword
                    ? 0.5
                    : 1,
              }}
              onPress={handleSubmit}
              disabled={
                isPending || !allRequirementsMet || password !== confirmPassword
              }
            >
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  fontWeight: "600",
                }}
              >
                {isPending ? "Updating Password..." : "Reset Password"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* ✅ Back Link - Properly wrapped */}
          <View style={{ marginTop: 24 }}>
            <Link href="/(auth)" asChild>
              <TouchableOpacity>
                <Text style={{ color: "gray", textAlign: "center" }}>
                  ← Back to Login
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
