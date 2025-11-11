import { Images } from "@/assets";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { Dimensions, Image, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";

const { width } = Dimensions.get('window');

interface MenuDrawerProps {
    visible: boolean;
    onClose: () => void;
}

const MenuDrawer = ({ visible, onClose }: MenuDrawerProps) => {
    const translateX = useSharedValue(width);

    useEffect(() => {
        if (visible) {
            translateX.value = withSpring(0, {
                damping: 20,
                stiffness: 90
            });
        } else {
            translateX.value = withTiming(width, { duration: 250 });
        }
    }, [visible]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }]
        };
    });

    const menuItems = [
        { id: 1, title: 'How it Works' },
        { id: 2, title: 'Features' },
        { id: 3, title: 'Testimonials' },
        { id: 4, title: 'FAQ' }
    ];

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                {/* Backdrop */}
                <Pressable
                    style={styles.backdrop}
                    onPress={onClose}
                />

                {/* Drawer */}
                <Animated.View style={[styles.drawer, animatedStyle]}>
                    {/* Header */}
                    <View style={styles.drawerHeader}>
                        <View style={styles.logoContainer}>
                            <Image source={Images.header_img} style={styles.logoImage} />
                            <Text style={styles.brandName}>Granite</Text>
                        </View>
                        <Pressable onPress={onClose} style={styles.closeButton}>
                            <AntDesign name="close" size={24} color="#000000" />
                        </Pressable>
                    </View>

                    {/* Menu Items */}
                    <View style={styles.menuContainer}>
                        {menuItems.map((item) => (
                            <Pressable
                                key={item.id}
                                style={styles.menuItem}
                                onPress={() => {
                                    console.log(item.title);
                                    onClose();
                                }}
                            >
                                <Text style={styles.menuText}>{item.title}</Text>
                            </Pressable>
                        ))}
                    </View>

                    {/* Bottom Buttons */}
                    <View style={styles.buttonContainer}>
                        <Pressable
                            style={styles.logInButton}
                            onPress={() => {
                                console.log('Log In');
                                onClose();
                            }}
                        >
                            <Text style={styles.logInText}>Log In</Text>
                        </Pressable>

                        <Pressable
                            style={styles.signUpButton}
                            onPress={() => {
                                console.log('Sign Up');
                                onClose();
                            }}
                        >
                            <Text style={styles.signUpText}>Sign Up</Text>
                            <Ionicons name="arrow-forward" size={16} color="white" />
                        </Pressable>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

export default MenuDrawer;

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        flexDirection: 'row'
    },
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    drawer: {
        width: width * 0.85,
        maxWidth: 400,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: -2, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5
    },
    drawerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb'
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
    logoImage: {
        width: 40,
        height: 40
    },
    brandName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000000'
    },
    closeButton: {
        padding: 4
    },
    menuContainer: {
        flex: 1,
        paddingTop: 32
    },
    menuItem: {
        paddingHorizontal: 16,
        paddingVertical: 18
    },
    menuText: {
        fontSize: 16,
        color: '#000000',
        fontWeight: '400'
    },
    buttonContainer: {
        paddingHorizontal: 16,
        paddingBottom: 40,
        gap: 12
    },
    logInButton: {
        paddingVertical: 16,
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: '#10b981',
        alignItems: 'center'
    },
    logInText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#10b981'
    },
    signUpButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 16,
        borderRadius: 8,
        backgroundColor: '#10b981'
    },
    signUpText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff'
    }
});