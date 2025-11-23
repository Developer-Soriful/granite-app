import CalenderSection from "@/components/CalenderSection";
import { DataLoader } from "@/components/DataLoader";
import Header from "@/components/Header";
import { useMonthlyTransactions } from '@/hooks/useTransactions';
import { CalendarApi } from '@/services/ApiService';
import { useQuery } from '@tanstack/react-query';
import React from "react";
import { ScrollView, View } from "react-native";

const Calendar = () => {
  const currentMonth = new Date().toISOString().slice(0, 7);

  const {
    data: transactions = [],
    isLoading: isLoadingTransactions
  } = useMonthlyTransactions(currentMonth);

  const {
    data: upcomingBills = [],   // ← DEFAULT EMPTY ARRAY
    isLoading: isLoadingBills
  } = useQuery({
    queryKey: ['calendar', 'upcoming-bills'],
    queryFn: () => CalendarApi.getUpcomingBills().then(res => res.data || []),
    staleTime: 1000 * 60 * 10,
  });

  const isLoading = isLoadingTransactions || isLoadingBills;

  return (
    <DataLoader isLoading={isLoading}>
      <View style={{ flex: 1, backgroundColor: "#e6f5ee", paddingTop: 8 }}>
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
            padding: 16,
            paddingTop: 80,
            gap: 16,
          }}
          showsVerticalScrollIndicator={false}
        >
          <CalenderSection
            transactions={transactions}
            upcomingBills={upcomingBills}
            isLoading={isLoading}
          />
        </ScrollView>
      </View>
    </DataLoader>
  );
};

export default Calendar;