import { Images } from '@/assets';
import { MaterialIcons } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useState } from 'react';
import { Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Header = () => {
    const [modalVisible, setModalVisible] = useState(false);

    // Sample notification data - Replace with your API data
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

    return (
        <>
            <View style={styles.header}>
                {/* this is for icon image */}
                <View style={styles.header_img}>
                    <Image source={Images.header_img} />
                    <Text style={styles.header_text}>Granite</Text>
                </View>

                {/* this is for notification profile and arrow icon part */}
                <View style={styles.header_icon}>
                    <View style={{
                        borderRightColor: "#dfe4e3",
                        borderRightWidth: 1,
                        paddingRight: 8
                    }}>
                        <TouchableOpacity
                            onPress={() => setModalVisible(true)}
                            style={{ position: "relative" }}
                        >
                            <Ionicons name="notifications-outline" size={24} color="black" />
                            <Text style={{
                                position: "absolute",
                                top: 4,
                                right: 4,
                                backgroundColor: "#e55c17",
                                color: "white",
                                borderRadius: 100,
                                padding: 2,
                                height: 6,
                                width: 6,
                                borderColor: "white",
                                borderWidth: 1
                            }}></Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ paddingLeft: 8 }}>
                        <View style={styles.header_icon_text}>
                            <Text style={{
                                fontWeight: "bold",
                                color: "white"
                            }}>M</Text>
                        </View>
                    </View>
                    <MaterialIcons name="keyboard-arrow-down" size={24} color="black" />
                </View>
            </View>

            {/* Notification Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setModalVisible(false)}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={(e) => e.stopPropagation()}
                    >
                        <View style={styles.modalContent}>
                            {/* Modal Header */}
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Notifications</Text>
                                <TouchableOpacity
                                    onPress={() => setModalVisible(false)}
                                    style={styles.closeButton}
                                >
                                    <Ionicons name="close" size={24} color="#6B7280" />
                                </TouchableOpacity>
                            </View>

                            {/* Notifications List */}
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
        borderRadius: 16
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
    // Modal Styles
    modalOverlay: {
        flex: 1,
        paddingTop: 61,
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
});