import Button from '@/ui/Button'
import { Feather, Ionicons, MaterialCommunityIcons, MaterialIcons, Octicons } from '@expo/vector-icons'
import React from 'react'
import { Text, View } from 'react-native'

const HowItWork = () => {
    return (
        <View>
            <View className='flex flex-col gap-3' style={{
                paddingBottom: 40
            }}>
                <Text style={{
                    color: "#919a95",
                    fontSize: 12,
                    fontWeight: 700,
                    textTransform: 'uppercase'
                }}>how it works</Text>
                <Text style={{
                    fontWeight: 'bold',
                    fontSize: 32,
                    lineHeight: 40,
                }}>Get Your Daily Budget
                    In 4 Simple Steps</Text>
                <Text style={{
                    fontSize: 18,
                    lineHeight: 28
                }}>Get a real-time daily budget, and see how today’s spending affects your future.</Text>
            </View>
            {/* this is for card section */}
            <View className='flex flex-col gap-5'>
                {/* this is for card 1 */}
                <View className='px-5 pt-5 flex flex-col gap-5' style={{
                    backgroundColor: "#ebf3ee",
                    borderRadius: 16
                }}>
                    <View>
                        <Text className='text-[#338059] font-bold text-[12px]'>01</Text>
                        <Text className='text-[#061f12] font-bold text-xl'>Set Your Income</Text>
                        <Text className='text-[#434d48] text-sm'>Enter your expected monthly income.</Text>
                    </View>
                    <View className='bg-[#fff] px-5 pt-5 pb-2 flex flex-col gap-2 rounded-tl-2xl rounded-tr-2xl'>
                        <Text className='text-sm text-[#434d48]'>Monthly Income</Text>
                        <Text className='text-[#8fc0a9] text-[20px] font-bold'>$5,678.00</Text>
                    </View>
                </View>
                {/* this is for card 2 */}
                <View className='px-5 pt-5 flex flex-col gap-5' style={{
                    backgroundColor: "#33805933",
                    borderRadius: 16
                }}>
                    <View>
                        <Text className='text-[#338059] font-bold text-[12px]'>02</Text>
                        <Text className='text-[#061f12] font-bold text-xl'>Add Fixed Expenses</Text>
                        <Text className='text-[#434d48] text-sm'>Tell us about recurring costs like rent, utilities, subscriptions, etc.</Text>
                    </View>
                    <View className='bg-[#fff] px-5 pt-5 pb-2 flex flex-col gap-2 rounded-tl-2xl rounded-tr-2xl'>
                        <View className='flex flex-row justify-between'>
                            <Text className='text-[#384151] font-medium'>My Expenses</Text>
                            <Feather name="plus" size={24} color="black" />
                        </View>
                        <View className='flex flex-row justify-between items-center border-b pb-3 border-[#dfe5e2]'>
                            <View className='flex flex-row justify-center items-center gap-3'>
                                <View className='bg-[#eaeef2] w-10 h-10 flex justify-center items-center rounded-[8px]'>
                                    <Octicons name="home" size={24} color="black" />
                                </View>
                                <View>
                                    <Text className='text-[#434d48] font-bold text-[16px]'>Rent</Text>
                                    <Text className='text-[#384151cc] text-[12px]'>Monthly</Text>
                                </View>
                            </View>
                            <Text className='text-[#434d48] font-medium text-[16px]'>$1,789.00</Text>
                        </View>
                        <View className='flex flex-row justify-between items-center border-b pb-3 border-[#dfe5e2]'>
                            <View className='flex flex-row justify-center items-center gap-3'>
                                <View className='bg-[#fbf1e5] w-10 h-10 flex justify-center items-center rounded-[8px]'>
                                    <MaterialIcons name="electric-bolt" size={24} color="#d97400" />
                                </View>
                                <View>
                                    <Text className='text-[#434d48] font-bold text-[16px]'>Utilities</Text>
                                    <Text className='text-[#384151cc] text-[12px]'>Monthly</Text>
                                </View>
                            </View>
                            <Text className='text-[#434d48] font-medium text-[16px]'>$350.00</Text>
                        </View>
                        <View className='flex flex-row justify-between items-center'>
                            <View className='flex flex-row justify-center items-center gap-3'>
                                <View className='bg-[#fae8e8] w-10 h-10 flex justify-center items-center rounded-[8px]'>
                                    <Feather name="shopping-bag" size={24} color="#cd201f" />
                                </View>
                                <View>
                                    <Text className='text-[#434d48] font-bold text-[16px]'>Groceries</Text>
                                    <Text className='text-[#384151cc] text-[12px]'>Monthly</Text>
                                </View>
                            </View>
                            <Text className='text-[#434d48] font-medium text-[16px]'>$550.00</Text>
                        </View>
                    </View>
                </View>
                {/* this is for card 3 */}
                <View className='px-5 pt-5 flex flex-col gap-5' style={{
                    backgroundColor: "#d6e6de",
                    borderRadius: 16
                }}>
                    <View>
                        <Text className='text-[#338059] font-bold text-[12px]'>03</Text>
                        <Text className='text-[#061f12] font-bold text-xl'>Add Investments & Savings
                        </Text>
                        <Text className='text-[#434d48] text-sm'>How much you save or invest each month after receiving your paycheck?
                        </Text>
                    </View>
                    <View className='bg-[#fff] px-5 pt-5 pb-2 flex flex-col gap-2 rounded-tl-2xl rounded-tr-2xl'>
                        <View className='flex flex-row justify-between'>
                            <Text className='text-[#384151] font-medium'>My Investments&Savings</Text>
                            <Feather name="plus" size={24} color="black" />
                        </View>
                        <View className='flex flex-row justify-between items-center border-b pb-3 border-[#dfe5e2]'>
                            <View className='flex flex-row justify-center items-center gap-3'>
                                <View className='bg-[#eaeef2] w-10 h-10 flex justify-center items-center rounded-[8px]'>
                                    <MaterialCommunityIcons name="download-circle-outline" size={24} color="black" />
                                </View>
                                <View>
                                    <Text className='text-[#434d48] font-bold text-[16px]'>Personal Savings</Text>
                                    <Text className='text-[#384151cc] text-[12px]'>Monthly</Text>
                                </View>
                            </View>
                            <Text className='text-[#434d48] font-medium text-[16px]'>$400.00</Text>
                        </View>
                        <View className='flex flex-row justify-between items-center border-b pb-3 border-[#dfe5e2]'>
                            <View className='flex flex-row justify-center items-center gap-3'>
                                <View className='bg-[#eaeef2] w-10 h-10 flex justify-center items-center rounded-[8px]'>
                                    <MaterialCommunityIcons name="download-circle-outline" size={24} color="black" />
                                </View>
                                <View>
                                    <Text className='text-[#434d48] font-bold text-[16px]'>Crypto Investments</Text>
                                    <Text className='text-[#384151cc] text-[12px]'>Monthly</Text>
                                </View>
                            </View>
                            <Text className='text-[#434d48] font-medium text-[16px]'>$250.00</Text>
                        </View>
                        <View className='flex flex-row justify-between items-center'>
                            <View className='flex flex-row justify-center items-center gap-3'>
                                <View className='bg-[#eaeef2] w-10 h-10 flex justify-center items-center rounded-[8px]'>
                                    <MaterialCommunityIcons name="download-circle-outline" size={24} color="black" />
                                </View>
                                <View>
                                    <Text className='text-[#434d48] font-bold text-[16px]'>Bank Deposit</Text>
                                    <Text className='text-[#384151cc] text-[12px]'>Monthly</Text>
                                </View>
                            </View>
                            <Text className='text-[#434d48] font-medium text-[16px]'>$750.00</Text>
                        </View>
                    </View>
                </View>
                {/* this is for card 4 */}
                <View className='px-5 pt-5 flex flex-col gap-5' style={{
                    backgroundColor: "#ebf3ee",
                    borderRadius: 16
                }}>
                    <View>
                        <Text className='text-[#338059] font-bold text-[12px]'>03</Text>
                        <Text className='text-[#061f12] font-bold text-xl'>Add Investments & Savings
                        </Text>
                        <Text className='text-[#434d48] text-sm'>How much you save or invest each month after receiving your paycheck?
                        </Text>
                    </View>
                    <View className='bg-[#fff] px-5 pt-5 pb-2 flex flex-col gap-2 rounded-tl-2xl rounded-tr-2xl'>
                        <View className='flex flex-row justify-between'>
                            <Text className='text-[#384151] font-medium'>My Cards</Text>
                            <Feather name="plus" size={24} color="black" />
                        </View>
                        <View className='flex flex-row justify-between items-center'>
                            <View className='flex flex-row justify-center items-center gap-3'>
                                <View className='bg-[#eaf2ee] w-10 h-10 flex justify-center items-center rounded-[8px]'>
                                    <Ionicons name="card-outline" size={24} color="#338059" />
                                </View>
                                <View>
                                    <Text className='text-[#434d48] font-bold text-[16px]'>MasterCard</Text>
                                    <Text className='text-[#384151cc] text-[12px]'>01/28</Text>
                                </View>
                            </View>
                            <Text className='text-[#434d48] font-medium text-[16px]'>•••• 7890</Text>
                        </View>
                    </View>
                </View>
                {/* this is for last card */}
                <View className='p-5 flex flex-col gap-5' style={{
                    backgroundColor: "#8fc0a9",
                    borderRadius: 16
                }}>
                    <Text className='text-[22px] font-bold' style={{
                        lineHeight: 33
                    }}>Granite calculates your daily spendable amount</Text>
                    <View>
                        <Button />
                    </View>
                </View>
            </View>
        </View>
    )
}

export default HowItWork