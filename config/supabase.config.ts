// config/supabase.config.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import 'react-native-url-polyfill/auto';

export const SUPABASE_URL = 'https://qzbkohynvszmnmybnhiw.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6YmtvaHludnN6bW5teWJuaGl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzOTQwNzUsImV4cCI6MjA1OTk3MDA3NX0.r1_wWKwFO8xaj-3bVnneLaHeHJLH55WHZCIBAiZGIUk';

const openBrowser = async (url: string) => {
    console.log('Supabase OAuth: Attempting to open browser with URL:', url);
    try {
        // Use the app's custom URL scheme for redirects
        const redirectUrl = Linking.createURL('auth/callback');
        const result = await WebBrowser.openAuthSessionAsync(
            url,
            redirectUrl,
            {
                showInRecents: true,
                preferEphemeralSession: false,
            }
        );

        console.log('OAuth result:', result.type);

        if (result.type === 'success' && result.url) {
            // Parse the URL to extract the access token
            const url = new URL(result.url);
            const params = new URLSearchParams(url.hash.substring(1));

            // Return the full URL with the access token
            return result.url;
        }

        return null;
    } catch (e) {
        console.error('Error in OAuth flow:', e);
        return null;
    }
};


const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        storage: AsyncStorage as any,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
        flowType: openBrowser as any,
    },
});

export default supabase;