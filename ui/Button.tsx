import { AntDesign } from '@expo/vector-icons'
import { router } from 'expo-router'
import React from 'react'
import { Text, TouchableOpacity } from 'react-native'

const Button = () => {
    const goToTabs = () => {
        router.replace('/(auth)/paywall')
    }
    return (
        <TouchableOpacity onPress={goToTabs} style={{
            backgroundColor: "#338059"
        }} className='text-[14px] flex flex-row justify-center gap-2 text-center px-4 py-3 rounded-[16px] w-full'>
            <Text className='text-white'>
                Get Started Now
            </Text>
            <AntDesign name="arrow-right" size={20} color="white" />
        </TouchableOpacity>
    )
}

export default Button