// components/plaid/TransactionsList.tsx
import { usePlaid } from '@/context/PlaidContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface Transaction {
    id: string;
    name: string;
    amount: number;
    date: string;
    category: string[];
    pending: boolean;
    merchant_name: string | null;
}

interface TransactionsListProps {
    onTransactionPress?: (transactionId: string) => void;
    itemCount?: number; // Optional limit on number of transactions to show
}

export const TransactionsList: React.FC<TransactionsListProps> = ({
    onTransactionPress,
    itemCount,
}) => {
    // const { transactions, isLoading, error, refetch } = usePlaidTransactions();
    const { transactions, isLoading, error, fetchTransactions } = usePlaid();


    const renderTransaction = ({ item }: { item: Transaction }) => {


        const accounts = item.accounts.map((data: any) => data)
        const isNegative = item.accounts[0].balances.current < 0;
        const amountColor = isNegative ? '#E74C3C' : '#2ECC71';
        const amountSign = isNegative ? '-' : '+';
        const displayName = item.accounts[0].name || item.accounts[0].official_name;
                const balance = item.accounts[0].balances.current 
        const formattedDate = new Date(item.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        });

        return (
            <View style={styles.transactionItem}>
                <View style={styles.transactionIcon}>
                 <MaterialCommunityIcons name="bank-outline" size={24} color={amountColor}  />
                </View>
                <View style={styles.transactionDetails}>
                    <Text style={styles.transactionName} numberOfLines={1}>
                        {displayName}
                    </Text>
                    <Text style={styles.transactionCategory}>
                        {item.status || 'Uncategorized'}
                    </Text>
                </View>
                <View style={styles.transactionAmountContainer}>
                    <Text style={[styles.transactionAmount, { color: amountColor }]}>
                       {balance < 0? `-` : `+`} ${balance}
                    </Text>
                    <Text style={styles.transactionDate}>{formattedDate}</Text>
                </View>
            </View>
        );
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>
                    Failed to load transactions. Please try again.
                </Text>
                <TouchableOpacity
                    onPress={() => {
                        // Get date range for last 30 days
                        const endDate = new Date().toISOString().split('T')[0];
                        const startDate = new Date();
                        startDate.setDate(startDate.getDate() - 30);
                        const startDateStr = startDate.toISOString().split('T')[0];

                        fetchTransactions(startDateStr, endDate);
                    }}
                    style={styles.retryButton}>
                    <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const displayedTransactions = itemCount
        ? transactions.slice(0, itemCount)
        : transactions;
    const handleRefresh = () => {
        const today = new Date().toISOString().split('T')[0];
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const startDate = thirtyDaysAgo.toISOString().split('T')[0];

        return fetchTransactions(startDate, today);
    };



    return (
        <FlatList
            data={displayedTransactions}
            renderItem={renderTransaction}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            refreshControl={
                <RefreshControl
                    refreshing={isLoading}
                    onRefresh={handleRefresh}
                    colors={['#0000ff']}
                    tintColor="#0000ff"
                />
            }
            ListEmptyComponent={
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No transactions found</Text>
                </View>
            }
        />
    );
};

const styles = StyleSheet.create({
    listContainer: {
        padding: 16,
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    transactionIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    transactionIconText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    transactionDetails: {
        flex: 1,
        marginRight: 12,
    },
    transactionName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginBottom: 2,
    },
    transactionCategory: {
        fontSize: 12,
        color: '#666',
    },
    transactionAmountContainer: {
        alignItems: 'flex-end',
    },
    transactionAmount: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    transactionDate: {
        fontSize: 12,
        color: '#999',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: '#E74C3C',
        marginBottom: 10,
        textAlign: 'center',
    },
    retryButton: {
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    retryButtonText: {
        color: '#333',
        fontWeight: '500',
    },
    emptyContainer: {
        padding: 20,
        alignItems: 'center',
    },
    emptyText: {
        color: '#666',
        fontSize: 16,
    },
});