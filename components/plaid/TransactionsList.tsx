// components/plaid/TransactionsList.tsx
import { MaterialIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import React from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

interface Transaction {
    id: string;
    name: string;
    amount: number;
    date: string;
    category: string[];
    pending: boolean;
    merchant_name: string | null;
}

interface TransactionsListProps {
    transactions: Transaction[];
    onTransactionPress?: (transactionId: string) => void;
    onRefresh?: () => void;
    refreshing?: boolean;
}

export const TransactionsList: React.FC<TransactionsListProps> = ({
    transactions,
    onTransactionPress,
    onRefresh,
    refreshing = false,
}) => {
    const renderTransaction = ({ item }: { item: Transaction }) => {
        const isNegative = item.amount < 0;
        const amountColor = isNegative ? '#E74C3C' : '#2ECC71';
        const amountSign = isNegative ? '-' : '+';
        const displayName = item.merchant_name || item.name;

        return (
            <View style={styles.transactionItem}>
                <View style={styles.transactionIcon}>
                    <MaterialIcons
                        name={isNegative ? "arrow-upward" : "arrow-downward"}
                        size={20}
                        color="#4A90E2"
                    />
                </View>
                <View style={styles.transactionDetails}>
                    <Text style={styles.transactionName} numberOfLines={1}>
                        {displayName}
                    </Text>
                    <Text style={styles.transactionCategory} numberOfLines={1}>
                        {item.category?.[0] || 'Uncategorized'}
                    </Text>
                    <Text style={styles.transactionDate}>
                        {format(new Date(item.date), 'MMM d, yyyy')}
                        {item.pending && ' • Pending'}
                    </Text>
                </View>
                <Text style={[styles.transactionAmount, { color: amountColor }]}>
                    {amountSign}${Math.abs(item.amount).toFixed(2)}
                </Text>
            </View>
        );
    };

    return (
        <FlatList
            data={transactions}
            renderItem={renderTransaction}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            refreshControl={
                onRefresh ? (
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#4A90E2']}
                        tintColor="#4A90E2"
                    />
                ) : undefined
            }
            ListEmptyComponent={
                <View style={styles.emptyContainer}>
                    <MaterialIcons name="receipt" size={48} color="#ccc" />
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
        borderBottomColor: '#F0F0F0',
    },
    transactionIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#EFF4FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    transactionDetails: {
        flex: 1,
        marginRight: 8,
    },
    transactionName: {
        fontSize: 15,
        fontWeight: '500',
        color: '#1A1A1A',
        marginBottom: 2,
    },
    transactionCategory: {
        fontSize: 13,
        color: '#666',
        marginBottom: 2,
    },
    transactionDate: {
        fontSize: 12,
        color: '#999',
    },
    transactionAmount: {
        fontSize: 16,
        fontWeight: '600',
    },
    emptyContainer: {
        padding: 32,
        alignItems: 'center',
        justifyContent: 'center'
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
});