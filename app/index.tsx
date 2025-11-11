import { Images } from '@/assets'
import Contact from '@/components/Contact'
import FAQ from '@/components/FAQ'
import Features from '@/components/Features'
import HomeHeader from '@/components/HomeHeader'
import HowItWork from '@/components/HowItWork'
import Testimonial from '@/components/Testimonial'
import { SectionRefs } from '@/types/navigation'
import Button from '@/ui/Button'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React, { useRef, useState, LegacyRef } from 'react'
import {
    Image,
    ImageBackground,
    NativeScrollEvent,
    NativeSyntheticEvent,
    ScrollView,
    ScrollViewProps,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewProps
} from 'react-native'

const HomePage = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);

    // Create refs for each section
    const howItWorksRef = useRef<View>(null);
    const featuresRef = useRef<View>(null);
    const testimonialsRef = useRef<View>(null);
    const faqRef = useRef<View>(null);

    const sections: SectionRefs = {
        howItWorks: howItWorksRef,
        features: featuresRef,
        testimonials: testimonialsRef,
        faq: faqRef,
    };

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const scrollY = event.nativeEvent.contentOffset.y;
        setIsScrolled(scrollY > 20);
    };

    // this is for handle login and signup
    const handleLogin = () => {
        router.push('/(auth)');
    };

    const handleSignup = () => {
        router.push('/(auth)/signup');
    };

    return (
        <View>
            <View className="absolute top-0 left-0 right-0 z-10">
                <HomeHeader
                    sections={sections}
                    isScrolled={isScrolled}
                    scrollRef={scrollViewRef}
                />
            </View>
            <ScrollView
                ref={scrollViewRef as unknown as LegacyRef<ScrollView>}
                onScroll={handleScroll}
                scrollEventThrottle={16}
            >
                <View className='w-full h-full px-4 flex flex-col gap-4 bg-white pt-[45px]'>
                    {/* this is for get started section */}
                    <View className='bg-[#ebf3ee]  p-5 flex flex-col gap-4'>
                        <Text className='font-bold text-[30px]'>
                            Know Exactly
                            How Much You
                            Can Spend Today
                        </Text>
                        <Text className='text-[#434d48]'>Granite gives you a simple daily number so you always know what’s safe to spend each day</Text>
                        <View className="w-full">
                            <Button />
                        </View>
                        <ImageBackground source={
                            Images.screen
                        } resizeMode="contain" style={styles.image}>
                            <View className='flex items-center justify-center'>
                                <View className='flex flex-row justify-center items-center gap-2 w-full' style={{
                                    paddingTop: 90,
                                }} >
                                    <Image source={Images.header_img} />
                                    <Text className='text-xl font-bold'>Grantie</Text>
                                </View>
                                <View className='flex flex-col gap-4 justify-center items-center w-full px-6'>
                                    <Text className='font-bold text-xl'>How Much Can I Spend?</Text>
                                    <View className='flex flex-row items-center justify-center gap-3 w-full'>
                                        <Text className='font-bold text-[12px] px-3 py-1  text-[#434d48] rounded-[8px]' style={{
                                            borderColor: '#0a183333',
                                            borderWidth: 1
                                        }}>Today</Text>
                                        <Text className='font-bold text-[12px] px-3 py-1  text-[#434d48] rounded-[8px]' style={{
                                            borderColor: '#0a183333',
                                            borderWidth: 1
                                        }}>This Week</Text>
                                        <Text className='font-bold text-[12px] px-3 py-1  text-[#434d48] rounded-[8px]' style={{
                                            borderColor: '#0a183333',
                                            borderWidth: 1
                                        }}>This Month</Text>
                                    </View>
                                    <View className='w-full rounded-[16px] flex flex-col justify-center items-center gap-1' style={{
                                        backgroundColor: "#e9f2ee",
                                        borderColor: "#8fc0a91a",
                                        borderWidth: 1,
                                        padding: 20
                                    }}>
                                        <Text
                                            style={{
                                                // Corrected syntax: color, fontSize, fontWeight, camelCase, comma separation
                                                color: '#3d424d',
                                                fontSize: 12,
                                                fontWeight: '500', // Use string for '500' or 'bold'
                                                letterSpacing: 1.8,
                                                lineHeight: 16,
                                                margin: 0, // 'margin: 0 0 8' is invalid. Use margin for all sides or specific properties.
                                                marginBottom: 8, // Use marginBottom for the 8 unit bottom margin
                                                textAlign: 'center',
                                                textTransform: 'uppercase',
                                            }}
                                            className='text-[#3d424d]'>
                                            AVAILABLE SPENDING
                                        </Text>
                                        <Text className='text-[#3d424d] text-[30px] font-semibold'>
                                            $ 234.56
                                        </Text>
                                    </View>
                                </View>
                                {/* Content goes here (e.g., Text, other Views) */}
                                <Text style={styles.text}>Your App Content Here</Text>
                            </View>
                        </ImageBackground>
                    </View>
                    {/* this is for Stop Guessing,Start Knowing section */}
                    <View>
                        <View>
                            <Text className='font-bold' style={{
                                fontSize: 36
                            }}>Stop Guessing,
                                Start Knowing</Text>
                            <Text style={{
                                fontSize: 18,
                                color: "#434d48",
                                lineHeight: 28
                            }}>
                                Most budgeting apps just tell you what you already spent... Granite tells you how much you can spend today, this week, and this month — so you never end the month with less money than you started.
                            </Text>
                            <View className='w-full p-4 flex flex-col gap-3'>
                                <View className='flex flex-row justify-center items-start gap-2'>
                                    <Ionicons name="checkmark-done-circle-sharp" size={24} color="#338059" />
                                    <Text className='font-bold' style={{
                                        fontSize: 18,
                                        lineHeight: 28
                                    }}>
                                        View your daily, weekly, and monthly budgets at a glance
                                    </Text>
                                </View>
                                <View className='flex flex-row justify-center items-start gap-2'>
                                    <Ionicons name="checkmark-done-circle-sharp" size={24} color="#338059" />
                                    <Text className='font-bold' style={{
                                        fontSize: 18,
                                        lineHeight: 28
                                    }}>
                                        See how your current spending habits will affect your end of month balance
                                    </Text>
                                </View>
                                <View className='flex flex-row justify-center items-start gap-2'>
                                    <Ionicons name="checkmark-done-circle-sharp" size={24} color="#338059" />
                                    <Text className='font-bold' style={{
                                        fontSize: 18,
                                        lineHeight: 28
                                    }}>
                                        Gain valuable insights on exactly where your money is going
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View>
                            <Button />
                        </View>
                    </View>
                    {/* this is for iphone image */}
                    <View style={{
                        paddingTop: 32,
                        paddingBottom: 32
                    }}>
                        <Image className='w-full' style={{
                            height: 500,
                            borderRadius: 32
                        }} source={Images.iphone} />
                    </View>
                    {/* this is for how it work section */}
                    <View>
                        <View style={styles.section} ref={howItWorksRef as LegacyRef<View>}>
                            <HowItWork />
                        </View>
                        {/* this is for features */}
                        <View style={styles.section} ref={featuresRef as LegacyRef<View>}>
                            <Features />
                        </View>
                        {/* this is for testimonial section */}
                        <View style={styles.section} ref={testimonialsRef as LegacyRef<View>}>
                            <Testimonial />
                        </View>
                        {/* this is for FAQ section */}
                        <View style={styles.section} ref={faqRef as LegacyRef<View>}>
                            <FAQ />
                        </View>
                        {/* this is for last card */}
                        <View className='border-b border-[#33805933]'>
                            <View className='p-5  my-10 flex flex-col gap-5' style={{
                                backgroundColor: "#8fc0a9",
                                borderRadius: 16,
                                borderColor: "#8fc0a9",
                                borderWidth: 1
                            }}>
                                <Text className='text-[22px] font-bold' style={{
                                    lineHeight: 33
                                }}>See How Today's Spending Affects Your Tomorrow</Text>
                                <View>
                                    <Button />
                                </View>
                            </View>
                        </View>
                        {/* this is for logo and auth part */}
                        <View className='flex flex-col gap-6 items-center justify-center'>
                            <View className='flex flex-row items-center justify-center gap-2 mt-[48px]'>
                                <Image className='h-[48px] w-[48px]' source={Images.header_img} />
                                <Text
                                    className='font-bold text-3xl'
                                >
                                    Granite
                                </Text>
                            </View>
                            <Text className='text-[#061f12] text-sm'>Know Exactly How Much You Can Spend Today</Text>
                        </View>
                        <View className='mt-6 flex flex-col gap-4 mb-10'>
                            <TouchableOpacity onPress={handleLogin}
                                style={{
                                    width: "100%",
                                    borderRadius: 16,
                                    borderColor: "#33805933",
                                    borderWidth: 1,
                                    paddingLeft: 24,
                                    paddingRight: 24,
                                    paddingTop: 12,
                                    paddingBottom: 12,
                                }}
                            >
                                <Text className='text-sm text-[#338059] font-semibold text-start'>Log In</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleSignup}
                                style={{
                                    width: "100%",
                                    borderRadius: 16,
                                    backgroundColor: "#338059",
                                    borderColor: "#33805933",
                                    borderWidth: 1,
                                    paddingLeft: 24,
                                    paddingRight: 24,
                                    paddingTop: 12,
                                    paddingBottom: 12,
                                }}>
                                <Text className='text-sm text-[#fff] font-semibold text-center'>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                        {/* this is for contact section */}
                        <View>
                            <Contact />
                        </View>
                    </View>
                </View >
            </ScrollView >
        </View>
    )
}

export default HomePage
const styles = StyleSheet.create({
    section: {
        paddingTop: 40,
        paddingBottom: 40,
    },
    container: {
        flex: 1,
        padding: 24
    },
    image: {
        justifyContent: 'center',
        borderTopLeftRadius: 55,
        borderBottomRightRadius: 55,
    },
    text: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});