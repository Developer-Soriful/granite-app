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
        type: type,
    });

    if (error) {
        console.error('Verify OTP Error:', error.message);
        throw new Error(error.message);
    }
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

/**
 * Sign up a new user
 */
export async function signUp(email: string, password: string) {
    try {
        await supabase.auth.signOut();

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: process.env.EXPO_PUBLIC_EMAIL_REDIRECT_URL || 'granite://auth/verify',
                data: { email_confirm: true }
            }
        });

        if (error) throw error;
        return { user: data.user, session: data.session };
    } catch (error: any) {
        console.error('Sign-up Error:', error.message);
        return {
            user: null,
            session: null,
            error: new Error('Failed to create account. Please try again.')
        };
    }
}

/**
 * Sign in with email and password
 * Supabase automatically manages the session - no need to manually save tokens
 */
export async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        console.error('Sign in error:', error.message);
        throw new Error(error.message);
    }

    // Supabase automatically manages the session
    console.log("✅ Sign in successful, session managed by Supabase");

    return { success: true, session: data.session };
}

/**
 * Sign in with OAuth (Google or Apple)
 */
export async function signInWithOAuth(provider: 'google' | 'apple') {
    try {
        const isDev = __DEV__;
        const redirectTo = isDev
            ? `exp://${process.env.EXPO_PUBLIC_API_URL}/auth-callback`
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

        if (data?.url) {
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

/**
 * Sign out the current user
 */
export async function signOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error('Sign-out Error:', error.message);
        throw new Error(error.message);
    }
}