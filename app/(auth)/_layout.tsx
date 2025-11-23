import { useAuth } from '@/context/AuthContext';
import { Stack, useRouter } from 'expo-router';

export default function AuthLayout() {
    const { session, isLoading } = useAuth();
    const router = useRouter();

    if (isLoading) {
        return null;
    }

    // Show auth screens
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animation: 'fade',
            }}
            screenListeners={{
                state: () => ({
                    // This prevents the back button from going back to the welcome screen after login
                    beforeRemove: (e: any) => {
                        if (session && e.data.action.type === 'GO_BACK') {
                            e.preventDefault();
                            router.replace('/(tabs)');
                        }
                    },
                }),
            }}
        >
            <Stack.Screen name="index" />
            <Stack.Screen name="welcome" />
            <Stack.Screen name="signup" />
            <Stack.Screen name="forget-password" />
            <Stack.Screen name="verify" />
            <Stack.Screen name="resetpass" />
            <Stack.Screen name="verify-reset-password" />
        </Stack>
    );
}