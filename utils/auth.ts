// utils/auth.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_TOKEN_KEY = 'authToken';

export const getAuthToken = async (): Promise<string | null> => {
    try {
        return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    } catch (error) {
        console.error('Error getting auth token:', error);
        return null;
    }
};

export const saveAuthToken = async (token: string): Promise<void> => {
    try {
        await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
    } catch (error) {
        console.error('Error saving auth token:', error);
        throw error;
    }
};

export const removeAuthToken = async (): Promise<void> => {
    try {
        await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    } catch (error) {
        console.error('Error removing auth token:', error);
        throw error;
    }
};

export const isAuthenticated = async (): Promise<boolean> => {
    const token = await getAuthToken();
    return !!token;
};