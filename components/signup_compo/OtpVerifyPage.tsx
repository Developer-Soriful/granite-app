import OtpInput from '@/components/OtpInput';
import { Ionicons } from '@expo/vector-icons';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { resendOtp, verifyOtp } from '../../hooks/useAuthActions';
import SubmitButton from '../settings/SubmitButton';

// Placeholder for email. Ensure the actual email is passed via params.
const FALLBACK_EMAIL = 'user@example.com';

export default function OtpVerifyPage() {
    const params = useLocalSearchParams();
    const router = useRouter();

    // Attempt to get email from params or use fallback
    const userEmail = (params.email as string) || FALLBACK_EMAIL;
    const initialMessage = params.message as string;

    const [otp, setOtp] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [resendDisabled, setResendDisabled] = useState(true);
    const [resendCountdown, setResendCountdown] = useState(60);
    const [isResending, setIsResending] = useState(false);
    const [localMessage, setLocalMessage] = useState(initialMessage || 'We\'ve sent a 6-digit verification code to your email address.');

    const isError =
        localMessage &&
        (localMessage.toLowerCase().includes('error') ||
            localMessage.toLowerCase().includes('invalid') ||
            localMessage.toLowerCase().includes('expired') ||
            localMessage.toLowerCase().includes('failed'));

    const isSuccess =
        localMessage &&
        (localMessage.toLowerCase().includes('sent') ||
            localMessage.toLowerCase().includes('check your email'));

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
        setLocalMessage('');

        try {
            // Supabase OTP VERIFICATION
            const result = await verifyOtp({ email: userEmail, token: otp, type: 'email' });

            if (result.success) {
                // Verification successful, session started. Redirect to main app.
                router.replace('/(tabs)');
            } else {
                setLocalMessage('Verification failed. Check code or resend.');
            }
        } catch (error: any) {
            console.error('Error verifying OTP:', error);
            setLocalMessage(error.message || 'Verification failed. Check code or resend.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResend = async () => {
        if (resendDisabled || isResending) return;

        setIsResending(true);
        setResendDisabled(true);
        setResendCountdown(60);
        setLocalMessage('');

        try {
            // Supabase RESEND OTP
            const result = await resendOtp({ email: userEmail, type: 'signup' });

            if (result.success) {
                setLocalMessage('Verification code sent! Please check your email.');
            } else {
                setLocalMessage('Failed to resend code.');
            }
        } catch (error: any) {
            console.error('Error resending OTP:', error);
            setLocalMessage(error.message || 'Failed to resend code. Please try again.');
            setResendDisabled(false);
            setResendCountdown(0);
        } finally {
            setIsResending(false);
        }
    };

    return (
        <View className="flex-1 bg-white">
            {/* Navigation Back Button */}
            <View className='px-6 pt-6'>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color="black" />
                </TouchableOpacity>
            </View>

            <View className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg">
                <Text className="text-2xl font-bold text-gray-800 text-center mb-4">
                    Check Your Email
                </Text>
                <Text className="text-gray-600 text-center mb-6">
                    We've sent a 6-digit verification code to **{userEmail}**.
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

                    {localMessage && (
                        <Text className={`text-sm text-center ${isError
                            ? 'text-red-500'
                            : isSuccess
                                ? 'text-green-500'
                                : 'text-gray-600'
                            }`}>
                            {localMessage}
                        </Text>
                    )}

                    <SubmitButton
                        onPress={handleSubmit}
                        size="base"
                        className="w-full rounded-[16px]"
                        disabled={isSubmitting || otp.length !== 6}
                        isLoading={isSubmitting}
                    >
                        <Text className='text-white'>
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
                                {isResending
                                    ? 'Resending...'
                                    : resendDisabled
                                        ? `Resend Code (${resendCountdown}s)`
                                        : 'Resend Code'
                                }
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