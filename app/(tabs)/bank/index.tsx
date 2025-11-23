// app/(tabs)/bank/index.tsx
import { format, subMonths } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BankAccountsList } from '../../../components/plaid/BankAccountsList';
import { TransactionsList } from '../../../components/plaid/TransactionsList';
import { usePlaid } from '../../../context/PlaidContext';

const BankScreen = () => {
    const {
        accounts,
        transactions,
        fetchAccounts,
        fetchTransactions,
        isLoading
    } = usePlaid();
    const [activeTab, setActiveTab] = useState<'accounts' | 'transactions'>('accounts');
    const [refreshing, setRefreshing] = useState(false);
    // Initial data fetch
    useEffect(() => {
        const loadData = async () => {
            try {
                await Promise.all([fetchAccounts(), fetchTransactionsData()]);
            } catch (error) {
                console.error('Error loading data:', error);
            }
        };

        loadData();
    }, []);

    const fetchTransactionsData = async () => {
        const now = new Date();
        const thirtyDaysAgo = subMonths(now, 1);
        const startDate = format(thirtyDaysAgo, 'yyyy-MM-dd');
        const endDate = format(now, 'yyyy-MM-dd');

        await fetchTransactions(startDate, endDate);
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            if (activeTab === 'accounts') {
                await fetchAccounts();
            } else {
                await fetchTransactionsData();
            }
        } catch (error) {
            console.error('Error refreshing data:', error);
        } finally {
            setRefreshing(false);
        }
    };

    const handleSuccess = () => {
        // Refresh data after successful account connection
        fetchAccounts().catch(console.error);
        fetchTransactionsData().catch(console.error);
    };

    return (
        <View style={styles.container}>
            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'accounts' && styles.activeTab]}
                    onPress={() => setActiveTab('accounts')}
                >
                    <Text style={[styles.tabText, activeTab === 'accounts' && styles.activeTabText]}>
                        Accounts ({accounts.length})
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tab, activeTab === 'transactions' && styles.activeTab]}
                    onPress={() => setActiveTab('transactions')}
                >
                    <Text style={[styles.tabText, activeTab === 'transactions' && styles.activeTabText]}>
                        Transactions
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                {activeTab === 'accounts' ? (
                    <BankAccountsList />
                ) : (
                    <TransactionsList
                        transactions={transactions}
                        onRefresh={handleRefresh}
                        refreshing={refreshing}
                    />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    content: {
        flex: 1,
    },
    tabs: {
        flexDirection: 'row',
        borderBottomWidth: 2,
        borderBottomColor: '#E0E0E0',
        backgroundColor: '#fff',
    },
    tab: {
        flex: 1,
        paddingVertical: 16,
        alignItems: 'center',
        borderBottomColor: 'transparent',
    },
    activeTab: {
        backgroundColor: "#e6f5ee",
        borderTopEndRadius: 12,
        borderTopStartRadius: 12,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#68716c',
    },
    activeTabText: {
        color: '#4c8167',
    },
    addButton: {
        marginRight: 16,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
});

export default BankScreen;