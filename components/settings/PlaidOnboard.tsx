import React from 'react';
import SubmitButton from './SubmitButton';
import { usePlaidLinkContext } from './usePlaidLinkContext';


interface PlaidOnboardProps {
    variant?: 'default' | 'outline' | 'ghost';
    size?: 'xs' | 'sm' | 'base' | 'lg';
    className?: string;
    onSuccess?: () => void;
}

export function PlaidOnboard({
    variant = 'default',
    size = 'base',
    className = 'bg-[#4c8167] rounded-[16px]',
    onSuccess,
}: PlaidOnboardProps) {
    const { openLink, ready, syncing, loadingToken } = usePlaidLinkContext();

    const handlePress = () => {
        openLink(onSuccess);
    };

    return (
        <SubmitButton
            onPress={handlePress}
            disabled={!ready || syncing || loadingToken}
            variant={variant}
            size={size}
            className={className}
            isLoading={syncing || loadingToken}
        >
            {syncing ? 'Syncing…' : loadingToken ? 'Loading…' : 'Connect Bank'}
        </SubmitButton>
    );
}

export default PlaidOnboard;