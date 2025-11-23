import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

type LoadingProps = {
    message?: string;
    size?: 'small' | 'large';
    color?: string;
};

export const Loading = ({
    message = 'Loading...',
    size = 'large',
    color = '#4c8167',
}: LoadingProps) => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size={size} color={color} />
            <Text style={[styles.text, { color }]}>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    text: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: '500',
    },
});