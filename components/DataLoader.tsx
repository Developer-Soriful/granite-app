// components/DataLoader.tsx
import { ActivityIndicator, Text, View } from 'react-native';

export function DataLoader({ isLoading, error, children }: any) {
    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center p-4">
                <ActivityIndicator size="large" color="#338059" />
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 items-center justify-center p-4">
                <Text className="text-red-500">Error loading data. Please try again.</Text>
            </View>
        );
    }

    return children;
}