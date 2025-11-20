import { Images } from '@/assets';
import { useAuth } from '@/context/AuthContext'; // 👈 Auth Context Import
import { Feather, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Header = () => {
    // 1. Access user session state
    const { session, logout } = useAuth();

    // State management for UI
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [settingsModalVisible, setSettingsModalVisible] = useState(false);

    // Unused states for other modals are kept for structure but not directly relevant to auth
    const [avatarModalVisible, setAvatarModalVisible] = useState(false);
    const [supscriptionModalVisible, setSupscriptionModalVisible] = useState(false);

    const router = useRouter();
    // const navigation = useNavigation(); // Not strictly needed for Expo Router navigation

    const handleSettingsToggle = () => {
        setSettingsModalVisible(true);
    };

    const handleSettings = () => {
        setSettingsModalVisible(false); // Close modal on navigation
        router.push('/(tabs)/settings');
    };

    const handleLogout = async () => {
        // 2. Set loading state and close modal
        setSettingsModalVisible(false);
        setIsLoggingOut(true);

        try {
            logout()
            // Note: Router navigation is automatically handled by AuthContext 
            // when the session becomes null. Manual navigation is not needed here.

        } catch (error: any) {
            console.error('Logout Error:', error);
            Alert.alert('Logout Failed', 'Could not sign out. Please try again.');
        } finally {
            setIsLoggingOut(false);
        }
    };

    // Avatar and Subscription handlers (as provided)
    const handleAvater = () => {
        setAvatarModalVisible(false)
        router.push('/(settings)/avater')
    }
    const handleSupscription = () => {
        setSupscriptionModalVisible(false)
        router.push('/(settings)/subscription')
    }
    const handleNotification = () => {
        setSupscriptionModalVisible(false)
        router.push('/(settings)/notification')
    }

    // 4. Dynamically get the profile initial
    const userInitial = session?.user?.email ? session.user.email[0].toUpperCase() : 'G';

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
                            onPress={handleNotification}
                            style={{ position: "relative" }}
                        >
                            <Ionicons name="notifications-outline" size={24} color="black" />
                            <View style={styles.notificationBadge} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.profileContainer}>
                        <View style={styles.header_icon_text}>
                            {/* 5. Dynamic Profile Initial */}
                            <Text style={styles.profileInitial}>{userInitial}</Text>
                        </View>
                    </View>

                    <TouchableOpacity onPress={handleSettingsToggle}>
                        <MaterialIcons name="keyboard-arrow-down" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            </View>

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

                        {/* Avatar Button */}
                        <TouchableOpacity
                            style={styles.settingsButton}
                            onPress={handleAvater}
                        >
                            <Feather name="camera" size={20} color="black" />
                            <Text style={styles.settingsButtonText}>Avatar</Text>
                        </TouchableOpacity>

                        {/* Subscription Button (Corrected typo) */}
                        <TouchableOpacity
                            style={styles.settingsButton}
                            onPress={handleSupscription}
                        >
                            <FontAwesome5 name="user-edit" size={20} color="black" />
                            <Text style={styles.settingsButtonText}>Subscription</Text>
                        </TouchableOpacity>

                        {/* Logout Button */}
                        <TouchableOpacity
                            style={[styles.settingsButton, styles.logoutButton]}
                            onPress={handleLogout}
                            disabled={isLoggingOut} // Disable during logout process
                        >
                            {/* Show loading spinner while logging out */}
                            {isLoggingOut ? (
                                <ActivityIndicator size="small" color="#DC2626" />
                            ) : (
                                <Ionicons name="log-out-outline" size={20} color="#DC2626" />
                            )}
                            <Text style={[styles.settingsButtonText, styles.logoutText]}>
                                {isLoggingOut ? 'Logging out...' : 'Logout'}
                            </Text>
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