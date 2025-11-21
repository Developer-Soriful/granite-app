import React from 'react';
import {
    Text,
    View
} from 'react-native';
import PlaidDisconnectButton from './PlaidDisconnectButton';


import PlaidUpdateButton from './PlaidUpdateButton';

interface Account {
    name: string;
}

interface PlaidItem {
    id: number;
    item_id: string;
    status:
    | 'healthy'
    | 'login_required'
    | 'pending_expiration'
    | 'pending_disconnect'
    | 'error'
    | 'active'
    | 'new_accounts_available';
    accounts: Account[] | null;
}

interface ConnectionManagerProps {
    items: PlaidItem[];
    onUpdate?: () => void;
}

export default function ConnectionManager({ items, onUpdate }: ConnectionManagerProps) {
    const needsUpdate = (status: PlaidItem['status']) => {
        return [
            'login_required',
            'pending_expiration',
            'pending_disconnect',
            'new_accounts_available',
        ].includes(status);
    };


    return (
        <View>
            {items.length === 0 && (
                <View className="bg-gray-200 rounded-[16px] p-4">
                    <Text className="text-red-600 text-center">
                        You have no bank accounts connected.
                    </Text>
                </View>
            )}

            {items.map((item) => {
                const institutionName =
                    item.accounts?.[0]?.name || `Item (${item.item_id.slice(0, 8)}...)`;

                return (
                    <View
                        key={item.id}
                        className="flex flex-row items-center justify-between p-4 border border-gray-200 rounded-lg bg-white"
                    >
                        <View className="flex-1">
                            <Text className="font-medium text-gray-900 text-base">
                                {institutionName}
                            </Text>
                            {item.status === 'new_accounts_available' && (
                                <Text className="text-sm text-blue-600 mt-1">
                                    New accounts available
                                </Text>
                            )}
                            {item.status === 'login_required' && (
                                <Text className="text-sm text-yellow-600 mt-1">
                                    Action Required
                                </Text>
                            )}
                            {item.status === 'pending_expiration' && (
                                <Text className="text-sm text-orange-600 mt-1">
                                    Access expiring soon
                                </Text>
                            )}
                            {item.status === 'healthy' && (
                                <Text className="text-sm text-green-600 mt-1">
                                    Connected
                                </Text>
                            )}
                        </View>

                        {/* Conditionally render the button with the correct reason */}
                        <View className="ml-3">
                            {needsUpdate(item.status) ? (
                                <PlaidUpdateButton
                                    itemId={item.item_id}
                                    reason={
                                        item.status === 'new_accounts_available'
                                            ? 'new_accounts'
                                            : 'login_required'
                                    }
                                />
                            ) : (
                                <PlaidDisconnectButton
                                    itemId={item.item_id}
                                />
                            )}
                        </View>
                    </View>
                );
            })}
        </View>
    );
}