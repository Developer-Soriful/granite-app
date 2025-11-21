import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

export default function AuthCallback() {
  const router = useRouter();
  const { session, isLoading } = useAuth();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Wait for the session to be loaded
        if (!isLoading) {
          // If we have a session, redirect to the home screen
          if (session) {
            router.replace('/(tabs)');
          } else {
            // If no session after callback, redirect to sign-in
            router.replace('/(auth)/signup');
          }
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        router.replace('/(auth)/signup');
      }
    };

    handleAuthCallback();
  }, [session, isLoading]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
      <Text style={{ marginTop: 10 }}>Completing sign in...</Text>
    </View>
  );
}
