// config/supabase.config.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
// config/supabase.config.ts

import 'react-native-url-polyfill/auto';

export const SUPABASE_URL = 'https://qzbkohynvszmnmybnhiw.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6YmtvaHludnN6bW5teWJuaGl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzOTQwNzUsImV4cCI6MjA1OTk3MDA3NX0.r1_wWKwFO8xaj-3bVnneLaHeHJLH55WHZCIBAiZGIUk';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        storage: AsyncStorage as any,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});

export default supabase;