import TabBar from "@/components/TabBar";
import { useBackHandler } from "@/hooks/useBackButton";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";
import { View } from 'react-native';

export default function TabLayout() {
    useBackHandler();

    return (
        <View style={{ flex: 1, paddingBottom: 4, backgroundColor: "white" }}>
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: {
                        paddingBottom: 8,
                        paddingTop: 8,
                    },
                    tabBarLabelStyle: {
                        fontSize: 12,
                    },
                }}
                tabBar={props => <TabBar {...props} />}
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
                        tabBarIcon: ({ color }: { color: string }) => (
                            <Ionicons name="settings-outline" size={24} color={color} />
                        ),
                        tabBarButton: () => null,
                    }}
                />
                <Tabs.Screen
                    name="bank/index"
                    options={{
                        title: 'Accounts',
                        tabBarIcon: ({ color }) => (
                            <MaterialCommunityIcons name="bank-outline" size={24} color={color} />
                        ),
                    }}
                />
            </Tabs>
        </View>
    );
}