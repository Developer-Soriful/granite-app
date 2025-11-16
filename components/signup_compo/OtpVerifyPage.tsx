import OtpInput from '@/components/OtpInput';
import { Ionicons } from '@expo/vector-icons';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import SubmitButton from '../settings/SubmitButton';

// Dummy functions - replace with your actual API calls
const verifyOtpAndSignup = async (otp: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock verification - in real app, call your backend
    if (otp === '123456') {
        return {
            success: true,
            redirectTo: '/(auth)/welcome'
        };
    } else {
        return {
            error: 'Invalid verification code. Please try again.'
        };
    }
};

const resendOtp = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock resend - in real app, call your backend
    return {
        success: true,
        message: 'Verification code sent! Please check your email.'
    };
};

export default function OtpVerifyPage() {
    const params = useLocalSearchParams();
    const message = params.message as string;
    const router = useRouter();

    const [otp, setOtp] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [resendDisabled, setResendDisabled] = useState(true);
    const [resendCountdown, setResendCountdown] = useState(60);
    const [isResending, setIsResending] = useState(false);

    const isError =
        message &&
        (message.toLowerCase().includes('error') ||
            message.toLowerCase().includes('invalid') ||
            message.toLowerCase().includes('expired') ||
            message.toLowerCase().includes('failed'));

    const isSuccess =
        message &&
        (message.toLowerCase().includes('sent') ||
            message.toLowerCase().includes('check your email'));

    // Countdown timer for resend button
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

        setIsSubmitting(true);

        try {
            const result = await verifyOtpAndSignup(otp);

            if (result?.redirectTo) {
                router.replace(result.redirectTo as any);
            } else if (result?.error) {
                Alert.alert('Error', result.error);
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            Alert.alert('Error', 'An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResend = async () => {
        if (resendDisabled || isResending) return;

        setIsResending(true);
        setResendDisabled(true);
        setResendCountdown(60);

        try {
            const result = await resendOtp();

            if (result?.success) {
                Alert.alert('Success', 'Verification code sent! Please check your email.');
            } else if (result?.message) {
                Alert.alert('Error', result.message);
            }
        } catch (error) {
            console.error('Error resending OTP:', error);
            Alert.alert('Error', 'Failed to resend code. Please try again.');
        } finally {
            setIsResending(false);
        }
    };

    return (
        <View
            className="flex-1 bg-white"
        >  <View className='px-6 pt-6'>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <View className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg">
                <Text className="text-2xl font-bold text-gray-800 text-center mb-4">
                    Check Your Email
                </Text>
                <Text className="text-gray-600 text-center mb-6">
                    We've sent a 6-digit verification code to your email address.
                    Please enter it below to complete your signup.
                </Text>

                <View className="flex flex-col gap-4">
                    <View>
                        <Text className="block text-sm font-medium text-gray-700 text-center mb-3">
                            Enter Verification Code
                        </Text>
                        <OtpInput
                            length={6}
                            onComplete={handleOtpComplete}
                            disabled={isSubmitting}
                        />
                    </View>

                    {message && (
                        <Text className={`text-sm text-center ${isError
                            ? 'text-red-500'
                            : isSuccess
                                ? 'text-green-500'
                                : 'text-gray-600'
                            }`}>
                            {message}
                        </Text>
                    )}

                    <SubmitButton
                        onPress={handleSubmit}
                        size="base"
                        className="w-full rounded-[16px]"
                        disabled={isSubmitting || otp.length !== 6}
                        isLoading={isSubmitting}
                    >
                        <Text>
                            {isSubmitting ? 'Verifying...' : 'Verify & Complete Signup'}
                        </Text>
                    </SubmitButton>

                    <View className="flex flex-col gap-4">
                        <TouchableOpacity
                            onPress={handleResend}
                            disabled={resendDisabled || isResending}
                            className={`flex flex-row items-center justify-start gap-2 ${resendDisabled || isResending
                                ? 'opacity-50'
                                : ''
                                }`}
                        >
                            <Text className={`text-sm font-medium ${resendDisabled || isResending
                                ? 'text-gray-400'
                                : 'text-[#66BB6A]'
                                }`}>
                                {isResending ? (
                                    'Resending...'
                                ) : resendDisabled ? (
                                    `Resend Code (${resendCountdown}s)`
                                ) : (
                                    'Resend Code'
                                )}
                            </Text>
                        </TouchableOpacity>

                        <View className="text-center">
                            <Link href="/(auth)/signup" asChild>
                                <TouchableOpacity>
                                    <Text className="text-sm text-gray-500 text-center">
                                        ← Back to Sign Up
                                    </Text>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    </View>
                </View>

                <Text className="text-sm text-gray-500 text-center mt-6">
                    (Remember to check your spam folder if you don't see it.)
                </Text>
            </View>
        </View>
    );
}