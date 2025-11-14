import React from 'react';
import {
    ActivityIndicator,
    GestureResponderEvent,
    Text,
    TouchableOpacity,
} from 'react-native';

interface SubmitButtonProps {
    size?: 'xs' | 'sm' | 'base' | 'lg';
    variant?: 'default' | 'outline' | 'ghost';
    onPress?: (event: GestureResponderEvent) => void;
    children: React.ReactNode;
    isLoading?: boolean;
    disabled?: boolean;
    className?: string;
}

const sizes = {
    xs: 'px-2 py-1',
    sm: 'px-3 py-1.5',
    base: 'py-3 px-4',
    lg: 'px-6 py-3',
};

const textSizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
};

const variants = {
    default: 'bg-[#338059]',
    outline: 'border border-[#338059]',
    ghost: '',
};

const variantTextColors = {
    default: 'text-white',
    outline: 'text-[#338059]',
    ghost: 'text-[#338059]',
};

export default function SubmitButton({
    size = 'base',
    variant = 'default',
    onPress,
    children,
    className = '',
    isLoading = false,
    disabled = false,
}: SubmitButtonProps) {
    const isDisabled = disabled || isLoading;

    const getPressedStyle = () => {
        if (variant === 'default') {
            return 'active:bg-[#37a56e]';
        } else if (variant === 'outline') {
            return 'active:bg-[#338059] active:border-[#37a56e]';
        } else {
            return 'active:bg-[#3380591A]';
        }
    };

    const getPressedTextStyle = () => {
        if (variant === 'outline') {
            return 'active:text-white';
        }
        return '';
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={isDisabled}
            className={`
        ${variants[variant]} 
        ${sizes[size]} 
        ${getPressedStyle()}
        rounded-2xl
        flex flex-row items-center justify-center gap-2
        ${isDisabled ? 'opacity-50' : ''}
        ${className}
      `}
            style={
                variant === 'outline' ? {
                    borderWidth: 1,
                    borderColor: '#338059',
                } : {}
            }
        >
            {isLoading ? (
                <ActivityIndicator size="small" color={variant === 'default' ? '#FFFFFF' : '#338059'} />
            ) : null}

            <Text className={`
        ${textSizes[size]} 
        font-semibold 
        ${variantTextColors[variant]}
        ${getPressedTextStyle()}
      `}>
                {children}
            </Text>
        </TouchableOpacity>
    );
}