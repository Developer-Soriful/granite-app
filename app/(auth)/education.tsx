// src/app/education.tsx
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Dummy hook implementation
const useTrackSignupProgress = (path: string) => {
    // This is a dummy implementation for tracking signup progress
    React.useEffect(() => {
        console.log(`Tracking signup progress for: ${path}`);
        // In a real app, you would track analytics here
    }, [path]);
};

export default function EducationPage() {
    useTrackSignupProgress('/education');
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-gray-50 ">
            <View className='px-4'>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <ScrollView
                className="flex-1 px-4 py-12"
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
            >
                <View style={styles.card}>
                    {/* Header */}
                    <Text className="text-xl md:text-2xl font-bold text-center text-[#2E2E2E]  mb-6">
                        Why budgets fail — and how Granite keeps you on track.
                    </Text>

                    {/* Body Copy - Statistics */}
                    <View className="space-y-5 mb-8">
                        <View className="flex-row items-start">
                            <AntDesign name="questioncircle" size={24} color="#EF4444" className="mr-3 mt-0.5 flex-shrink-0" />
                            <Text className="text-lg text-gray-700 flex-1">
                                <Text className="font-semibold">65% of Americans</Text> don't know how much they spent last month.
                            </Text>
                        </View>

                        <View className="flex-row items-start">
                            <Feather name="trending-down" size={24} color="#F97316" className="mr-3 mt-0.5 flex-shrink-0" />
                            <Text className="text-lg text-gray-700 flex-1">
                                More than <Text className="font-semibold">80% of Americans</Text> say they consistently overspend.
                            </Text>
                        </View>

                        <View className="flex-row items-start">
                            <Feather name="alert-triangle" size={24} color="#CA8A04" className="mr-3 mt-0.5 flex-shrink-0" />
                            <Text className="text-lg text-gray-700 flex-1">
                                <Text className="font-semibold">Money is the number 1 stressor</Text> for Americans, topping work, family, and health.
                            </Text>
                        </View>
                    </View>

                    {/* Granite's Solution - Core Value Prop */}
                    <View className="bg-[#66BB6A]/10  p-4 rounded-2xl border border-[#66BB6A]/30 mb-8">
                        <Text className="text-center text-lg font-medium text-[#66BB6A]">
                            Granite shows you how much you can spend each day, so you end the month with more money than what you started.
                        </Text>
                    </View>

                    {/* CTA Button */}
                    <View className="mb-4">
                        <TouchableOpacity
                            className="w-full px-8 py-4 bg-[#66BB6A] rounded-2xl shadow-lg active:bg-[#66BB6A]/90"
                            onPress={() => router.push('/(app)/paywall')}
                        >
                            <Text className="text-white font-semibold text-lg text-center">
                                Take control of your budget
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Supporting footnote */}
                    <Text className="text-center text-sm italic text-gray-500">
                        82% of people admit they avoid thinking about their own finances... Users of Granite look forward to it.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    card: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#F5F5F5',
        borderRadius: 16,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
})