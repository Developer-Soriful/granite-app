import supabase from "@/config/supabase.config";
import { EmailOtpType } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';
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
        await WebBrowser.warmUpAsync();

        // Create a deep link that will be used after OAuth completes
        const redirectUrl = Linking.createURL('auth-callback');

        console.log('Starting OAuth flow for:', provider);
        console.log('Redirect URL:', redirectUrl);

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: provider,
            options: {
                redirectTo: redirectUrl,
                skipBrowserRedirect: false,
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
            },
        });

        if (error) throw error;
        if (!data?.url) throw new Error('No URL returned from OAuth provider');

        console.log('Opening browser for OAuth flow...');

        // Open the OAuth URL in the in-app browser
        const result = await WebBrowser.openAuthSessionAsync(
            data.url,
            redirectUrl,
            {
                showInRecents: true,
                preferEphemeralSession: false,
            }
        );

        // Handle the result from the in-app browser
        if (result.type === 'success' && 'url' in result && result.url) {
            const url = result.url;
            const params = new URLSearchParams(url.split('#')[1] || url.split('?')[1] || '');
            const accessToken = params.get('access_token');
            const refreshToken = params.get('refresh_token');

            if (accessToken && refreshToken) {
                // Set the session with the new tokens
                const { data: sessionData, error: sessionError } =
                    await supabase.auth.setSession({
                        access_token: accessToken,
                        refresh_token: refreshToken,
                    });

                if (sessionError) throw sessionError;
                return { session: sessionData.session, user: sessionData.user };
            }
        }

        throw new Error('Authentication failed or was cancelled');
    } catch (error) {
        console.error(`OAuth Error with ${provider}:`, error);
        throw error;
    } finally {
        await WebBrowser.coolDownAsync();
    }
}

export async function signOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error('Sign-out Error:', error.message);
        throw new Error(error.message);
    }
}