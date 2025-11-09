import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable, Text } from '@react-navigation/elements';
import { useLinkBuilder } from '@react-navigation/native';
import { View } from 'react-native';


export default function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const { buildHref } = useLinkBuilder();

    return (
        <View className='w-full flex justify-center  items-center p-2  h-[70px]  bg-white rounded-tl-[16px] rounded-tr-[16px] border-[#dfe4e3] border-t-[2px] border-l-[1px] border-r-[1px]' style={{ flexDirection: 'row' }}>
            {state.routes.map((route: any, index: number) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };
                // this is for icon
                const icon = {
                    index: (props: any) => <MaterialCommunityIcons
                        name="view-dashboard-outline"
                        size={24}
                        {...props}
                    />,
                    calendar: (props: any) => <Ionicons name="calendar-clear-outline" size={24} {...props} />,
                    insights: (props: any) => <MaterialCommunityIcons name="finance" size={24} {...props} />
                }
                return (
                    <PlatformPressable
                        className='flex justify-center items-center '
                        key={index}
                        href={buildHref(route.name, route.params)}
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarButtonTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={{ flex: 1, borderRadius: 12, height: "100%", backgroundColor: isFocused ? "#e7f4ee" : "transparent" }}
                    >
                        <Text>
                            {icon[route.name]({
                                color: isFocused ? "#4c8167" : "#68716c"
                            })}
                        </Text>
                        <Text style={{ fontWeight: 600, color: isFocused ? "#4c8167" : "#68716c" }}>
                            {label}
                        </Text>
                    </PlatformPressable>
                );
            })}
        </View>
    );
}