// config/supabase.config.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import * as WebBrowser from 'expo-web-browser';
import 'react-native-url-polyfill/auto';

export const SUPABASE_URL = 'https://qzbkohynvszmnmybnhiw.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6YmtvaHludnN6bW5teWJuaGl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzOTQwNzUsImV4cCI6MjA1OTk3MDA3NX0.r1_wWKwFO8xaj-3bVnneLaHeHJLH55WHZCIBAiZGIUk';

const openBrowser = async (url: string) => {
    console.log('Supabase OAuth: Attempting to open browser with URL:', url)
    try {
        const result = await WebBrowser.openAuthSessionAsync(url, SUPABASE_URL);

        if (result.type === 'success' && result.url) {
            return result.url;
        }

        return null;
    } catch (e) {
        console.error('Error opening web browser:', e);
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