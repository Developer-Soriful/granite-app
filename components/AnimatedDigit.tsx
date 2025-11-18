import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

interface Props {
    value: string;
}

const AnimatedDigit = ({ value }: Props) => {
    const translateY = useSharedValue(0);

    useEffect(() => {
        translateY.value = -20; // move up
        translateY.value = withTiming(0, { duration: 200 }); // slide down smoothly
    }, [value]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    return (
        <View style={{ height: 35, overflow: 'hidden' }}>
            <Animated.Text
                style={[
                    {
                        fontSize: 30,
                        fontWeight: '600',
                        color: '#3d424d',
                    },
                    animatedStyle,
                ]}
            >
                {value}
            </Animated.Text>
        </View>
    );
};

export default AnimatedDigit;
