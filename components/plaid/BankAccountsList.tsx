// components/plaid/BankAccountsList.tsx
import { MaterialIcons } from '@expo/vector-icons';
import React, { useRef } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface Account {
  id: string;
  name: string;
  mask?: string;
  type?: string;
  subtype?: string;
  current_balance?: number;
  currency_code?: string;
  institution_name?: string;
  official_name?: string;
}

interface BankAccountsListProps {
  accounts: Account[];
  onRefresh?: () => Promise<void>;
  refreshing?: boolean;
  onAccountPress?: (account: Account) => void;
  onConnectPress: () => void;
  isLoading?: boolean;
  error?: string | null;
}

const BankAccountsList: React.FC<BankAccountsListProps> = ({
  accounts = [],
  onRefresh,
  refreshing = false,
  onAccountPress,
  onConnectPress,
  isLoading = false,
  error = null,
}) => {
  const flatListRef = useRef<FlatList>(null);

  const formatCurrency = (amount?: number, currency: string = 'USD') => {
    if (amount === undefined || amount === null) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const renderAccountItem = ({ item }: { item: Account }) => (
    <TouchableOpacity
      style={styles.accountItem}
      onPress={() => onAccountPress?.(item)}
      activeOpacity={0.7}
    >
      <View style={styles.accountHeader}>
        <View style={styles.accountIcon}>
          <MaterialIcons name="account-balance" size={24} color="#4A6FA5" />
        </View>
        <View style={styles.accountInfo}>
          <Text style={styles.accountName} numberOfLines={1}>
            {item.name || item.official_name || 'Unnamed Account'}
          </Text>
          <Text style={styles.accountType} numberOfLines={1}>
            {item.institution_name ? `${item.institution_name} • ` : ''}
            {item.type ? `${item.type} • ` : ''}
            {item.mask ? `••••${item.mask}` : ''}
          </Text>
        </View>
      </View>
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceText}>
          {formatCurrency(item.current_balance, item.currency_code)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#4A6FA5" />
      ) : error ? (
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color="#EF4444" />
          <Text style={styles.errorText}>{error}</Text>
          {onRefresh && (
            <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={styles.emptyContent}>
          <MaterialIcons name="account-balance-wallet" size={48} color="#CCCCCC" />
          <Text style={styles.emptyText}>No bank accounts found</Text>
          <Text style={styles.emptySubtext}>
            Connect your bank to get started
          </Text>
          <TouchableOpacity
            style={styles.connectButton}
            onPress={onConnectPress}
            disabled={!onConnectPress}
          >
            <MaterialIcons name="add" size={20} color="#FFFFFF" />
            <Text style={styles.connectButtonText}>Connect Bank Account</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={accounts}
        renderItem={renderAccountItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContainer,
          (accounts.length === 0 || isLoading) && { flexGrow: 1 },
        ]}
        ListEmptyComponent={!isLoading ? renderEmptyState : null}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={!!refreshing}
              onRefresh={onRefresh}
              tintColor="#4A6FA5"
              colors={['#4A6FA5']}
            />
          ) : undefined
        }
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListFooterComponent={
          accounts.length > 0 ? (
            <TouchableOpacity
              style={styles.addAccountButton}
              onPress={onConnectPress}
              disabled={!onConnectPress}
            >
              <MaterialIcons name="add" size={20} color="#4A6FA5" />
              <Text style={styles.addAccountButtonText}>Add Another Account</Text>
            </TouchableOpacity>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  listContainer: {
    padding: 16,
  },
  accountItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 12,
  },
  accountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  accountIcon: {
    backgroundColor: '#E8EFF9',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A2B4D',
    marginBottom: 2,
  },
  accountType: {
    fontSize: 12,
    color: '#6B7280',
  },
  balanceContainer: {
    alignItems: 'flex-end',
  },
  balanceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A2B4D',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyContent: {
    alignItems: 'center',
    width: '100%',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 24,
  },
  errorContainer: {
    alignItems: 'center',
    width: '100%',
  },
  errorText: {
    color: '#EF4444',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 12,
    marginBottom: 16,
  },
  separator: {
    height: 12,
  },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4c8167',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
    opacity: 1,
  },
  connectButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
  },
  retryButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  retryButtonText: {
    color: '#4A6FA5',
    fontWeight: '600',
  },
  addAccountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    marginTop: 8,
  },
  addAccountButtonText: {
    color: '#4A6FA5',
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default BankAccountsList;