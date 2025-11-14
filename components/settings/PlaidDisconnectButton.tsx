import React, { useCallback, useState } from 'react';
import {
    Alert,
    Text,
    TouchableOpacity,
} from 'react-native';

interface PlaidDisconnectButtonProps {
    itemId: string;
}

export default function PlaidDisconnectButton({
    itemId,
}: PlaidDisconnectButtonProps) {
    const [loading, setLoading] = useState(false);

    const handleClick = useCallback(async () => {
        // Replace confirm with Alert
        Alert.alert(
            'Disconnect Bank Account',
            'Are you sure you want to disconnect this bank account? All associated data will be removed.',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Disconnect',
                    style: 'destructive',
                    onPress: async () => {
                        setLoading(true);
                        try {
                            const res = await fetch('/api/plaid/remove-item', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ item_id: itemId }),
                            });

                            if (!res.ok) {
                                const data = await res.json();
                                throw new Error(data.error || 'Failed to disconnect account');
                            }

                            // Replace window.location.reload() with a callback or state update
                            // You might want to pass an onSuccess prop instead
                            Alert.alert('Success', 'Bank account disconnected successfully');

                        } catch (err: any) {
                            console.error(err);
                            Alert.alert('Error', `Error: ${err.message}`);
                        } finally {
                            setLoading(false);
                        }
                    },
                },
            ]
        );
    }, [itemId]);

    return (
        <TouchableOpacity
            onPress={handleClick}
            disabled={loading}
            className="px-4 py-2 bg-red-600 rounded-lg"
        >
            <Text className="text-white text-sm font-medium">
                {loading ? 'Disconnecting…' : 'Disconnect'}
            </Text>
        </TouchableOpacity>
    );
}