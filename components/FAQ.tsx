import { faqData } from '@/constans/constans'
import { Octicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import { LayoutAnimation, Platform, Text, TouchableOpacity, UIManager, View } from 'react-native'

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true)
}

const FAQ = () => {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

    const toggleFAQ = (index: number) => {
        // Configure animation
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)

        if (expandedIndex === index) {
            setExpandedIndex(null) // Close if already open
        } else {
            setExpandedIndex(index) // Open the clicked one
        }
    }

    return (
        <View>
            <View className='flex py-10 flex-col gap-3' style={{
                paddingBottom: 40
            }}>
                <Text style={{
                    color: "#919a95",
                    fontSize: 12,
                    fontWeight: '700',
                    textTransform: 'uppercase'
                }}>FAQ</Text>
                <Text style={{
                    fontWeight: 'bold',
                    fontSize: 32,
                    lineHeight: 40,
                }}>Common Questions
                    About Granite App</Text>
                <Text style={{
                    fontSize: 18,
                    lineHeight: 28
                }}>We've compiled a list of frequently asked questions to help you get started quickly.</Text>
            </View>

            {/* this is faq part */}
            <View className='flex flex-col gap-5'>
                {
                    faqData.map((data: any, index: number) => {
                        const isExpanded = expandedIndex === index

                        return (
                            <TouchableOpacity
                                key={index}
                                onPress={() => toggleFAQ(index)}
                                activeOpacity={0.7}
                            >
                                <View className='flex flex-row gap-2 items-start justify-between' style={{
                                    backgroundColor: "#fff",
                                    borderWidth: 1,
                                    borderColor: "#dfe5e2",
                                    borderRadius: 16,
                                    padding: 24
                                }}>
                                    <View className='flex flex-row gap-5 flex-1'>
                                        <Text style={{
                                            fontSize: 12,
                                            fontWeight: '700',
                                            color: "#919a95"
                                        }}>0{index + 1}</Text>
                                        <View className='flex-1'>
                                            <Text
                                                style={{
                                                    color: "#061f12",
                                                    fontSize: 18,
                                                    fontWeight: '700',
                                                    marginBottom: isExpanded ? 12 : 0
                                                }}
                                            >
                                                {data.heading}
                                            </Text>

                                            {isExpanded && (
                                                <View style={{ overflow: 'hidden' }}>
                                                    <Text className='text-[#434D48] text-[16px]' style={{
                                                        lineHeight: 24
                                                    }}>
                                                        {data.describtion}
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                    </View>

                                    <View style={{
                                        width: 24,
                                        height: 24,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        transform: [{ rotate: isExpanded ? '45deg' : '0deg' }]
                                    }}>
                                        <Octicons
                                            name="plus"
                                            size={13}
                                            color="black"
                                        />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )
                    })
                }
            </View>
        </View>
    )
}
export default FAQ