import supabase from "@/config/supabase.config";

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
export async function signUp(email: string, password: string) {
    const { data: user, error } = await supabase.auth.signUp({
        email: email,
        password: password,
    });

    if (error) {
        console.error('Sign-up Error:', error.message);
        throw new Error(error.message);
    }
    return user;
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

import { EmailOtpType } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';

export async function signInWithOAuth(provider: 'google' | 'apple') {
    try {
        // Get the redirect URL for the auth callback
        const redirectUrl = Linking.createURL('auth/callback');
        
        console.log('Starting OAuth flow for:', provider);
        console.log('Redirect URL:', redirectUrl);

        // Start the OAuth flow
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: provider,
            options: {
                redirectTo: redirectUrl,
                skipBrowserRedirect: true, // We'll handle the redirect manually
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
                preferEphemeralSession: false, // Important for iOS to handle redirects properly
            }
        );

        console.log('OAuth result type:', result.type);
        
        // The actual session will be handled by the auth state change listener in AuthContext
        // We just need to handle any errors here
        if (result.type === 'cancel' || result.type === 'dismiss') {
            throw new Error('Authentication was cancelled');
        }
        
        // Handle all possible result types
        if (result.type !== 'success') {
            console.error('OAuth flow did not complete successfully:', result.type);
            throw new Error('Authentication failed or was cancelled');
        }
        
        // If we get here, the authentication was successful
        // The session will be handled by the auth state change listener
        return { success: true };
        
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