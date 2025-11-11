import { testimonials } from '@/constans/constans'
import { FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons'
import React, { useRef, useState } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, Text, TouchableOpacity, View } from 'react-native'

const Testimonial = () => {
    const scrollViewRef = useRef<ScrollView>(null)
    const [currentScrollX, setCurrentScrollX] = useState(0)
    const cardWidth = 265 + 16 // card width + margin right

    // Create infinite loop by repeating testimonials 5 times for better infinite feel
    const infiniteTestimonials = [
        ...testimonials,
        ...testimonials,
        ...testimonials,
        ...testimonials,
        ...testimonials
    ]

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const scrollX = event.nativeEvent.contentOffset.x
        setCurrentScrollX(scrollX)
        const contentWidth = testimonials.length * cardWidth

        // Reset to middle when reaching start
        if (scrollX <= cardWidth) {
            scrollViewRef.current?.scrollTo({
                x: scrollX + contentWidth * 2,
                animated: false
            })
        }

        // Reset to middle when reaching end
        if (scrollX >= contentWidth * 4 - cardWidth) {
            scrollViewRef.current?.scrollTo({
                x: scrollX - contentWidth * 2,
                animated: false
            })
        }
    }

    const handleScrollLeft = () => {
        const newScrollX = currentScrollX - cardWidth
        scrollViewRef.current?.scrollTo({
            x: newScrollX,
            animated: true
        })
    }

    const handleScrollRight = () => {
        const newScrollX = currentScrollX + cardWidth
        scrollViewRef.current?.scrollTo({
            x: newScrollX,
            animated: true
        })
    }

    return (
        <View>
            <View>
                <View className='flex py-10 flex-col gap-3' style={{
                    paddingBottom: 40
                }}>
                    <Text style={{
                        color: "#919a95",
                        fontSize: 12,
                        fontWeight: 700,
                        textTransform: 'uppercase'
                    }}>testimonial</Text>
                    <Text style={{
                        fontWeight: 'bold',
                        fontSize: 32,
                        lineHeight: 40,
                    }}>Don't Just Take Our
                        Word For It</Text>
                    <Text style={{
                        fontSize: 18,
                        lineHeight: 28
                    }}>Read our customer success stories to see how our app has made a difference.</Text>
                </View>

                {/* this section for testimonial slide part */}
                <View>
                    <ScrollView
                        ref={scrollViewRef}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: 4
                        }}
                        onContentSizeChange={() => {
                            // Start from middle set (2nd repetition)
                            const initialScroll = testimonials.length * cardWidth * 2
                            setCurrentScrollX(initialScroll)
                            scrollViewRef.current?.scrollTo({
                                x: initialScroll,
                                animated: false
                            })
                        }}
                    >
                        {
                            infiniteTestimonials.map((data: any, index: number) => {
                                return <View key={index} className={` w-[265px] flex flex-col gap-5 p-5 rounded-[16px] mr-4 ${data.username === "J. Washington" ? "bg-[#338059]" : "bg-[#33805933]"}`}>
                                    {/* this is for comma icon  */}
                                    <View className='flex flex-row items-center h-[26px] w-[36px]'>
                                        <MaterialCommunityIcons className='rotate-180' name="comma" size={24} color={`${data.username === "J. Washington" ? "#6ba689" : "#abcebd"}`} />
                                        <MaterialCommunityIcons className='rotate-180' name="comma" size={24} color={`${data.username === "J. Washington" ? "#6ba689" : "#abcebd"}`} />
                                    </View>
                                    <Text className={`${data.username === "J. Washington" ? "text-white" : "text-black"}`} style={{
                                        fontSize: 18,
                                        lineHeight: 28,
                                    }}>
                                        {data.describtion}
                                    </Text>
                                    <Text className={`${data.username === "J. Washington" ? "text-white" : "tex-[#434d48]"}`} style={{
                                        borderBottomColor: "#c1d1c9",
                                        paddingBottom: 35,
                                        borderBottomWidth: 1,
                                        lineHeight: 24
                                    }}>
                                        – {data.username}
                                    </Text>
                                </View>
                            })
                        }
                    </ScrollView>

                    {/* this is for scroll button when user click on the button then scroll there */}
                    <View className='flex flex-row gap-2 py-5'>
                        <TouchableOpacity
                            onPress={handleScrollLeft}
                            className='w-[50px] h-[50px] border border-[#33805933] flex justify-center items-center rounded-[12px]'
                        >
                            <FontAwesome6 name="arrow-left" size={24} color="black" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleScrollRight}
                            className='w-[50px] h-[50px] border border-[#33805933] flex justify-center items-center rounded-[12px]'
                        >
                            <FontAwesome6 name="arrow-right" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default Testimonial