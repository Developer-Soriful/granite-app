import React, { JSX } from 'react';
import { Pressable, PressableProps, Text } from 'react-native';
// Import Feather icons from the core Expo Vector Icons package
import { Feather } from '@expo/vector-icons';

type Size = 'xs' | 'sm' | 'base' | 'lg';
type Variant = 'default' | 'outline' | 'ghost';

interface SubmitButtonProps extends PressableProps {
    size?: Size;
    variant?: Variant;
    children: React.ReactNode;
    isLoading?: boolean;
    // Native replacement for formAction is a standard onPress handler
    onPress: () => void;
}

const sizes: Record<Size, string> = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    base: 'py-3 px-4 text-sm',
    lg: 'px-6 py-3 text-lg',
};

const variants: Record<Variant, string> = {
    // Styling classes for background/border
    default: 'bg-[#338059] text-white',
    outline: 'border border-[#338059] bg-white text-[#338059]',
    ghost: 'bg-transparent text-[#338059]',
};

// Map component variant to the required color for the icon/text
const textColors: Record<Variant, string> = {
    default: 'text-white',
    outline: 'text-[#338059]',
    ghost: 'text-[#338059]',
};

const iconColors: Record<Variant, string> = {
    default: '#FFFFFF', // White
    outline: '#338059', // Green
    ghost: '#338059',   // Green
};

export default function SubmitButton({
    size = 'base',
    variant = 'default',
    children,
    className = '',
    isLoading = false,
    onPress,
    disabled,
    ...rest
}: SubmitButtonProps): JSX.Element {

    const buttonClasses = `${variants[variant]} ${sizes[size]} ${className} 
        font-semibold rounded-2xl
        transition-all duration-500
        disabled:opacity-50
        flex flex-row items-center justify-center gap-2`;

    const textColorClass = textColors[variant];
    const iconColor = iconColors[variant];

    return (
        <Pressable
            onPress={onPress}
            disabled={isLoading || disabled}
            // Combining dynamic and static classes. Note: NativeWind applies styles
            className={buttonClasses}
            {...rest}
        >
            {/* *** Conditionally render loader or children *** */}
            {isLoading ? (
                // Using Feather icon for the loader (spinner)
                // The 'animate-spin' class requires NativeWind configuration
                <Feather
                    name="loader"
                    size={20}
                    color={iconColor}
                    className="w-4 h-4 animate-spin"
                />
            ) : (
                // Apply text styles to the inner Text component
                <Text className={`${textColorClass} font-semibold text-center`}>
                    {children}
                </Text>
            )}
        </Pressable>
    );
}