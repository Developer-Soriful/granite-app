import supabase from '@/config/supabase.config';
import { useAuth } from '@/context/AuthContext';
import { useURL } from 'expo-linking';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

export default function AuthCallback() {
  const router = useRouter();
  const { session, isLoading } = useAuth();

  const url = useURL();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // 1. If we have a session, redirect to home
        if (!isLoading && session) {
          router.replace('/(tabs)');
          return;
        }

        // 2. If no session, check if we have tokens in the URL (Fallback for when manual handling fails)
        if (!isLoading && !session && url) {
          const hashIndex = url.indexOf('#');
          const queryIndex = url.indexOf('?');
          let paramsStr = '';

          if (hashIndex !== -1) {
            paramsStr = url.substring(hashIndex + 1);
          } else if (queryIndex !== -1) {
            paramsStr = url.substring(queryIndex + 1);
          }

          if (paramsStr) {
            const params = new URLSearchParams(paramsStr);
            const accessToken = params.get('access_token');
            const refreshToken = params.get('refresh_token');

            if (accessToken && refreshToken) {
              const { error } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
              });
              if (!error) {
                router.replace('/(tabs)');
                return;
              }
            }
          }
        }

        // 3. If no session and no tokens (or error), redirect to signup
        if (!isLoading && !session) {
          // Give it a small delay to ensure we didn't miss a session update
          setTimeout(() => {
            if (!session) {
              router.replace('/(auth)/signup');
            }
          }, 1000);
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        router.replace('/(auth)/signup');
      }
    };

    handleAuthCallback();
  }, [session, isLoading, url]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
      <Text style={{ marginTop: 10 }}>Completing sign in...</Text>
    </View>
  );
}
