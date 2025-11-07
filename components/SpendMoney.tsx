import { Images } from '@/assets'
import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'

const SpendMoney = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>How Much Can I Spend?</Text>
            <View style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                width: "100%"
            }}>
                {/* this is for day week and month spend money */}
                <View style={styles.dayWeekMonthContainer}>
                    <Text style={styles.dayWeekMonthText}>Today</Text>
                    <Text style={styles.dayWeekMonthText}>This Week</Text>
                    <Text style={styles.dayWeekMonthText}>This Month</Text>
                </View>
                {/* this is for money container */}
                <View style={styles.moneyContainer}>
                    <View>
                        <Text style={styles.moneyText}>$73.00</Text>
                        <Text style={{ fontSize: 14, color: "#000" }}>Available Spending</Text>
                    </View>
                    <View style={{
                        width: 60,
                        height: 60,
                        borderRadius: 12,
                        backgroundColor: "rgba(143, 192, 169, 0.2)",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <Image source={Images.wallet} />
                    </View>
                </View>
            </View>
        </View>
    )
}

export default SpendMoney

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        padding: 16,
        backgroundColor: "#fefffe",
        borderRadius: 16,
        gap: 16
    },
    title: {
        fontSize: 24,
        fontWeight: "600",
        color: "#000",
    },
    dayWeekMonthContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 4,
        backgroundColor: "#fefffe",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#dfe4e3",
        width: "100%",
        gap: 4
    },
    moneyContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingLeft: 18,
        paddingRight: 18,
        paddingTop: 12,
        paddingBottom: 12,
        backgroundColor: "#fefffe",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "rgba(143, 192, 169, 1)",
        width: "100%",
    },
    moneyText: {
        fontSize: 32,
        fontWeight: "600",
        color: "rgba(77, 128, 102, 1)",
    },
    dayWeekMonthText: {
        flex: 1,
        fontSize: 14,
        fontWeight: "600",
        color: "#000",
        backgroundColor: "rgba(240, 245, 243, 1)",
        borderColor: "#e7f4ee",
        borderWidth: 1,
        paddingVertical: 8,
        textAlign: "center",
        borderRadius: 8,
        overflow: "hidden",
        minWidth: 0
    },
});