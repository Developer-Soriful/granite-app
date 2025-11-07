import React from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'

const ForecastFuture = () => {
    return (
        <View style={styles.container}>
            <View style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                gap: 8
            }}>
                <Text style={styles.title}>Forecast Future Daily Budget</Text>
                <Text style={{ fontSize: 14, color: "rgba(67, 77, 72, 1)" }}>Planning to spend more (or less) than usual today? Enter the amount to see how it will change your daily budget.</Text>
            </View>
            <View style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 6
            }}>
                <TextInput
                    placeholder="$ Enter amount spent today"
                    placeholderTextColor="rgba(145, 154, 149, 1)"
                    style={styles.input}
                />
                <View style={{
                    backgroundColor: "rgba(77, 128, 102, 1)",
                    paddingLeft: 20,
                    paddingRight: 20,
                    paddingTop: 12,
                    paddingBottom: 12,
                    borderRadius: 12,
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                    <Text style={{ fontSize: 14, fontWeight: "600", color: "#fff" }}>Calculate</Text>
                </View>
            </View>
        </View>
    )
}

export default ForecastFuture

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
        fontSize: 20,
        fontWeight: "600",
        color: "#000",
    },
    input: {
        width: "100%",
        height: 56,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "rgba(223, 229, 226, 1)",
        color: "#000",
        padding: 16,
        fontSize: 16,
    },
})