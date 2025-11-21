import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session } from '@supabase/supabase-js';
import { router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { createContext, useContext, useEffect, useState } from 'react';
import supabase from '../config/supabase.config';

interface AuthContextType {
    session: Session | null;
    isLoading: boolean;
    logout: () => Promise<boolean>;
    hasCompletedPaywall: boolean | null;
    completePaywall: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const PAYWALL_KEY = '@paywall_completed';

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasCompletedPaywall, setHasCompletedPaywall] = useState<boolean | null>(null);

    // Load paywall status from AsyncStorage on mount
    useEffect(() => {
        const loadPaywallStatus = async () => {
            try {
                const value = await AsyncStorage.getItem(PAYWALL_KEY);
                if (value !== null) {
                    setHasCompletedPaywall(value === 'true');
                } else {
                    setHasCompletedPaywall(false);
                }
            } catch (error) {
                console.error('Error loading paywall status:', error);
                setHasCompletedPaywall(false);
            }
        };
        loadPaywallStatus();
    }, []);

    // Complete the paywall and save to AsyncStorage
    const completePaywall = async () => {
        try {
            await AsyncStorage.setItem(PAYWALL_KEY, 'true');
            setHasCompletedPaywall(true);
        } catch (error) {
            console.error('Error saving paywall status:', error);
            throw error;
        }
    };

    const logout = async () => {
        console.log("Attempting Supabase sign out...");
        try {
            const { error } = await supabase.auth.signOut();
            setSession(null);

            if (error) {
                console.error('Logout Error:', error);
                throw error;
            }

            console.log("Supabase sign out successful!");
            router.replace('/(auth)');
            return true;
        } catch (error) {
            console.error('Logout failed:', error);
            setSession(null);
            throw error;
        }
    };

    useEffect(() => {
        let isMounted = true;
        let authListener: { data: { subscription: { unsubscribe: () => void } } } | null = null;
        let timer: NodeJS.Timeout | null = null;

        const initializeAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();

                if (!isMounted) return;

                setSession(session);

                authListener = supabase.auth.onAuthStateChange((event, session) => {
                    if (!isMounted) return;
                    console.log('Auth state changed:', event, session ? 'Session exists' : 'No session');
                    setSession(session);
                });

            } catch (error) {
                console.error('Auth initialization error:', error);
                if (isMounted) {
                    setSession(null);
                }
            } finally {
                timer = setTimeout(() => {
                    if (isMounted) {
                        setIsLoading(false);
                        SplashScreen.hideAsync().catch(console.warn);
                    }
                }, 300);
            }
        };

        SplashScreen.preventAutoHideAsync();
        initializeAuth();

        return () => {
            isMounted = false;
            if (authListener?.data?.subscription?.unsubscribe) {
                authListener.data.subscription.unsubscribe();
            }
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, []);

    return (
        <AuthContext.Provider value={{ session, isLoading, logout, hasCompletedPaywall, completePaywall }}>
            {children}
        </AuthContext.Provider>
    );
}