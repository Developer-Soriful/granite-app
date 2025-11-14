import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    Alert,
} from 'react-native';
import SubmitButton from './SubmitButton';

interface PlaidUpdateButtonProps {
    itemId: string;
    reason?: 'new_accounts' | 'login_required';
    onUpdate?: () => void;
}

export default function PlaidUpdateButton({
    itemId,
    reason,
    onUpdate,
}: PlaidUpdateButtonProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLinkSuccess = useCallback(async () => {
        // In React Native, we would handle the Plaid Link success here
        console.log('Plaid Link completed successfully');

        // Call the update callback if provided
        if (onUpdate) {
            onUpdate();
        } else {
            // Optionally show success message
            Alert.alert('Success', 'Bank account updated successfully');

            // Refresh the data - in React Native we might need to use a different approach
            // router.replace() could be used to refresh the current screen
            // router.replace(router.pathname);
        }
    }, [onUpdate]);

    const handleLinkExit = useCallback((error: any) => {
        if (error) {
            console.error('[PlaidUpdateButton] Link exited with error:', error);
            Alert.alert('Error', `Plaid Link failed: ${error.display_message || error.error_message}`);
        }
    }, []);

    const handleClick = useCallback(async () => {
        setLoading(true);
        try {
            // In React Native, we would integrate with react-native-plaid-link-sdk
            // For demo purposes, we'll simulate the API call and Plaid Link flow

            let url = `/api/plaid/update-link-token?item_id=${itemId}`;
            if (reason) {
                url += `&reason=${reason}`;
            }

            console.log('Fetching link token from:', url);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock response - in real app, you would use the actual response
            const mockLinkToken = 'link-sandbox-' + Math.random().toString(36).substr(2, 9);

            // In a real React Native app, you would launch Plaid Link here
            // using react-native-plaid-link-sdk
            console.log('Launching Plaid Link with token:', mockLinkToken);

            // Simulate Plaid Link flow
            setTimeout(() => {
                handleLinkSuccess();
            }, 2000);

        } catch (err: any) {
            console.error(err);
            Alert.alert('Error', `Error starting update mode: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }, [itemId, reason, handleLinkSuccess]);

    const getButtonText = () => {
        if (loading) return 'Loading…';

        if (reason === 'new_accounts') {
            return 'Add Accounts';
        } else {
            return 'Reconnect Bank';
        }
    };

    return (
        <SubmitButton
            onPress={handleClick}
            isLoading={loading}
            disabled={loading}
            variant={reason === 'new_accounts' ? 'default' : 'outline'}
        >
            {getButtonText()}
        </SubmitButton>
    );
}