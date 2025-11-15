// hooks/useBackHandler.ts
import { usePathname, useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Alert, BackHandler } from 'react-native';

export const useBackHandler = () => {
    const router = useRouter();
    const pathname = usePathname();
    const backPressCount = useRef(0);

    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            () => {
                // Define routes where you want custom behavior
                const protectedRoutes = ['/payment', '/checkout', '/important-form'];
                const isProtectedRoute = protectedRoutes.some(route =>
                    pathname.includes(route)
                );

                if (isProtectedRoute) {
                    Alert.alert(
                        'Confirm Exit',
                        'Are you sure you want to go back? Your changes may not be saved.',
                        [
                            { text: 'Cancel', style: 'cancel' },
                            { text: 'Yes', onPress: () => router.back() }
                        ]
                    );
                    return true;
                }

                // Default behavior for other routes
                if (router.canGoBack()) {
                    router.back();
                    return true;
                } else {
                    // Double tap to exit functionality
                    if (backPressCount.current === 0) {
                        backPressCount.current += 1;
                        // Show toast message
                        // Toast.show('Press back again to exit');
                        setTimeout(() => {
                            backPressCount.current = 0;
                        }, 2000);
                        return true;
                    } else {
                        BackHandler.exitApp();
                        return true;
                    }
                }
            }
        );

        return () => backHandler.remove();
    }, [router, pathname]);
};