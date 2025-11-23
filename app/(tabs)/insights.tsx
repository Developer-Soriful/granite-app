

import { Images } from "@/assets";
import BudgetTrendChart from "@/components/BudgetTrendChart";
import DailySpendingChart from "@/components/DailySpendingChart";
import Header from "@/components/Header";
import SpendingChart from "@/components/SpendingChart";
import TopExpensesList from "@/components/TopExpensesList";
import { InsightsApi } from '@/services/ApiService';
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useQuery } from '@tanstack/react-query';
import { format } from "date-fns";
import { useState } from "react";
import { Image, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
const Insights = () => {
  const currentMonth = new Date().toISOString().slice(0, 7);

  const { data: spendingData } = useQuery({
    queryKey: ['insights', 'spending', currentMonth],
    queryFn: () => InsightsApi.getSpendingByCategory(currentMonth).then(res => res.data),
  });

  const { data: dailySpending } = useQuery({
    queryKey: ['insights', 'daily', currentMonth],
    queryFn: () => InsightsApi.getDailySpending(currentMonth).then(res => res.data),
  });

  const { data: budgetTrends } = useQuery({
    queryKey: ['insights', 'budget-trends'],
    queryFn: () => InsightsApi.getBudgetTrends().then(res => res.data),
  });
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const onChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowPicker(Platform.OS === "ios"); // iOS e always open thake
    setDate(currentDate);
  };

  const showDatePicker = () => {
    setShowPicker(true);
  };

  // Format: "September, 2025"
  const displayText = format(date, "MMMM, yyyy");
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
        <View className="flex flex-row justify-between items-center mb-6">
          <Text className="font-semibold text-2xl text-gray-900">Insights</Text>

          {/* Real Calendar Button */}
          <TouchableOpacity
            onPress={showDatePicker}
            activeOpacity={0.7}
            className="flex flex-row items-center justify-center gap-3 bg-white px-5 py-3 rounded-[12px] border border-gray-200 shadow-sm"
          >
            <Text className="text-sm font-medium text-gray-700">{displayText}</Text>
            <Ionicons name="calendar-clear-outline" size={20} color="#919b94" />
          </TouchableOpacity>

          {/* Native Date Picker */}
          {showPicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onChange}
              maximumDate={new Date()} // Future date block
              locale="en-US"
              themeVariant="light"
            />
          )}
        </View>

        {/* this is for trading char */}
        {/* **NOTE:** The chart component handles its own internal structure now */}
        <View
          style={{ backgroundColor: "#fefffe", borderRadius: 16 }}
          className="p-4"
        >
          <BudgetTrendChart data={budgetTrends} />
        </View>

        {/* this is for Spending by Category */}
        <View>
          <SpendingChart data={spendingData?.categories} />
        </View>

        {/* this is for top expensess list */}
        <View>
          <TopExpensesList />
        </View>

        {/* this is for DailySpendingChart */}
        <View>
          <DailySpendingChart data={dailySpending} />
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