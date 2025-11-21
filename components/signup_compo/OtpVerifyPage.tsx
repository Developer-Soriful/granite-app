import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { resendOtp, verifyOtp } from '../../hooks/useAuthActions';
import SubmitButton from '../settings/SubmitButton';

export default function OtpVerifyPage() {
    const router = useRouter();
    const params = useLocalSearchParams();

    // Get email from params, redirect if not provided
    const userEmail = params.email as string;
    if (!userEmail) {
        router.replace('/(auth)/signup');
        return null;
    }

    const initialMessage = 'We\'ve sent a 6-digit verification code to your email address.';

    const [otp, setOtp] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [resendDisabled, setResendDisabled] = useState(true);
    const [resendCountdown, setResendCountdown] = useState(60);
    const [isResending, setIsResending] = useState(false);
    const [localMessage, setLocalMessage] = useState(initialMessage);

    const isError = localMessage && (
        localMessage.toLowerCase().includes('error') ||
        localMessage.toLowerCase().includes('invalid') ||
        localMessage.toLowerCase().includes('expired') ||
        localMessage.toLowerCase().includes('failed')
    );

    const isSuccess = localMessage && (
        localMessage.toLowerCase().includes('sent') ||
        localMessage.toLowerCase().includes('success') ||
        localMessage.toLowerCase().includes('check your email')
    );

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

    const handleOtpComplete = (text: string) => {
        setOtp(text);
        if (text.length === 6) {
            handleSubmit(text);
        }
    };

    const handleSubmit = async (code?: string) => {
        const verificationCode = code || otp;
        if (!verificationCode || verificationCode.length !== 6) {
            setLocalMessage('Please enter a valid 6-digit code');
            return;
        }

        setIsSubmitting(true);
        setLocalMessage('Verifying...');

        try {
            const result = await verifyOtp({
                email: userEmail,
                token: verificationCode,
                type: 'signup'
            });

            if (result.success) {
                router.replace('/(auth)/welcome');
            }
        } catch (error: any) {
            setLocalMessage(error.message || 'Verification failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResend = async () => {
        if (resendDisabled || isResending) return;

        setIsResending(true);
        setResendDisabled(true);
        setResendCountdown(60);
        setLocalMessage('Sending new code...');

        try {
            await resendOtp({
                email: userEmail,
                type: 'signup'
            });
            setLocalMessage('New verification code sent! Please check your email.');
        } catch (error: any) {
            setLocalMessage(error.message || 'Failed to resend code. Please try again.');
            setResendDisabled(false);
            setResendCountdown(0);
        } finally {
            setIsResending(false);
        }
    };

    return (
        <View className="flex-1 bg-white p-6">
            <TouchableOpacity
                onPress={() => router.push('/(auth)/signup')}
                className="mb-6"
            >
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>

            <View className="flex-1 justify-center">
                <Text className="text-2xl font-bold text-center mb-2">
                    Verify Your Email
                </Text>
                <Text className="text-gray-600 text-center mb-8">
                    We've sent a verification code to {userEmail}
                </Text>

                <View className="mb-6">
                    <Text className="text-sm text-gray-600 mb-3 text-center">
                        Enter 6-digit code
                    </Text>
                    <View className="flex-row justify-center">
                        {[0, 1, 2, 3, 4, 5].map((index) => (
                            <View
                                key={index}
                                className="w-12 h-12 border border-gray-300 rounded-lg mx-1 items-center justify-center"
                            >
                                <Text className="text-xl">
                                    {otp[index] || ''}
                                </Text>
                            </View>
                        ))}
                    </View>
                    <TextInput
                        className="absolute opacity-0 w-full h-12"
                        value={otp}
                        onChangeText={handleOtpComplete}
                        keyboardType="number-pad"
                        maxLength={6}
                        autoFocus
                    />
                </View>

                {localMessage ? (
                    <Text
                        className={`text-center mb-6 ${isError ? 'text-red-500' :
                            isSuccess ? 'text-green-500' :
                                'text-gray-600'
                            }`}
                    >
                        {localMessage}
                    </Text>
                ) : null}

                <SubmitButton
                    onPress={() => handleSubmit()}
                    disabled={isSubmitting || otp.length !== 6}
                    className="mb-4"
                >
                    {isSubmitting ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        'Verify Email'
                    )}
                </SubmitButton>

                <View className="items-center">
                    <Text className="text-gray-600 mb-2">
                        Didn't receive a code?
                    </Text>
                    <TouchableOpacity
                        onPress={handleResend}
                        disabled={resendDisabled}
                    >
                        <Text
                            className={`font-medium ${resendDisabled ? 'text-gray-400' : 'text-[#338059]'
                                }`}
                        >
                            {resendDisabled
                                ? `Resend code in ${resendCountdown}s`
                                : 'Resend code'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}