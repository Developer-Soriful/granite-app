import ForecastFuture from "@/components/ForecastFuture";
import Header from "@/components/Header";
import RecentTransactionsHistory from "@/components/RecentTransactionsHistory";
import SpendingInsights from "@/components/SpendingInsights";
import SpendMoney from "@/components/SpendMoney";
import TransactionsOverview from "@/components/TransactionsOverview";
import { useRecentTransactions } from "@/hooks/useTransactions";
import { InsightsApi } from "@/services/ApiService";
import { useQuery } from "@tanstack/react-query";
import { ScrollView, StyleSheet, View } from "react-native";

function Dashboard() {
  const { data: transactions = [], isLoading: isLoadingTransactions } = useRecentTransactions();

  const { data: spendingData, isLoading: isLoadingSpending } = useQuery({
    queryKey: ['spending', 'overview'],
    queryFn: () => InsightsApi.getSpendingByCategory(
      new Date().toISOString().slice(0, 7)
    ).then(res => res.data),
  });
  return (
    <View style={styles.dailyBudgetContainer}>
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
        {/* If the Header component accepts a user prop, you can pass the name/email: */}
        {/* <Header userEmail={session?.user?.email} /> */}
        <Header />
      </View>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          padding: 16,
          display: "flex",
          paddingTop: 80,
          gap: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* How Much Can I Spend? section */}
        <SpendMoney
          balance={spendingData?.currentBalance}
          expenses={spendingData?.totalExpenses}
        />


        {/* Forecast Future Daily Budget section */}
        <View
          style={{
            backgroundColor: "#fefffe",
            borderRadius: 16,
          }}
        >
          {/* Placeholder data needs to be replaced with real financial data from Plaid */}
          <ForecastFuture currentAvg={50.25} numberOfDays={30} maxValue={200} />
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
          <RecentTransactionsHistory
            transactions={transactions}
            isLoading={isLoadingTransactions}
          />
        </View>
      </ScrollView>
    </View>
  );
}
export default Dashboard
const styles = StyleSheet.create({
  dailyBudgetContainer: {
    flex: 1,
    backgroundColor: "#e6f5ee",
    paddingTop: 8,
    fontFamily: "Instrument Sans",
  },
  // ... (rest of your styles are omitted for brevity, they remain unchanged)
  card: {
    backgroundColor: "#fefffe",
    borderRadius: 16,
    padding: 16,
    borderColor: "rgba(223, 229, 226, 1)",
    borderWidth: 1,
    width: "100%",
    gap: 16,
  },
  // ... (rest of the styles)
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