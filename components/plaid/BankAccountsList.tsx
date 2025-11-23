// components/plaid/BankAccountsList.tsx  ← EI FILE TA PURA REPLACE KOR
import { formatCurrency } from '@/utils/format';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { usePlaid } from '../../context/PlaidContext';

export const BankAccountsList = () => {
  const { accounts, isLoading, error, fetchAccounts, connectBank, reconnectBank, removeBank } = usePlaid();

  const onRefresh = () => fetchAccounts();

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.icon}>
          <MaterialIcons name="account-balance" size={28} color="#4A90E2" />
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{item.institution_name}</Text>
          <Text style={styles.type}>{item.name} ••••{item.mask}</Text>
          <Text style={styles.balance}>{formatCurrency(item.balances.current || 0)}</Text>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => reconnectBank(item.item_id)} disabled={isLoading}>
          <MaterialIcons name="sync" size={22} color="#4A90E2" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => removeBank(item.item_id)} disabled={isLoading}>
          <MaterialIcons name="delete" size={22} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
        <TouchableOpacity onPress={fetchAccounts} style={styles.btn}>
          <Text style={styles.btnText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={accounts || []}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} />}
      ListEmptyComponent={
        <View style={styles.center}>
          <Text style={styles.empty}>No bank accounts connected</Text>
          <TouchableOpacity onPress={connectBank} style={styles.addBtn}>
            <Text style={styles.addBtnText}>+ Connect Bank Account</Text>
          </TouchableOpacity>
        </View>
      }
      ListFooterComponent={
        accounts?.length > 0 ? (
          <TouchableOpacity onPress={connectBank} style={styles.footerBtn}>
            <MaterialIcons name="add" size={20} color="#10b981" />
            <Text style={styles.footerText}>Add Another Account</Text>
          </TouchableOpacity>
        ) : null   // ← null diye dibi, false na!
      }
    />
  );
};

// components/plaid/BankAccountsList.tsx → styles (full copy-paste kor)

const styles = StyleSheet.create({
  // Main card
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },

  // Header (icon + info)
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  icon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EBF5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },

  info: {
    flex: 1,
  },

  name: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },

  type: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 6,
    fontWeight: '500',
  },

  balance: {
    fontSize: 20,
    fontWeight: '800',
    color: '#10b981', // emerald-500
  },

  // Action buttons (Reconnect + Delete)
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    gap: 20,
  },

  // Empty state
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },

  empty: {
    fontSize: 18,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 26,
  },

  error: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 20,
  },

  // Connect Bank Button (Empty State)
  addBtn: {
    backgroundColor: '#10b981',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },

  addBtnText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },

  // Add Another Account (Footer)
  footerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginHorizontal: 16,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#10b981',
    borderRadius: 14,
    backgroundColor: '#f0fdf4',
  },

  footerText: {
    color: '#10b981',
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 8,
  },

  // Retry button (error state)
  btn: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 12,
  },

  btnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});