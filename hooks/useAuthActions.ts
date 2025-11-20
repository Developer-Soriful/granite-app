import supabase from '../config/supabase.config';

// --- ADDED OTP VERIFICATION FUNCTIONALITY ---
/**
 * Verifies the OTP (token) sent to the user's email or phone.
 */
export async function verifyOtp({ email, token, type }: { email: string; token: string; type: 'email' | 'phone' }) {
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
export async function resendOtp({ email, type }: { email: string; type: 'signup' | 'invite' | 'magiclink' | 'forgotten_password' | 'email_change' }) {
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

export async function signInWithOAuth(provider: 'google' | 'apple') {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
            redirectTo: 'granite://auth/callback',
            skipBrowserRedirect: false,
        },
    });

    if (error) {
        console.error(`OAuth Sign-in Error with ${provider}:`, error.message);
        throw new Error(error.message);
    }
}

export async function signOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error('Sign-out Error:', error.message);
        throw new Error(error.message);
    }
}