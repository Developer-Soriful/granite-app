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
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: ACTIVE_COLOR,
                tabBarInactiveTintColor: INACTIVE_COLOR,
                tabBarActiveBackgroundColor: '#e7f4ee',
                tabBarInactiveBackgroundColor: 'transparent',
                tabBarStyle: {
                    borderTopWidth: 2,
                    elevation: 0,
                    backgroundColor: 'white',
                    borderColor: BORDER_COLOR,
                    borderLeftWidth: 1,
                    borderRightWidth: 1,
                    borderBottomWidth: 0,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    overflow: "hidden",
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                    borderRadius: 8
                },
                tabBarItemStyle: {
                    padding: 8,
                    height: 70,
                    borderRadius: 12
                }
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