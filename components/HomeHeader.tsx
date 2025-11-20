import { Images } from '@/assets';
import { SectionRefs } from '@/types/navigation';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    findNodeHandle,
    Image,
    Modal,
    Pressable,
    ScrollView as RNScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
// IMPORT useSafeAreaInsets for dynamic padding
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

interface HomeHeaderProps {
    isScrolled?: boolean;
    sections: SectionRefs;
    scrollRef: React.RefObject<RNScrollView>;
}

const { width, height } = Dimensions.get('window');

const HomeHeader = ({ isScrolled = false, sections, scrollRef }: HomeHeaderProps) => {
    const [menuVisible, setMenuVisible] = useState(false);
    const slideAnim = useRef(new Animated.Value(width)).current;

    // 🔑 FIX: Get the safe area insets dynamically
    const insets = useSafeAreaInsets();

    useEffect(() => {
        if (menuVisible) {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: width,
                duration: 600,
                useNativeDriver: true,
            }).start();
        }
    }, [menuVisible]);

    const headerBg = isScrolled ? 'bg-transparent' : 'bg-white';

    const handleLogin = () => {
        setMenuVisible(false);
        router.push('/(auth)');
    };
    const handleSignup = () => {
        setMenuVisible(false);
        router.push('/(auth)/signup');
    };

    // (scrollTo function remains unchanged, omitted for brevity)
    const scrollTo = (section: keyof SectionRefs) => {
        const sectionRef = sections[section];
        const scrollNode = scrollRef.current;

        if (!sectionRef?.current || !scrollNode) return;

        setMenuVisible(false);

        setTimeout(() => {
            try {
                const scrollNodeHandle = findNodeHandle(scrollNode as any);
                if (!scrollNodeHandle) return;

                sectionRef.current.measureLayout(
                    scrollNodeHandle,
                    (layoutX, layoutY) => {
                        const targetY = Math.max(0, layoutY - 100);

                        requestAnimationFrame(() => {
                            scrollNode.scrollTo({
                                y: targetY,
                                animated: true,
                            });
                        });
                    },
                    () => {
                        console.error('Error measuring layout');
                    }
                );
            } catch (error) {
                console.error('Error in scrollTo:', error);
            }
        }, 150);
    };

    const handleBackHome = () => {
        router.push("/")
    }

    return (
        <>
            {/* --- Main Header Content --- */}
            <View className='relative overflow-hidden'>
                {isScrolled && (
                    <View
                        className='absolute inset-0'
                        style={{ backgroundColor: '#d6e6de', opacity: 0.8 }}
                    />
                )}
                <View
                    className={`flex flex-row justify-between items-center px-4 py-4 ${headerBg}`}
                >
                    <TouchableOpacity onPress={handleBackHome} className='flex flex-row items-center gap-2'>
                        <Image source={Images.header_img} />
                        <Text className={`font-bold text-2xl text-black`}>Granite</Text>
                    </TouchableOpacity>
                    <Pressable onPress={() => setMenuVisible(true)}>
                        <AntDesign
                            name="align-right"
                            size={24}
                            color="black"
                        />
                    </Pressable>
                </View>
            </View>
            {/* --------------------- Modal Menu --------------------- */}
            <Modal
                transparent
                visible={menuVisible}
                animationType="none"
                onRequestClose={() => setMenuVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    {/* Background/Backdrop */}
                    <Pressable
                        style={styles.backdrop}
                        onPress={() => setMenuVisible(false)}
                    />

                    <Animated.View
                        style={[
                            styles.animatedContainer,
                            { transform: [{ translateX: slideAnim }] },
                        ]}
                    >
                        {/* The content is inside SafeAreaView to handle top and bottom insets */}
                        <SafeAreaView
                            className='bg-white relative flex flex-col justify-between'
                            style={styles.menuContent}
                        >
                            {/* Top Section (Logo/Close/Links) */}
                            <View>
                                <View className='flex flex-row justify-between items-center px-5 py-4 border-b border-gray-200'>
                                    <View className='flex flex-row items-center gap-2'>
                                        <Image
                                            source={Images.header_img}
                                            resizeMode='contain'
                                        />
                                        <Text className='font-bold text-2xl text-black'>
                                            Granite
                                        </Text>
                                    </View>
                                    <Pressable onPress={() => setMenuVisible(false)}>
                                        <Ionicons name="close" size={32} color="#000" />
                                    </Pressable>
                                </View>
                                <View className='p-3'>
                                    <Pressable onPress={() => scrollTo('howItWorks')} className='py-4'>
                                        <Text className='text-lg text-gray-700'>How it Works</Text>
                                    </Pressable>
                                    <Pressable onPress={() => scrollTo('features')} className='py-4'>
                                        <Text className='text-lg text-gray-700'>Features</Text>
                                    </Pressable>
                                    <Pressable onPress={() => scrollTo('testimonials')} className='py-4'>
                                        <Text className='text-lg text-gray-700'>Testimonials</Text>
                                    </Pressable>
                                    <Pressable onPress={() => scrollTo('faq')} className='py-4'>
                                        <Text className='text-lg text-gray-700'>FAQ</Text>
                                    </Pressable>
                                </View>
                            </View>

                            {/* Bottom Section (Login/Signup Buttons)
                                🔑 FIX: Applying the safe area bottom inset directly to the style
                                using the 'insets.bottom' value. We also add a small margin (16)
                                for visual spacing above the inset.
                            */}
                            <View
                                className=' flex flex-col gap-4 px-3'
                                style={{ paddingBottom: insets.bottom + 32 }} // <-- DYNAMIC PADDING FIX
                            >
                                <TouchableOpacity
                                    onPress={handleLogin}
                                    style={styles.loginButton}
                                >
                                    <Text className='text-sm text-[#338059] font-semibold text-center'>
                                        Log In
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={handleSignup}
                                    style={styles.signupButton}
                                >
                                    <Text className='text-sm text-[#fff] font-semibold text-center'>
                                        Sign Up
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </SafeAreaView>
                    </Animated.View>
                </View>
            </Modal>
        </>
    );
};

export default HomeHeader;

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        height: "100%"
    },
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    animatedContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: width,
        height: height,
    },
    menuContent: {
        flex: 1,
        // Since we are applying bottom inset dynamically to the button container,
        // we ensure SafeAreaView takes full flex 1 space.
    },
    // Moved button styles here for cleanliness (optional, but good practice)
    loginButton: {
        width: '100%',
        borderRadius: 16,
        borderColor: '#33805933',
        borderWidth: 1,
        paddingHorizontal: 24,
        paddingVertical: 12,
    },
    signupButton: {
        width: '100%',
        borderRadius: 16,
        backgroundColor: '#338059',
        borderColor: '#33805933',
        borderWidth: 1,
        paddingHorizontal: 24,
        paddingVertical: 12,
    }
});