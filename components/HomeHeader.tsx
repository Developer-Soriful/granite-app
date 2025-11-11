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
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface HomeHeaderProps {
    isScrolled?: boolean;
    sections: SectionRefs;
    scrollRef: React.RefObject<RNScrollView>;
}

const { width, height } = Dimensions.get('window');

const HomeHeader = ({ isScrolled = false, sections, scrollRef }: HomeHeaderProps) => {
    const [menuVisible, setMenuVisible] = useState(false);
    const slideAnim = useRef(new Animated.Value(width)).current;

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
    const headerText = isScrolled ? 'text-white' : 'text-black';
    // this is for handle login and signup
    const handleLogin = () => {
        router.push('/(auth)');
    };
    const handleSignup = () => {
        router.push('/(auth)/signup');
    };
    // this is for navigate on section to section 
    const scrollTo = (section: keyof SectionRefs) => {
        const sectionRef = sections[section];
        const scrollNode = scrollRef.current;

        if (!sectionRef?.current || !scrollNode) return;

        // Close the menu first
        setMenuVisible(false);

        // Small delay to allow menu to close before scrolling
        setTimeout(() => {
            try {
                // First try measureInWindow as it's more reliable
                sectionRef.current.measureInWindow((x, y, width, height) => {
                    if (y !== undefined && y !== null) {
                        // Calculate the target position with some offset
                        const targetY = Math.max(0, y - 100);

                        // Use a more controlled animation
                        requestAnimationFrame(() => {
                            scrollNode.scrollTo({
                                y: targetY,
                                animated: true,
                                duration: 500,
                            });
                        });
                        return;
                    }

                    // Fallback to measureLayout if measureInWindow doesn't work
                    const scrollNodeHandle = findNodeHandle(scrollNode as any);
                    if (!scrollNodeHandle) return;

                    sectionRef.current.measureLayout(
                        scrollNodeHandle,
                        (x, y) => {
                            const targetY = Math.max(0, y - 100);
                            requestAnimationFrame(() => {
                                scrollNode.scrollTo({
                                    y: targetY,
                                    animated: true,
                                    duration: 500, // Longer duration for smoother scroll
                                });
                            });
                        },
                        () => {
                            console.error('Error measuring layout');
                        }
                    );
                });
            } catch (error) {
                console.error('Error in scrollTo:', error);
            }
        }, 150); // Slightly reduced delay for better UX
    };
    return (
        <>
            <View className='relative overflow-hidden'>
                {isScrolled && (
                    <View
                        className='absolute inset-0'
                        style={{ backgroundColor: '#061f12', opacity: 0.8 }}
                    />
                )}

                <View
                    className={`flex flex-row justify-between items-center px-4 py-4 ${headerBg}`}
                >
                    <View className='flex flex-row items-center gap-2'>
                        <Image source={Images.header_img} />
                        <Text className={`font-bold text-2xl ${headerText}`}>Granite</Text>
                    </View>

                    <Pressable onPress={() => setMenuVisible(true)}>
                        <AntDesign
                            name="align-right"
                            size={24}
                            color={isScrolled ? '#ffffff' : '#000000'}
                        />
                    </Pressable>
                </View>
            </View>

            <Modal
                transparent
                visible={menuVisible}
                animationType="none"
                onRequestClose={() => setMenuVisible(false)}
            >
                <SafeAreaView style={{ flex: 1 }}>
                    <Pressable
                        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
                        onPress={() => setMenuVisible(false)}
                    />
                    <Animated.View
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: width,
                            height: height,
                            transform: [{ translateX: slideAnim }],
                        }}
                    >
                        {/* Original modal content 그대로 রাখা */}
                        <View
                            className='bg-white relative flex flex-col justify-between'
                            style={{ height: height, width: width }}
                        >
                            <View>
                                <View className='flex flex-row justify-between items-center px-5 py-4 border-b border-gray-200'>
                                    <View className='flex flex-row items-center gap-2'>
                                        <Image
                                            source={Images.header_img}
                                            className='w-7 h-7'
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

                            <View className='mt-6 flex flex-col gap-4 mb-16 px-3'>
                                <TouchableOpacity
                                    onPress={handleLogin}
                                    style={{
                                        width: '100%',
                                        borderRadius: 16,
                                        borderColor: '#33805933',
                                        borderWidth: 1,
                                        paddingLeft: 24,
                                        paddingRight: 24,
                                        paddingTop: 12,
                                        paddingBottom: 12,
                                    }}
                                >
                                    <Text className='text-sm text-[#338059] font-semibold text-center'>
                                        Log In
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={handleSignup}
                                    style={{
                                        width: '100%',
                                        borderRadius: 16,
                                        backgroundColor: '#338059',
                                        borderColor: '#33805933',
                                        borderWidth: 1,
                                        paddingLeft: 24,
                                        paddingRight: 24,
                                        paddingTop: 12,
                                        paddingBottom: 12,
                                    }}
                                >
                                    <Text className='text-sm text-[#fff] font-semibold text-center'>
                                        Sign Up
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Animated.View>
                </SafeAreaView>
            </Modal>
        </>
    );
};

export default HomeHeader;
