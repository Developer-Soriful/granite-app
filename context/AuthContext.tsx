import { Session } from '@supabase/supabase-js';
import * as SplashScreen from 'expo-splash-screen';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react'; // useRef added
import supabase from '../config/supabase.config';

interface AuthContextType {
    session: Session | null;
    isLoading: boolean;
    logout: () => Promise<void>;
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
    const isInitialLoad = useRef(true);

    const logout = async () => {
        console.log("Attempting Supabase sign out...");
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Logout Error:', error);
        } else {
            console.log("Supabase sign out successful!");
        }
    };

    useEffect(() => {
        SplashScreen.preventAutoHideAsync();

        const { data: authListener } = supabase.auth.onAuthStateChange(
            (_event: string, session: Session | null) => {
                setSession(session);

                if (isInitialLoad.current) {
                    setIsLoading(false);
                    isInitialLoad.current = false;
                }

                SplashScreen.hideAsync();
            }
        );

        return () => {
            authListener?.subscription?.unsubscribe();
        };
    }, []);
    return (
        <AuthContext.Provider value={{ session, isLoading, logout }}>
            {children}
        </AuthContext.Provider>
    );
}