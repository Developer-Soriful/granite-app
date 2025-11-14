import React, { useState } from 'react';
import {
    StyleSheet,
    TextInput
} from 'react-native';

interface SimpleOtpInputProps {
    onComplete: (otp: string) => void;
    disabled?: boolean;
}

export default function OtpInput({ onComplete, disabled = false }: SimpleOtpInputProps) {
    const [otp, setOtp] = useState('');

    const handleChange = (text: string) => {
        // Remove non-numeric characters
        const numericText = text.replace(/[^0-9]/g, '');

        // Limit to 6 characters
        const limitedText = numericText.slice(0, 6);

        setOtp(limitedText);

        if (limitedText.length === 6) {
            onComplete(limitedText);
        }
    };

    return (
        <TextInput
            style={[
                styles.input,
                otp.length === 6 && styles.completeInput,
                disabled && styles.disabledInput
            ]}
            value={otp}
            onChangeText={handleChange}
            keyboardType="number-pad"
            maxLength={6}
            editable={!disabled}
            placeholder="Enter 6-digit code"
            placeholderTextColor="#9ca3af"
            textAlign="center"
        />
    );
}

const styles = StyleSheet.create({
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        fontSize: 18,
        fontWeight: '600',
        backgroundColor: 'white',
        paddingHorizontal: 16,
    },
    completeInput: {
        borderColor: '#66BB6A',
        backgroundColor: '#f0f9f0',
    },
    disabledInput: {
        backgroundColor: '#f3f4f6',
        opacity: 0.6,
    },
});