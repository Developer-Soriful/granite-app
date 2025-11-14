import { useRouter } from 'expo-router';
import React from 'react';
import {
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// Dummy hook - replace with your actual implementation
const useTrackSignupProgress = (path: string) => {
    React.useEffect(() => {
        console.log(`Tracking signup progress: ${path}`);
        // Add your analytics tracking logic here
    }, [path]);
};

export default function WelcomePage() {
    const router = useRouter();
    useTrackSignupProgress('/welcome');

    const handleGetStarted = () => {
        router.push("/(auth)/priming");
    };

    return (
        <ScrollView
            contentContainerStyle={{
                flexGrow: 1,
                backgroundColor: 'white',
            }}
            className="flex-1 bg-white"
        >
            <View className="flex-1 items-center justify-center p-4">
                <View className="max-w-md w-full p-8 bg-whiterounded-lg ">
                    <Text className="text-3xl font-bold text-black text-center mb-4">
                        Welcome to Granite!
                    </Text>
                    <Text className="text-lg text-black text-center mb-8">
                        Let's figure out how much you can spend today.
                    </Text>

                    <TouchableOpacity
                        onPress={handleGetStarted}
                        className="px-6 py-4 bg-[#66BB6A] rounded-2xl "
                    >
                        <Text className="text-white font-semibold text-center text-base">
                            Get Started
                        </Text>
                    </TouchableOpacity>

                    {/* Alternative using Link component */}
                    {/* <Link href="/(auth)/priming" asChild>
            <TouchableOpacity className="px-6 py-4 bg-[#66BB6A] rounded-2xl shadow-lg">
              <Text className="text-white font-semibold text-center text-base">
                Get Started
              </Text>
            </TouchableOpacity>
          </Link> */}
                </View>
            </View>
        </ScrollView>
    );
}