import { useAuth } from '@/context/AuthContext'
import { AntDesign } from '@expo/vector-icons'
import { router } from 'expo-router'
import React from 'react'
import { Text, TouchableOpacity } from 'react-native'

const Button = () => {
    const { session, hasCompletedPaywall } = useAuth()

    const handlePress = () => {
        if (session) {
            // If user is logged in
            if (hasCompletedPaywall) {
                // If paywall completed, go to tabs
                router.replace('/(tabs)')
            } else {
                // If paywall NOT completed, go to paywall
                router.push('/paywall')
            }
        } else {
            // If not logged in, navigate to auth
            router.push('/(auth)')
        }
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