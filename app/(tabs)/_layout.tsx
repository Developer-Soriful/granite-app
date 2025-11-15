import TabBar from "@/components/TabBar";
import { useBackHandler } from "@/hooks/useBackButton";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";

export default function TabLayout() {
    useBackHandler();
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
                    tabBarIcon: ({ color }: { color: string }) => (
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
                    tabBarIcon: ({ color }: { color: string }) => (
                        <Ionicons name="calendar-clear-outline" size={24} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="insights"
                options={{
                    title: "Insights",
                    tabBarIcon: ({ color }: { color: string }) => (
                        <MaterialCommunityIcons name="finance" size={24} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="settings"
                options={{
                    title: "Settings",
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="settings-outline" size={24} color={color} />
                    ),
                    tabBarButton: () => null,
                }}
            />
        </Tabs>
    );
}