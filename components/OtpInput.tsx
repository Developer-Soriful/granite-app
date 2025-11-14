import React, { useRef, useState } from "react";
import { TextInput, View } from "react-native";

interface OtpInputProps {
  length: number;
  onComplete: (otp: string) => void;
  disabled?: boolean;
}

export default function OtpInput({
  length,
  onComplete,
  disabled = false,
}: OtpInputProps) {
  const [otp, setOtp] = useState(Array(length).fill(""));
  const inputs = useRef<TextInput[]>([]);

  const focusInput = (index: number) => {
    if (inputs.current[index]) {
      inputs.current[index].focus();
    }
  };

  const handleChange = (text: string, index: number) => {
    if (disabled) return;

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    const combinedOtp = newOtp.join("");
    if (combinedOtp.length === length) {
      onComplete(combinedOtp);
    }

    if (text && index < length - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      focusInput(index - 1);
    }
  };

  return (
    <View className="flex-row justify-center gap-2">
      {Array.from({ length }, (_, index) => (
        <TextInput
          key={index}
          ref={(ref) => {
            inputs.current[index] = ref as TextInput;
          }}
          className="w-12 h-12 border border-gray-300 rounded-lg text-center text-lg font-semibold"
          maxLength={1}
          keyboardType="number-pad"
          value={otp[index]}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          editable={!disabled}
          selectTextOnFocus
        />
      ))}
    </View>
  );
}
