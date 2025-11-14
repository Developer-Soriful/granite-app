import CalenderSection from "@/components/CalenderSection";
import Header from "@/components/Header";
import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Calendar = () => {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#e6f5ee", paddingTop: 8 }}
    >
      <View
        className="rounded-bl-[16px] rounded-br-[16px]"
        style={{
          position: "absolute",
          backgroundColor: "#e6f5ee",
          top: 16,
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
          paddingTop: 45,
          gap: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* this is for calender section here */}
        <CalenderSection />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Calendar;
