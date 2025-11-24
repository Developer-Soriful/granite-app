import { useAuth } from '@/context/AuthContext'
import { AntDesign } from '@expo/vector-icons'
import { router } from 'expo-router'
import React from 'react'
import { Text, TouchableOpacity } from 'react-native'

const Button = () => {
    const { session, logout } = useAuth()

    const handlePress = () => {
        if (session) {
            // If user is logged in, navigate to tabs
            router.replace('/(tabs)')
        } else {
            // If not logged in, navigate to auth
            router.replace('/(auth)')
        }
    }

    const handleLogout = async () => {
        try {
            await logout()
            router.replace('/(app)')
        } catch (error) {
            console.error('Logout failed:', error)
        }
    }

    if (session) {
        return (
            <TouchableOpacity
                onPress={handleLogout}
                style={{
                    backgroundColor: "#e53e3e" // Red color for logout
                }}
                className='text-[14px] flex flex-row justify-center gap-2 text-center px-4 py-3 rounded-[16px] w-full'
            >
                <Text className='text-white'>
                    Logout
                </Text>
                <AntDesign name="logout" size={20} color="white" />
            </TouchableOpacity>
        )
    }

    return (
        <TouchableOpacity
            onPress={handlePress}
            style={{
                backgroundColor: "#338059"
            }}
            className='text-[14px] flex flex-row justify-center gap-2 text-center px-4 py-3 rounded-[16px] w-full'
        >
            <Text className='text-white'>
                Get Started Now
            </Text>
            <AntDesign name="arrow-right" size={20} color="white" />
        </TouchableOpacity>
    )
}

export default Button