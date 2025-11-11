import { router } from 'expo-router'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

const Contact = () => {
    const handleYoutube = () => {
        router.push('https://www.youtube.com/@GraniteFinance')
    }
    return (
        <View className='flex flex-col gap-[48px]'>
            <View className='flex flex-col justify-center items-center gap-[32px]'>
                <View className='flex flex-col justify-center items-center'>
                    <Text className='text-[12px] font-semibold text-[#434d48]'>CONTACT</Text>
                    <View className='flex flex-col justify-center items-center'>
                        <Text className='text-[#434d48] text-sm'>hi@granitefinance.io</Text>
                        <TouchableOpacity onPress={handleYoutube}>
                            <Text className='text-sm text-[#434d48]'>YouTube</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View className='flex flex-col justify-center items-center'>
                    <Text className='text-[12px] font-semibold text-[#434d48]'>Legal</Text>
                    <View className='flex flex-col justify-center items-center'>
                        <Text className='text-[#434d48] text-sm'>Privacy Policy</Text>
                        <TouchableOpacity onPress={handleYoutube}>
                            <Text className='text-sm text-[#434d48]'>Contact</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View className='p-4 flex justify-center items-center border-t border-[#919a95]'>
                <Text className='text-[#919a95] text-[12px]'>© 2025 Granite Finance. All rights reserved.</Text>
            </View>
        </View>
    )
}

export default Contact