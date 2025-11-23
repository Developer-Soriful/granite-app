// In app/auth-callback.tsx
import supabase from '@/config/supabase.config';
import { useAuth } from '@/context/AuthContext';
import { useURL } from 'expo-linking';
import { useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

export default function AuthCallback() {
  const router = useRouter();
  const segments = useSegments();
  const { session, isLoading } = useAuth();
  const url = useURL();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // If we have a valid session, redirect to tabs
        if (session) {
          console.log('AuthCallback: Session exists, redirecting to /(tabs)');
          router.replace('/(tabs)');
          return;
        }

        // If we have URL parameters, try to extract tokens
        if (url) {
          console.log('AuthCallback: Processing URL:', url);

          // Handle both hash and query parameters
          const params = new URLSearchParams(
            url.includes('#')
              ? url.split('#')[1]
              : url.includes('?')
                ? url.split('?')[1]
                : ''
          );

          const accessToken = params.get('access_token');
          const refreshToken = params.get('refresh_token');
          const error = params.get('error');

          if (error) {
            console.error('OAuth error:', error);
            router.replace('/(auth)');
            return;
          }

          if (accessToken && refreshToken) {
            console.log('AuthCallback: Found tokens in URL, setting session...');
            const { error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (!sessionError) {
              console.log('AuthCallback: Session set successfully, redirecting to /(tabs)');
              router.replace('/(tabs)');
              return;
            } else {
              console.error('Error setting session:', sessionError);
            }
          }
        }

        // If we get here, something went wrong
        console.log('AuthCallback: No valid session or tokens found, redirecting to /(auth)');
        router.replace('/(auth)');
      } catch (error) {
        console.error('AuthCallback error:', error);
        router.replace('/(auth)');
      }
    };

    handleAuth();
  }, [session, isLoading, url]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
      <Text>Loading your session...</Text>
    </View>
  );
}