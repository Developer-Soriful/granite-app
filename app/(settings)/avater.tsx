import { Ionicons } from '@expo/vector-icons';
import { Button } from '@react-navigation/elements';
import type { DocumentPickerAsset } from 'expo-document-picker';
import * as DocumentPicker from 'expo-document-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native';

// --- MOCK API FUNCTION (Kept as is) ---
const uploadAvatarApi = async (fileUri: string, fileType: string, fileName: string) => {
    // ... (Your uploadAvatarApi function content remains the same) ...
    const url = 'YOUR_UPLOAD_URL';
    const formData = new FormData();
    formData.append('file', {
        uri: fileUri,
        type: fileType,
        name: fileName,
    } as any);

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' },
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { error: true, message: errorData.message || 'Upload failed with status code ' + response.status };
        }
        const resultData = await response.json();
        return { error: false, message: resultData.message || 'Avatar uploaded successfully!' };

    } catch (e) {
        console.error('API Error:', e);
        return { error: true, message: 'Network error or unable to reach server.' };
    }
};

// --- TYPE DEFINITIONS (Kept as is) ---
interface State {
    error: boolean;
    message: string;
}

const initialState: State = {
    error: false,
    message: '',
};

export default function AvatarUploadScreen() {
    const [state, setState] = useState<State>(initialState);
    const [selectedFile, setSelectedFile] = useState<DocumentPickerAsset | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const MAX_SIZE = 2 * 1024 * 1024; // 2MB

    // --- File Selection Handler (Kept as is) ---
    const pickFile = async () => {
        // ... (pickFile logic remains the same) ...
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['image/png', 'image/jpeg'],
                copyToCacheDirectory: false,
            });

            if (result.canceled) return;
            const file = result.assets[0];

            if (!file || !file.name || !file.mimeType) {
                Alert.alert('Error', 'Please select a valid file.');
                return;
            }
            if (!['image/jpeg', 'image/png'].includes(file.mimeType)) {
                Alert.alert('Error', 'Only JPG and PNG files are allowed.');
                return;
            }
            if (file.size && file.size > MAX_SIZE) {
                Alert.alert('Error', 'File size exceeds 2MB limit.');
                return;
            }

            setSelectedFile(file);
            setState(initialState);
        } catch (e) {
            console.error(e);
            Alert.alert('Error', 'An error occurred while picking the file.');
        }
    };

    // --- Submission Handler (Kept as is) ---
    const handleSubmit = async () => {
        // ... (handleSubmit logic remains the same) ...
        if (!selectedFile) {
            Alert.alert('Error', 'Please select a file first.');
            return;
        }

        setIsUploading(true);
        setState(initialState);

        try {
            const result = await uploadAvatarApi(selectedFile.uri, selectedFile.mimeType!, selectedFile.name);

            setState({
                error: !!result.error,
                message: result.message,
            });

            if (!result.error) {
                setSelectedFile(null);
            }
        } catch (error) {
            setState({ error: true, message: 'An unexpected error occurred.' });
        } finally {
            setIsUploading(false);
        }
    };

    const avatarSource = selectedFile?.uri ? { uri: selectedFile.uri } : null;

    return (
        <View
            className="flex-1 items-start p-4" // Tailwind for container style
        >
            <View className='py-6'>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <View className='w-full flex flex-col justify-center items-center'>
                <Text
                    className="text-3xl font-bold text-gray-800 my-5 mt-10" // Tailwind for header style
                >
                    Update Profile Picture
                </Text>

                {/* Avatar Display Area */}
                <View
                    className="w-36 h-36 rounded-full justify-center items-center bg-gray-200 mb-6 shadow-xl"
                    style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.1,
                        shadowRadius: 5,
                        elevation: 6,
                    }}
                >
                    {avatarSource ? (
                        // 1. Image fills the container perfectly (w-full h-full)
                        <Image
                            source={avatarSource}
                            className="w-full h-full rounded-full"
                        />
                    ) : (
                        <Ionicons name="person-circle-outline" size={120} color="#a0a0a0" />
                    )}

                    <TouchableOpacity
                        onPress={pickFile}
                        className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-white border-2 border-primary-teal justify-center items-center shadow-md"
                    >
                        <Ionicons name="camera" size={24} color="#006C76" />
                    </TouchableOpacity>
                </View>

                <Text className="text-sm text-gray-600 text-center mb-5 px-4">
                    {selectedFile
                        ? `Selected: ${selectedFile.name} (Ready to upload)`
                        : 'Tap the camera icon to select a new image (JPG/PNG < 2MB).'}
                </Text>

                {/* Alert Messages */}
                {state.error && (
                    <Text
                        className="p-3 rounded-lg w-full text-center border text-red-700 bg-red-100 border-red-700 mb-5"
                    >
                        Error: {state.message}
                    </Text>
                )}
                {!state.error && state.message && (
                    <Text
                        className="p-3 rounded-lg w-full text-center border text-green-700 bg-green-100 border-green-700 mb-5"
                    >
                        Success: {state.message}
                    </Text>
                )}

                {/* Submit Button */}
                <Button
                    mode="contained"
                    onPress={handleSubmit}
                    disabled={!selectedFile || isUploading}
                    loading={isUploading}

                    // 1. BACKGROUND COLOR: Use the primary style prop, which takes precedence.
                    // The background color for the button wrapper.
                    style={{
                        backgroundColor: "#338059", // Your desired background color
                        borderRadius: 12,           // Apply border radius here
                        width: '100%',
                        marginTop: 8,
                    }}

                    // 2. HEIGHT/PADDING: Control the button's internal height via contentStyle 
                    // (A common pattern for React Native Paper and similar buttons)
                    contentStyle={{
                        paddingVertical: 10, // Adjust this value to change button height
                    }}

                    // 3. TEXT COLOR: Use the dedicated labelStyle prop.
                    labelStyle={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: '#ffffff', // Your desired text color (white)
                    }}
                >
                    <Text className='text-white'>
                        {isUploading ? 'Uploading...' : 'Save New Avatar'}
                    </Text>
                </Button>
            </View>
        </View>
    );
}