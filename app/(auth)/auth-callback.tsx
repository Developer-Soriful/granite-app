import { supabase } from '@/config/supabase.config';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Text, View } from 'react-native';

// This is needed for the OAuth flow to work properly
WebBrowser.maybeCompleteAuthSession();

export default function AuthCallback() {
    const router = useRouter();
    const [status, setStatus] = useState('Processing login...');

    useEffect(() => {
        const handleAuthCallback = async () => {
            try {
                setStatus('Checking authentication status...');

                // Wait for any URL-based session to be processed
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();

                if (sessionError) {
                    console.error('Session error:', sessionError);
                    throw sessionError;
                }

                if (session) {
                    console.log('✅ OAuth Success - User authenticated');
                    setStatus('Login successful! Redirecting...');
                    // Small delay to show success message
                    setTimeout(() => {
                        router.replace('/(tabs)');
                    }, 1000);
                } else {
                    console.log('⚠️ No active session found');
                    // Try to get the user from the URL
                    const { data: { user }, error: userError } = await supabase.auth.getUser();

                    if (userError || !user) {
                        throw new Error('No active session found');
                    }

                    // If we have a user but no session, refresh the session
                    const { data: { session: newSession }, error: refreshError } = await supabase.auth.refreshSession();

                    if (refreshError || !newSession) {
                        throw new Error('Failed to refresh session');
                    }

                    console.log('✅ Session refreshed successfully');
                    setStatus('Login successful! Redirecting...');
                    router.replace('/(tabs)');
                }
            } catch (error) {
                console.error('❌ Auth callback error:', error);
                Alert.alert(
                    'Authentication Error',
                    'Failed to complete login. Please try again.',
                    [
                        {
                            text: 'OK',
                            onPress: () => router.replace('/(auth)'),
                        },
                    ]
                );
            }
        };

        handleAuthCallback();
    }, []);

    return (
        <View className="flex-1 justify-center items-center bg-white px-6">
            <ActivityIndicator size="large" color="#338059" />
            <Text className="mt-6 text-lg text-center text-gray-800">
                {status}
            </Text>
            <Text className="mt-4 text-sm text-gray-500 text-center">
                Please wait while we complete your login...
            </Text>
        </View>
    );
}