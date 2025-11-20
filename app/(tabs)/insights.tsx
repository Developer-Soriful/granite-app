

import { Images } from "@/assets";
import BudgetTrendChart from "@/components/BudgetTrendChart";
import DailySpendingChart from "@/components/DailySpendingChart";
import Header from "@/components/Header";
import SpendingChart from "@/components/SpendingChart";
import TopExpensesList from "@/components/TopExpensesList";
import { Ionicons } from "@expo/vector-icons";
import { Image, ScrollView, Text, View } from "react-native";

const Insights = () => {
  return (
    <View
      style={{ flex: 1, backgroundColor: "#e6f5ee", paddingTop: 8 }}
    >
      <View
        className="rounded-bl-[16px] rounded-br-[16px]"
        style={{
          position: "absolute",
          backgroundColor: "#e6f5ee",
          paddingTop: 16,
          left: 0,
          right: 0,
          zIndex: 9,
          marginLeft: 16,
          marginRight: 16,
        }}
      >
        <Header />
      </View>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 16,
          display: "flex",
          paddingTop: 80,
          gap: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* this is for Insights heading and date part */}
        <View className="flex flex-row justify-between items-center">
          <Text className="font-semibold text-2xl">Insights</Text>
          <View className="flex flex-row items-center justify-center gap-3 bg-white px-4 py-3 rounded-[12px]">
            <Text className="text-sm">September, 2025</Text>
            <Ionicons name="calendar-clear-outline" size={20} color="#919b94" />
          </View>
        </View>

        {/* this is for trading char */}
        {/* **NOTE:** The chart component handles its own internal structure now */}
        <View
          style={{ backgroundColor: "#fefffe", borderRadius: 16 }}
          className="p-4"
        >
          <BudgetTrendChart />
        </View>

        {/* this is for Spending by Category */}
        <View>
          <SpendingChart />
        </View>

        {/* this is for top expensess list */}
        <View>
          <TopExpensesList />
        </View>

        {/* this is for DailySpendingChart */}
        <View>
          <DailySpendingChart />
        </View>

        {/* this is for Projected End-of-Month Balance */}
        <View className="bg-white rounded-[16px] mb-4 p-4 w-full flex flex-col gap-4">
          <View className="flex flex-col gap-2">
            <Text className="text-xl font-semibold">
              Projected End-of-Month Balance
            </Text>
            <Text className="text-sm text-[#434c49]">
              Projection based on average daily spend of $105.80
            </Text>
          </View>
          <View className="px-5 py-3 flex flex-row items-center justify-between border border-[#8fc1a8] rounded-[16px]">
            <Text className="text-[32px] font-semibold text-[#4c8167]">
              +$1,827.00
            </Text>
            <View className="p-[19px] bg-[#e8f2ef] rounded-[16px]">
              <Image source={Images.wallet} />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Insights;
// import BudgetTrendChart from '@/components/insightsComponent/BudgetTrendChart';
// import CategorySpendingChart from '@/components/insightsComponent/CategorySpendingChart';
// import MonthSelector from '@/components/insightsComponent/MonthSelector';
// import ProjectedEOMBalance from '@/components/insightsComponent/ProjectedEOMBalance';
// import SpendingVelocityChart from '@/components/insightsComponent/SpendingVelocityChart';
// import TopExpensesList from '@/components/insightsComponent/TopExpensesList';
// import React, { useState } from 'react';
// import { ScrollView, Text, View } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';

// export default function InsightsPage() {
//   const [selectedDate, setSelectedDate] = useState(new Date());

//   return (
//     <SafeAreaView className="flex-1 bg-white">
//       <ScrollView className="flex-1 p-4">
//         {/* Header with Month Selector */}
//         <View className="flex-col md:flex-row justify-between mb-6">
//           <Text className="text-2xl font-semibold text-[#061F12] mb-4 md:mb-0">
//             Insights
//           </Text>
//           <MonthSelector
//             selectedDate={selectedDate}
//             onDateChange={setSelectedDate}
//             minDate={new Date(2024, 0, 1)}
//           />
//         </View>

//         {/* Budget Trend Chart */}
//         <View className="mb-5">
//           <BudgetTrendChart selectedDate={selectedDate} />
//         </View>

//         {/* Category Spending and Top Expenses */}
//         <View className="flex-col md:flex-row gap-4 mb-4">
//           <View className="md:basis-2/3 mb-4 md:mb-0">
//             <CategorySpendingChart selectedDate={selectedDate} />
//             {/* <SpendingChart/> */}
//           </View>
//           <View className="md:basis-1/3">
//             <TopExpensesList selectedDate={selectedDate} />
//           </View>
//         </View>

//         {/* Spending Velocity and Projected EOM Balance */}
//         <View className="flex-col lg:flex-row gap-4 my-4">
//           <View className="lg:basis-2/3 mb-4 lg:mb-0">
//             <SpendingVelocityChart selectedDate={selectedDate} />
//           </View>
//           <View className="lg:basis-1/3 mt-5 lg:mt-0">
//             <ProjectedEOMBalance selectedDate={selectedDate} />
//           </View>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }