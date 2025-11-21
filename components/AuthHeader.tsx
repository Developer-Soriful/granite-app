import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import React from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';

interface AuthHeaderProps {
    title: string;
    showBackButton?: boolean;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({ title, showBackButton = true }) => {
    const navigation = useNavigation();

    const handleBack = () => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        } else {
            router.back();
        }
    };

    return (
        <SafeAreaView className="bg-white">
            <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
                <View className="flex-row items-center">
                    {showBackButton && (
                        <TouchableOpacity onPress={handleBack} className="p-2 -ml-2">
                            <MaterialIcons name="keyboard-arrow-left" size={24} color="black" />
                        </TouchableOpacity>
                    )}
                    <Text className="text-xl font-bold text-gray-900 ml-2">{title}</Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default AuthHeader;
