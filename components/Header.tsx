import { Images } from '@/assets';
import { MaterialIcons } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Header = () => {
    const [notificationModalVisible, setNotificationModalVisible] = useState(false);
    const [settingsModalVisible, setSettingsModalVisible] = useState(false);

    const handleSettingsToggle = () => {
        setSettingsModalVisible(true);
    };

    // Sample notification data
    const notifications = [
        {
            id: 1,
            type: 'alert',
            title: 'Daily spending alert',
            message: 'Your spending today has exceeded your daily budget. You\'ve spent $25 more than planned.',
            date: 'September 26, 2025',
            isAlert: true
        },
        {
            id: 2,
            type: 'success',
            title: "You're doing great!",
            message: "Nice job! Your spending today is lower than your daily average.",
            date: 'September 25, 2025',
            isAlert: false
        },
        {
            id: 3,
            type: 'alert',
            title: 'Daily spending alert',
            message: "Your spending today has exceeded your daily budget. You've spent $58 more than planned.",
            date: 'September 24, 2025',
            isAlert: true
        }
    ];

    const handleSettings = () => {
        console.log('Settings pressed');
        router.push('/(tabs)/settings')
    };

    const handleLogout = () => {
        console.log('Logout pressed');
        // Add your logout logic here
        setSettingsModalVisible(false);
    };

    return (
        <>
            <View style={styles.header}>
                {/* Logo Section */}
                <View style={styles.header_img}>
                    <Image source={Images.header_img} />
                    <Text className='font-sans-condensed font-bold' style={styles.header_text}>Granite</Text>
                </View>

                {/* Icons Section */}
                <View style={styles.header_icon}>
                    <View style={styles.notificationContainer}>
                        <TouchableOpacity
                            onPress={() => setNotificationModalVisible(true)}
                            style={{ position: "relative" }}
                        >
                            <Ionicons name="notifications-outline" size={24} color="black" />
                            <View style={styles.notificationBadge} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.profileContainer}>
                        <View style={styles.header_icon_text}>
                            <Text style={styles.profileInitial}>M</Text>
                        </View>
                    </View>

                    <TouchableOpacity onPress={handleSettingsToggle}>
                        <MaterialIcons name="keyboard-arrow-down" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Notification Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={notificationModalVisible}
                onRequestClose={() => setNotificationModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setNotificationModalVisible(false)}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={(e) => e.stopPropagation()}
                    >
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Notifications</Text>
                                <TouchableOpacity
                                    onPress={() => setNotificationModalVisible(false)}
                                    style={styles.closeButton}
                                >
                                    <Ionicons name="close" size={24} color="#6B7280" />
                                </TouchableOpacity>
                            </View>

                            <ScrollView
                                style={styles.notificationsList}
                                showsVerticalScrollIndicator={false}
                            >
                                {notifications.map((notification, index) => (
                                    <View
                                        key={notification.id}
                                        style={[
                                            styles.notificationItem,
                                            index !== notifications.length - 1 && styles.notificationBorder
                                        ]}
                                    >
                                        <View style={styles.notificationHeader}>
                                            <Text style={styles.notificationTitle}>
                                                {notification.title}
                                            </Text>
                                            <Text style={styles.notificationDate}>
                                                {notification.date}
                                            </Text>
                                        </View>
                                        <Text style={styles.notificationMessage}>
                                            {notification.message}
                                        </Text>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

            {/* Settings Modal - Slides from right */}
            <Modal
                animationType='slide'
                transparent={true}
                visible={settingsModalVisible}
                onRequestClose={() => setSettingsModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.settingsModalOverlay}
                    activeOpacity={1}
                    onPress={() => setSettingsModalVisible(false)}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={(e) => e.stopPropagation()}
                        style={styles.settingsModalContent}
                    >
                        {/* Settings Button */}
                        <TouchableOpacity
                            style={styles.settingsButton}
                            onPress={handleSettings}
                        >
                            <Ionicons name="settings-outline" size={20} color="#111827" />
                            <Text style={styles.settingsButtonText}>Settings</Text>
                        </TouchableOpacity>

                        {/* Logout Button */}
                        <TouchableOpacity
                            style={[styles.settingsButton, styles.logoutButton]}
                            onPress={handleLogout}
                        >
                            <Ionicons name="log-out-outline" size={20} color="#DC2626" />
                            <Text style={[styles.settingsButtonText, styles.logoutText]}>Logout</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </>
    );
};

export default Header;

const styles = StyleSheet.create({
    header: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 12,
        backgroundColor: "#fefffe",
        borderRadius: 16,
    },
    header_img: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8
    },
    header_text: {
        fontSize: 20,
        fontWeight: "bold",
    },
    header_icon: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 8
    },
    header_icon_text: {
        fontWeight: "bold",
        borderRadius: 100,
        backgroundColor: "rgba(54, 120, 179, 1)",
        padding: 8,
        height: 32,
        width: 32,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    profileInitial: {
        fontWeight: "bold",
        color: "white"
    },
    notificationContainer: {
        borderRightColor: "#dfe4e3",
        borderRightWidth: 1,
        paddingRight: 8
    },
    notificationBadge: {
        position: "absolute",
        top: 4,
        right: 4,
        backgroundColor: "#e55c17",
        borderRadius: 100,
        padding: 2,
        height: 6,
        width: 6,
        borderColor: "white",
        borderWidth: 1
    },
    profileContainer: {
        paddingLeft: 8
    },

    // Notification Modal Styles
    modalOverlay: {
        flex: 1,
        paddingTop: 73,
        paddingHorizontal: 16,
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 16,
        width: '100%',
        alignSelf: 'flex-end',
        marginRight: 0,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    closeButton: {
        padding: 4,
    },
    notificationsList: {
        maxHeight: 500,
    },
    notificationItem: {
        padding: 20,
        paddingTop: 16,
        paddingBottom: 16,
    },
    notificationBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    notificationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
        gap: 12,
    },
    notificationTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
        flex: 1,
    },
    notificationDate: {
        fontSize: 12,
        color: '#919b94',
        marginTop: 2,
    },
    notificationMessage: {
        fontSize: 14,
        color: '#434c49',
        lineHeight: 20,
    },

    // Settings Modal Styles
    settingsModalOverlay: {
        flex: 1,
        alignItems: 'flex-end',
        paddingTop: 73,
        paddingRight: 16,
    },
    settingsModalContent: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 8,
        width: 160,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    settingsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        gap: 12,
    },
    logoutButton: {
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    settingsButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#111827',
    },
    logoutText: {
        color: '#DC2626',
    },
});