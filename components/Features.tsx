import { Images } from '@/assets'
import React from 'react'
import { Image, Text, View } from 'react-native'

const Features = () => {
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
                    }}>features</Text>
                    <Text style={{
                        fontWeight: 'bold',
                        fontSize: 32,
                        lineHeight: 40,
                    }}>Powerful Features,
                        Simply Presented</Text>
                    <Text style={{
                        fontSize: 18,
                        lineHeight: 28
                    }}>Use our powerful features to take control of your finances and spend with confidence every day.</Text>
                </View>
                <View className='p-5 flex flex-col gap-5 h-[388px]' style={{
                    backgroundColor: "#3380591a",
                    borderRadius: 16
                }}>
                    <Image
                        className='w-full flex-1 rounded-[16px]'
                        resizeMode="cover"
                        source={Images.featuers_chart}
                    />
                </View>
                {/* this is for features Dynamic Daily Budget and more */}
                <View className='pt-6 flex flex-col gap-5'>
                    <View className='flex flex-col gap-2' style={{
                        backgroundColor: "#fff",
                        borderWidth: 1,
                        borderColor: "#dfe5e2",
                        borderRadius: 16,
                        padding: 24
                    }}>
                        <Text style={{
                            fontSize: 12,
                            fontWeight: 700,
                            lineHeight: 16,
                            color: "#919a95"
                        }}>01</Text>
                        <View className='flex flex-col gap-1'>
                            <Text style={{
                                color: "#061f12",
                                fontSize: 22,
                                lineHeight: 33,
                                fontWeight: 700
                            }}>Dynamic Daily Budget</Text>
                            <Text
                                style={{
                                    color: "#434d48",
                                    fontSize: 14,
                                    lineHeight: 20
                                }}
                            >Your daily budget updates automatically based on your expenses. No more manual calculations!</Text>
                        </View>
                    </View>
                    <View className='flex flex-col gap-2' style={{
                        backgroundColor: "#fff",
                        borderWidth: 1,
                        borderColor: "#dfe5e2",
                        borderRadius: 16,
                        padding: 24
                    }}>
                        <Text style={{
                            fontSize: 12,
                            fontWeight: 700,
                            lineHeight: 16,
                            color: "#919a95"
                        }}>02</Text>
                        <View className='flex flex-col gap-1'>
                            <Text style={{
                                color: "#061f12",
                                fontSize: 22,
                                lineHeight: 33,
                                fontWeight: 700
                            }}>Forecast Tool</Text>
                            <Text
                                style={{
                                    color: "#434d48",
                                    fontSize: 14,
                                    lineHeight: 20
                                }}
                            >See how potential purchases today impact your budget for the rest of the week or month.</Text>
                        </View>
                    </View>
                    <View className='flex flex-col gap-2' style={{
                        backgroundColor: "#fff",
                        borderWidth: 1,
                        borderColor: "#dfe5e2",
                        borderRadius: 16,
                        padding: 24
                    }}>
                        <Text style={{
                            fontSize: 12,
                            fontWeight: 700,
                            lineHeight: 16,
                            color: "#919a95"
                        }}>03</Text>
                        <View className='flex flex-col gap-1'>
                            <Text style={{
                                color: "#061f12",
                                fontSize: 22,
                                lineHeight: 33,
                                fontWeight: 700
                            }}>Simple Insights</Text>
                            <Text
                                style={{
                                    color: "#434d48",
                                    fontSize: 14,
                                    lineHeight: 20
                                }}
                            >Quickly see your largest transactions, top spending categories, and if you’re staying on budget with easy to understand insights & graphs.</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default Features