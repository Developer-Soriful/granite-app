import supabase from "@/config/supabase.config";
import { EmailOtpType } from '@supabase/supabase-js';
import * as WebBrowser from 'expo-web-browser';

/**
 * Verifies the OTP (token) sent to the user's email or phone.
 */
export async function verifyOtp({ email, token, type }: { email: string; token: string; type: EmailOtpType }) {
    const { data, error } = await supabase.auth.verifyOtp({
        email: email,
        token: token,
        type: type, // Should be 'email' for email OTP
    });

    if (error) {
        console.error('Verify OTP Error:', error.message);
        throw new Error(error.message);
    }
    // If successful, data.session and data.user are returned, automatically logging in the user.
    return { success: true, data };
}

/**
 * Resends the OTP/confirmation link for various authentication events.
 */
type ResendOtpType = 'signup' | 'email_change';

export async function resendOtp({ email, type }: { email: string; type: ResendOtpType }) {
    const { error } = await supabase.auth.resend({
        email: email,
        type: type,
    });

    if (error) {
        console.error('Resend OTP Error:', error.message);
        throw new Error(error.message);
    }
    return { success: true, message: 'Verification code resent successfully.' };
}
// ---------------------------------------------


// --- NEW SIGN UP FUNCTIONALITY ---
// In hooks/useAuthActions.ts
export async function signUp(email: string, password: string) {
    try {
        // First sign out any existing session
        await supabase.auth.signOut();

        // Sign up with email confirmation
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                emailRedirectTo: 'granite://auth/verify',  // Make sure this matches your app's scheme
                data: {
                    email_confirm: true
                }
            }
        });

        if (error) throw error;
        return { user: data.user, session: data.session };
    } catch (error: any) {
        console.error('Sign-up Error:', error.message);
        throw error;
    }
}
// ---------------------------------

export async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        console.error('Sign in error:', error.message);
        throw new Error(error.message);
    }

    return { success: true, session: data.session };
}

export async function signInWithOAuth(provider: 'google' | 'apple') {
    try {
        const isDev = __DEV__;
        const redirectTo = isDev
            ? 'exp://https://www.granitefinance.io/auth-callback' 
            : 'granite://auth/callback';

        console.log('Starting OAuth for:', provider);
        console.log('Redirect URL:', redirectTo);

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo,
                skipBrowserRedirect: false, 
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
            },
        });

        if (error) throw error;

        // If we have a URL, it means we need to handle the redirect manually
        if (data?.url) {
            // This will open the URL in the system browser
            // The browser will redirect back to the app after auth
            await WebBrowser.openAuthSessionAsync(
                data.url,
                redirectTo
            );
        }

        return { success: true };
    } catch (error: any) {
        console.error(`OAuth Error (${provider}):`, error.message);
        throw error;
    }
}

export async function signOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error('Sign-out Error:', error.message);
        throw new Error(error.message);
    }
}