// config/supabase.config.ts ← EI FILE PURA REPLACE KOR
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

export const SUPABASE_URL = 'https://qzbkohynvszmnmybnhiw.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6YmtvaHludnN6bW5teWJuaGl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzOTQwNzUsImV4cCI6MjA1OTk3MDA3NX0.r1_wWKwFO8xaj-3bVnneLaHeHJLH55WHZCIBAiZGIUk';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
        debug: false,
    },
});

export default supabase;