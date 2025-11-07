import ForecastFuture from "@/components/ForecastFuture";
import RecentTransactionsHistory from "@/components/RecentTransactionsHistory";
import SpendingInsights from "@/components/SpendingInsights";
import SpendMoney from "@/components/SpendMoney";
import TransactionsOverview from "@/components/TransactionsOverview";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type BudgetComparisonProps = {
  currentAvg: number;
  newAvg: number;
  maxValue?: number;
};
export default function Dashboard({ currentAvg,
  newAvg,
  maxValue, }: BudgetComparisonProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const toggleTooltip = () => {
    setShowTooltip((prev) => !prev);
  };

  const scale = maxValue || Math.max(currentAvg, newAvg, 200);

  // Use device width minus padding
  const screenWidth = Dimensions.get("window").width;
  const barMaxWidth = screenWidth - 64; // 16px padding left + 16px padding right + some margin

  const currentWidth = (currentAvg / scale) * barMaxWidth;
  const newWidth = (newAvg / scale) * barMaxWidth;

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#e6f5ee", paddingTop: 8 }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          padding: 16,
          paddingTop: 70,
          gap: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* How Much Can I Spend? section */}
        <SpendMoney />

        {/* Forecast Future Daily Budget section */}
        <View style={{
          backgroundColor: "#fefffe",
          borderRadius: 16,
        }}>
          <ForecastFuture />

          <View style={{ paddingHorizontal: 16, paddingBottom: 16, display: "flex", flexDirection: "column", gap: 16 }}>
            {/* New Average Daily Budget card */}
            <View style={styles.dailyBudgetContainer}>
              <View>
                <Text style={{ fontSize: 16, fontWeight: "600" }}>New Average Daily Budget</Text>
                <Text style={{ fontSize: 24, fontWeight: "600" }}>$172.00</Text>
              </View>
              <View style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
              }}>
                <AntDesign name="arrow-up" size={24} color="rgba(92, 153, 124, 1)" />
                <Text style={{ fontSize: 14, color: "rgba(92, 153, 124, 1)" }}>$80 higher than your current average daily budget</Text>
              </View>
            </View>
            {/* this is for daily budget comparison card */}
            <View style={styles.card}>
              <Text className="text-[16px] font-semibold ">Daily Budget Comparison</Text>

              <View style={styles.barsContainer}>
                <View className="flex flex-col gap-[6px] border-l-[2px] border-b-[2px] pb-[2px] border-[#ccc] pl-[0.5px]">
                  {/* Current Avg Bar */}
                  <View style={[styles.bar, { width: currentWidth, backgroundColor: "rgba(54, 120, 179, 1)" }]} />

                  {/* New Avg Bar */}
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={toggleTooltip}
                    style={[styles.bar, { width: newWidth, backgroundColor: "rgba(92, 153, 124, 1)" }]}
                  >
                    {showTooltip && (
                      <View style={[styles.tooltip, { right: -10 }]}>
                        <Text style={styles.tooltipText}>New Avg. ${newAvg}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </View>

                {/* X-axis */}
                <View style={styles.xAxis}>
                  {[0, 50, 100, 150, 200].map((val) => (
                    <Text key={val} style={styles.xAxisLabel}>${val}</Text>
                  ))}
                </View>
              </View>

              {/* Labels */}
              <View style={styles.labelsContainer}>
                <View style={styles.label}>
                  <View style={[styles.dot, { backgroundColor: "#3778b2" }]} />
                  <Text className="text-sm font-semibold">Current Avg.</Text>
                </View>
                <View style={styles.label}>
                  <View style={[styles.dot, { backgroundColor: "#5d987c" }]} />
                  <Text className="text-sm font-semibold">New Avg. (Forecast)</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        {/* this is for Spending Insights */}
        <View>
          <SpendingInsights />
        </View>
        {/* this is for Transactions Overview card */}
        <View>
          <TransactionsOverview />
        </View>
        {/* this is for Recent Transactions History */}
        <View>
          <RecentTransactionsHistory />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  dailyBudgetContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingLeft: 18,
    paddingRight: 18,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: "#fefffe",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(143, 192, 169, 1)",
    width: "100%",
    gap: 8,
  },
  card: {
    backgroundColor: "#fefffe",
    borderRadius: 16,
    padding: 16,
    borderColor: "rgba(223, 229, 226, 1)",
    borderWidth: 1,
    width: "100%",
    gap: 16,
  },
  barsContainer: {
    flexDirection: "column",
    gap: 6,
    position: "relative",
  },
  bar: {
    height: 24,
    borderEndStartRadius: 8,
    borderEndEndRadius: 8,
    justifyContent: "center",
  },
  tooltip: {
    position: "absolute",
    top: -30,
    backgroundColor: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  tooltipText: {
    fontSize: 12,
    fontWeight: "600",
  },
  labelsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  xAxis: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  xAxisLabel: {
    fontSize: 12,
    color: "#666",
  },
});
