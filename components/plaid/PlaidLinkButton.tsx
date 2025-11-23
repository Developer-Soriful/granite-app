// components/plaid/PlaidLinkButton.tsx
import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinkExit, LinkSuccess } from 'react-native-plaid-link-sdk';
import { usePlaid } from '../../context/PlaidContext';

interface PlaidLinkButtonProps {
  onSuccess?: (success: LinkSuccess) => void;
  onExit?: (exit: LinkExit) => void;
  style?: object;
  text?: string;
  variant?: 'primary' | 'secondary';
}

export const PlaidLinkButton: React.FC<PlaidLinkButtonProps> = ({
  onSuccess,
  onExit,
  style,
  text = 'Connect Bank Account',
  variant = 'primary',
}) => {
  const {
    linkToken,
    isLoading,
    fetchLinkToken,
    exchangePublicToken
  } = usePlaid();

  useEffect(() => {
    if (!linkToken && !isLoading) {
      fetchLinkToken().catch(console.error);
    }
  }, [linkToken, isLoading, fetchLinkToken]);

  const handlePress = async () => {
    if (!linkToken) {
      console.warn('Link token not ready');
      return;
    }

    try {
      const { openLink } = require('react-native-plaid-link-sdk');
      openLink({
        tokenConfig: {
          token: linkToken,
          noLoadingState: true,
        },
        onSuccess: async (success: LinkSuccess) => {
          try {
            await exchangePublicToken(success.publicToken, success.metadata);
            onSuccess?.(success);
          } catch (err) {
            console.error('Error handling success:', err);
          }
        },
        onExit: (exit: LinkExit) => {
          console.log('Plaid Link exit:', exit);
          onExit?.(exit);
        },
      });
    } catch (err) {
      console.error('Error opening Plaid Link:', err);
    }
  };

  if (isLoading && !linkToken) {
    return (
      <View style={[styles.button, styles.loading, style]}>
        <ActivityIndicator size="small" color="#fff" />
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === 'primary' ? styles.primary : styles.secondary,
        style,
      ]}
      onPress={handlePress}
      disabled={isLoading}
    >
      <MaterialIcons name="account-balance" size={20} color={variant === 'primary' ? '#fff' : '#4A90E2'} />
      <Text style={[styles.buttonText, variant === 'primary' ? styles.primaryText : styles.secondaryText]}>
        {isLoading ? 'Connecting...' : text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 200,
  },
  primary: {
    backgroundColor: '#4A90E2',
  },
  secondary: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#4A90E2',
  },
  buttonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  primaryText: {
    color: '#fff',
  },
  secondaryText: {
    color: '#4A90E2',
  },
  loading: {
    backgroundColor: '#A0C4FF',
  },
});