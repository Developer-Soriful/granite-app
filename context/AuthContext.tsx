import { Session } from '@supabase/supabase-js';
import * as SplashScreen from 'expo-splash-screen';
import React, { createContext, useContext, useEffect, useState } from 'react';
import supabase from '../config/supabase.config';

interface AuthContextType {
    session: Session | null;
    isLoading: boolean;
    logout: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

    const logout = async () => {
        console.log("Attempting Supabase sign out...");
        try {
            // Sign out from Supabase
            const { error } = await supabase.auth.signOut();
            
            // Clear the session state regardless of the Supabase response
            setSession(null);

            if (error) {
                console.error('Logout Error:', error);
                throw error;
            }

            console.log("Supabase sign out successful!");

            // Force clear any cached session data
            await supabase.auth.getSession().then(({ data: { session } }) => {
                if (!session) {
                    console.log('Session cleared successfully');
                }
            });

            return true;
        } catch (error) {
            console.error('Logout failed:', error);
            // Even if Supabase logout fails, we should still clear the local session
            setSession(null);
            throw error;
        }
    };

    useEffect(() => {
        let isMounted = true;
        let authListener: { data: { subscription: { unsubscribe: () => void } } } | null = null;

        const initializeAuth = async () => {
            try {
                // First, check for existing session
                const { data: { session } } = await supabase.auth.getSession();
                
                if (!isMounted) return;

                // Update session state
                setSession(session);
                
                // Set up auth state listener for future changes
                authListener = supabase.auth.onAuthStateChange((event, session) => {
                    if (!isMounted) return;
                    console.log('Auth state changed:', event, session ? 'Session exists' : 'No session');
                    
                    // Update session state
                    setSession(session);
                });

            } catch (error) {
                console.error('Auth initialization error:', error);
                // On error, ensure we're not stuck in loading state
                if (isMounted) {
                    setSession(null);
                }
            } finally {
                // Always set loading to false after a short delay
                const timer = setTimeout(() => {
                    if (isMounted) {
                        setIsLoading(false);
                        SplashScreen.hideAsync().catch(console.warn);
                    }
                }, 300); // Reduced delay for better UX

                // No need to return cleanup here, it's handled in the main effect cleanup
            }
        };

        // Prevent auto-hiding until we're ready
        SplashScreen.preventAutoHideAsync();
        
        // Store the timer ID for cleanup
        let timer: NodeJS.Timeout | null = null;
        
        // Initialize auth and store the cleanup function
        const cleanupTimer = initializeAuth();
        
        return () => {
            isMounted = false;
            // Clean up the auth listener
            if (authListener?.data?.subscription?.unsubscribe) {
                authListener.data.subscription.unsubscribe();
            }
            // Clean up any pending timeouts
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, []);
    return (
        <AuthContext.Provider value={{ session, isLoading, logout }}>
            {children}
        </AuthContext.Provider>
    );
}