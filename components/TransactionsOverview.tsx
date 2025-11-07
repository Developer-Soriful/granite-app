import React from 'react';
import { Text, View } from 'react-native';

const TransactionsOverview = () => {
    return (
        <View className="p-4  rounded-2xl bg-white flex flex-col gap-4">
            <Text className="text-[20px] font-semibold">Transactions Overview</Text>

            <View className="bg-white border-[1px] border-[#dfe5e2] p-3 rounded-[12px] flex flex-row justify-between">
                <Text className="font-semibold text-[14px]">Yesterday</Text>
                <Text className="font-semibold text-[14px]">$0.00</Text>
            </View>

            <View className="bg-white border-[1px] border-[#dfe5e2] p-3 rounded-[12px] flex flex-row justify-between">
                <Text className="font-semibold text-[14px]">This Week</Text>
                <Text className="font-semibold text-[14px]">$500.00</Text>
            </View>

            <View className="bg-white border-[1px] border-[#dfe5e2] p-3 rounded-[12px] flex flex-row justify-between">
                <View>
                    <Text className="font-semibold text-[14px]">This Month</Text>
                    <Text className="text-[#434c49] text-[14px]">44% of budget left</Text>
                </View>
                <Text className="text-[14px] font-semibold ">$1,325.99</Text>
            </View>
        </View>
    );
};

export default TransactionsOverview;