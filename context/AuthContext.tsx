// contexts/AuthContext.tsx or app/AuthProvider.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session } from '@supabase/supabase-js';
import * as SplashScreen from 'expo-splash-screen';
import React, { createContext, useContext, useEffect, useState } from 'react';
import supabase from '../config/supabase.config';

SplashScreen.preventAutoHideAsync();

interface AuthContextType {
    session: Session | null;
    isLoading: boolean;
    logout: () => Promise<void>;
    hasCompletedPaywall: boolean;
    completePaywall: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const PAYWALL_KEY = '@paywall_completed';

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasCompletedPaywall, setHasCompletedPaywall] = useState<boolean>(false);

    // Load paywall status
    useEffect(() => {
        AsyncStorage.getItem(PAYWALL_KEY).then(value => {
            setHasCompletedPaywall(value === 'true');
        }).catch(() => setHasCompletedPaywall(false));
    }, []);

    const completePaywall = async () => {
        await AsyncStorage.setItem(PAYWALL_KEY, 'true');
        setHasCompletedPaywall(true);
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setSession(null);
        // Don't navigate here — let layout handle it
    };

    useEffect(() => {
        let mounted = true;
        let unsub: () => void = () => { };

        const init = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (mounted) setSession(session);

            const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
                if (mounted) setSession(session);
            });

            unsub = () => subscription.unsubscribe();

            // Small delay to prevent flashing
            setTimeout(() => {
                if (mounted) {
                    setIsLoading(false);
                    SplashScreen.hideAsync();
                }
            }, 100);
        };

        init();

        return () => {
            mounted = false;
            unsub();
        };
    }, []);

    return (
        <AuthContext.Provider value={{
            session,
            isLoading,
            logout,
            hasCompletedPaywall,
            completePaywall
        }}>
            {children}
        </AuthContext.Provider>
    );
}