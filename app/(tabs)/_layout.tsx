import TabBar from "@/components/TabBar";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";

const ACTIVE_COLOR = '#4c8166';
const INACTIVE_COLOR = '#909a94';
const ACTIVE_BG_COLOR = '#e6f5ee';
const BORDER_COLOR = "#dfe4e3";

export default function TabLayout() {
    return (
        <Tabs
            tabBar={props => <TabBar {...props} />}
            screenOptions={{
                headerShown: false,
            }}
        >

            <Tabs.Screen
                name="index"
                options={{
                    title: "Dashboard",
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons
                            name="view-dashboard-outline"
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="calendar"
                options={{
                    title: "Calendar",
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="calendar-clear-outline" size={24} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="insights"
                options={{
                    title: "Insights",
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons name="finance" size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen name="settings" options={{
                title: "Settings",
                tabBarIcon: ({ color }) => (
                    <Ionicons name="settings-outline" size={24} color={color} />
                ),
            }} />
        </Tabs>
    );
}