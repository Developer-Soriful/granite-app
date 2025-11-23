// components/plaid/BankAccountsList.tsx
import { formatCurrency } from '@/utils/format';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { usePlaid } from '../../context/PlaidContext';

export const BankAccountsList: React.FC = () => {
  const {
    accounts,
    isLoading,
    error,
    fetchAccounts,
    removePlaidItem,
    createUpdateLinkToken,
    fetchLinkToken,
    exchangePublicToken,
    linkToken
  } = usePlaid();
  const [refreshing, setRefreshing] = useState(false);

  const handleAddAccount = async () => {
    try {
      await fetchLinkToken();
      const { openLink } = require('react-native-plaid-link-sdk');

      openLink({
        tokenConfig: {
          token: linkToken,
          noLoadingState: true,
        },
        onSuccess: async (success: any) => {
          await exchangePublicToken(success.publicToken, success.metadata);
          await fetchAccounts(); // Refresh the accounts list
        },
        onExit: (exit: any) => {
          console.log('Plaid Link exit:', exit);
        },
      });
    } catch (error) {
      console.error('Error adding account:', error);
      Alert.alert('Error', 'Failed to connect bank account. Please try again.');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchAccounts();
    } catch (error) {
      console.error('Error refreshing accounts:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleRemoveAccount = async (itemId: string, institutionName: string) => {
    Alert.alert(
      'Remove Account',
      `Are you sure you want to remove ${institutionName}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await removePlaidItem(itemId);
              Alert.alert('Success', 'Account removed successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to remove account. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleUpdateAccount = async (itemId: string) => {
    try {
      const linkToken = await createUpdateLinkToken(itemId);
      const { openLink } = require('react-native-plaid-link-sdk');

      openLink({
        tokenConfig: {
          token: linkToken,
          noLoadingState: true,
        },
        onSuccess: async () => {
          await fetchAccounts();
        },
        onExit: (exit: any) => {
          console.log('Plaid Link exit:', exit);
        },
      });
    } catch (error) {
      console.error('Error updating account:', error);
      Alert.alert('Error', 'Failed to update account. Please try again.');
    }
  };

  const renderAccount = ({ item }: { item: any }) => (
    <View style={styles.accountCard}>
      <View style={styles.accountHeader}>
        <View style={styles.accountIcon}>
          <MaterialIcons name="account-balance" size={24} color="#4A90E2" />
        </View>
        <View style={styles.accountInfo}>
          <Text style={styles.accountName}>{item.institution_name || 'Bank Account'}</Text>
          <Text style={styles.accountType}>{item.name} •••• {item.mask || ''}</Text>
          <Text style={styles.accountBalance}>
            {formatCurrency(item.balances?.current || 0)}
          </Text>
        </View>
      </View>
      <View style={styles.accountActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleUpdateAccount(item.item_id)}
          disabled={isLoading}
        >
          <MaterialIcons name="edit" size={20} color="#4A90E2" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleRemoveAccount(item.item_id, item.institution_name || 'this account')}
          disabled={isLoading}
        >
          <MaterialIcons name="delete" size={20} color="#E74C3C" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchAccounts} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={accounts}
        renderItem={renderAccount}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#4A90E2']}
            tintColor="#4A90E2"
          />
        }
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>No bank accounts connected</Text>
            <TouchableOpacity
              onPress={handleAddAccount}
              style={styles.addButton}
              disabled={isLoading}
            >
              <Text style={styles.addButtonText}>+ Add Bank Account</Text>
            </TouchableOpacity>
          </View>
        }
        ListFooterComponent={
          accounts.length > 0 ? (
            <TouchableOpacity
              onPress={handleAddAccount}
              style={styles.addAnotherButton}
              disabled={isLoading}
            >
              <MaterialIcons name="add" size={20} color="#4A90E2" />
              <Text style={styles.addAnotherButtonText}>Add Another Account</Text>
            </TouchableOpacity>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  accountCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  accountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  accountIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F7FF',
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
    color: '#1A1A1A',
    marginBottom: 4,
  },
  accountType: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  accountBalance: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  accountActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
  },
  actionButton: {
    padding: 8,
    marginLeft: 12,
    backgroundColor: '#F5F7FA',
    borderRadius: 8,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#E74C3C',
    marginBottom: 16,
    textAlign: 'center',
  },
  emptyText: {
    color: '#999999',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#4A90E2',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  addButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  addAnotherButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#4A90E2',
    borderRadius: 8,
    marginTop: 8,
  },
  addAnotherButtonText: {
    color: '#4A90E2',
    marginLeft: 8,
    fontWeight: '600',
  },
});