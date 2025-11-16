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
    // NOTE: children should ideally be a single Text component or a string for best results.
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

/**
 * Handles rendering the button label, correctly applying styles
 * and preventing illegal nested <Text> components.
 */
const renderButtonLabel = (children: React.ReactNode, size: keyof typeof textSizes, variant: keyof typeof variantTextColors) => {
    // Determine the text classes that must be applied to the label
    const textClasses = `
        ${textSizes[size]} 
        font-semibold 
        ${variantTextColors[variant]}
    `;

    // If the child is already a Text element (as in OtpVerifyPage.jsx)
    if (React.isValidElement(children) && children.type === Text) {
        // We use React.cloneElement to merge the new styles into the existing Text component.
        const existingClassName = children.props.className || '';
        return React.cloneElement(children, {
            className: `${existingClassName} ${textClasses}`
        });
    }

    // If the child is a simple string, wrap it in a styled Text component
    if (typeof children === 'string' || typeof children === 'number') {
        return (
            <Text className={textClasses}>
                {children}
            </Text>
        );
    }

    // Fallback: render any other node directly
    return children;
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

            {/* Render the label using the helper function to apply styling and prevent nesting issues */}
            {!isLoading && renderButtonLabel(children, size, variant)}

        </TouchableOpacity>
    );
}