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
    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        console.error('Sign-in Error:', error.message);
        throw new Error(error.message);
    }
}

export async function signInWithOAuth(provider: 'google' | 'apple') {
    try {
        // Warm up the browser
        await WebBrowser.warmUpAsync();

        // Get the redirect URL for the auth callback
        // This must match the scheme defined in app.json (granite://) or exp:// for Expo Go
        const redirectUrl = Linking.createURL('auth-callback');

        console.log('Starting OAuth flow for:', provider);
        console.log('Redirect URL:', redirectUrl);

        // Start the OAuth flow
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: provider,
            options: {
                redirectTo: redirectUrl,
                skipBrowserRedirect: true,
            },
        });

        if (error) {
            console.error('OAuth initialization error:', error);
            throw error;
        }

        if (!data?.url) {
            throw new Error('No authentication URL returned');
        }

        console.log('Opening browser for OAuth flow...');

        // Open the OAuth URL in the browser
        const result = await WebBrowser.openAuthSessionAsync(
            data.url,
            redirectUrl,
            {
                showInRecents: true,
                // preferEphemeralSession: true, // Try true for iOS if false fails, but false is usually better for persistent auth
            }
        );

        // Cool down the browser
        await WebBrowser.coolDownAsync();

        console.log('OAuth result type:', result.type);

        if (result.type === 'success' && result.url) {
            // Parse the URL to extract the access token
            // The URL will look like: granite://auth/callback#access_token=...&refresh_token=...&...

            const urlStr = result.url;
            console.log('Redirect URL received:', urlStr);

            // Extract the hash part or query part
            const hashIndex = urlStr.indexOf('#');
            const queryIndex = urlStr.indexOf('?');

            let paramsStr = '';
            if (hashIndex !== -1) {
                paramsStr = urlStr.substring(hashIndex + 1);
            } else if (queryIndex !== -1) {
                paramsStr = urlStr.substring(queryIndex + 1);
            }

            if (!paramsStr) {
                console.error('No parameters found in redirect URL');
                throw new Error('Authentication failed: No tokens found');
            }

            // Parse parameters
            const params = new URLSearchParams(paramsStr);
            const accessToken = params.get('access_token');
            const refreshToken = params.get('refresh_token');

            if (accessToken && refreshToken) {
                console.log('Tokens found, setting session...');
                const { error: sessionError } = await supabase.auth.setSession({
                    access_token: accessToken,
                    refresh_token: refreshToken,
                });

                if (sessionError) {
                    console.error('Error setting session:', sessionError);
                    throw sessionError;
                }

            } else {
                console.error('Missing tokens in redirect URL');
                throw new Error('Authentication failed: Missing tokens');
            }
        }

        // Handle cancellation
        if (result.type === 'cancel' || result.type === 'dismiss') {
            throw new Error('Authentication was cancelled');
        }

        // Handle other failures
        console.error('OAuth flow did not complete successfully:', result.type);
        throw new Error('Authentication failed or was cancelled');

    } catch (error) {
        console.error(`OAuth Sign-in Error with ${provider}:`, error);
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