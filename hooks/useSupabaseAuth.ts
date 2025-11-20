import { useEffect } from 'react';
import supabase from '../config/supabase.config';

export function useSupabaseAuthListener() {
    useEffect(() => {
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            if (session && event === 'SIGNED_IN') {
                console.log('User signed in:', session.user.email);
            }

            if (event === 'SIGNED_OUT') {
                console.log('User signed out.');
            }
        });

        return () => subscription.unsubscribe();
    }, []);
}