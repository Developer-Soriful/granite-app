import { Button } from '@react-navigation/elements';
import type { DocumentPickerAsset } from 'expo-document-picker';
import * as DocumentPicker from 'expo-document-picker';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

// --- MOCK API FUNCTION (Replaces Next.js Server Action) ---
// This simulates the 'uploadAvatar' logic and should be replaced with your actual API endpoint.
const uploadAvatarApi = async (fileUri: string, fileType: string, fileName: string) => {
    // Replace 'YOUR_UPLOAD_URL' with your actual server endpoint
    const url = 'YOUR_UPLOAD_URL';

    const formData = new FormData();

    // Append the file using the URI
    formData.append('file', {
        uri: fileUri,
        type: fileType,
        name: fileName,
    } as any); // Type assertion is often needed for RN FormData

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData,
            headers: {
                // Content-Type is typically handled automatically with FormData in RN
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            // Handle HTTP error status codes (e.g., 400, 500)
            const errorData = await response.json();
            return { error: true, message: errorData.message || 'Upload failed with status code ' + response.status };
        }

        // Handle success
        const resultData = await response.json();
        return { error: false, message: resultData.message || 'Avatar uploaded successfully!' };

    } catch (e) {
        console.error('API Error:', e);
        return { error: true, message: 'Network error or unable to reach server.' };
    }
};

// --- TYPE DEFINITIONS ---
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

    // --- File Selection Handler ---
    const pickFile = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['image/png', 'image/jpeg'],
                copyToCacheDirectory: false,
            });

            if (result.canceled) {
                return; // User cancelled the picker
            }

            const file = result.assets[0];

            // File Validation
            if (!file || !file.name || !file.mimeType) {
                Alert.alert('Error', 'Please select a valid file.');
                return;
            }

            if (!['image/jpeg', 'image/png'].includes(file.mimeType)) {
                Alert.alert('Error', 'Only JPG and PNG files are allowed.');
                return;
            }

            // In Expo Go, file.size might not be immediately available, 
            // but if available, we check it.
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

    // --- Submission Handler ---
    const handleSubmit = async () => {
        if (!selectedFile) {
            Alert.alert('Error', 'Please select a file first.');
            return;
        }

        setIsUploading(true);
        setState(initialState);

        try {
            const result = await uploadAvatarApi(
                selectedFile.uri,
                selectedFile.mimeType!,
                selectedFile.name
            );

            setState({
                error: !!result.error,
                message: result.message,
            });

            // Optionally clear the selected file after successful upload
            if (!result.error) {
                setSelectedFile(null);
            }

        } catch (error) {
            setState({
                error: true,
                message: 'An unexpected error occurred.',
            });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Avatar</Text>

            {/* Alert Messages */}
            {state.error && <Text style={[styles.alert, styles.error]}>Error: {state.message}</Text>}
            {!state.error && state.message && (
                <Text style={[styles.alert, styles.success]}>Success: {state.message}</Text>
            )}

            {/* File Selection */}
            <Button
                mode="outlined"
                onPress={pickFile}
                style={styles.selectButton}
                icon="camera"
            >
                {selectedFile ? `Selected: ${selectedFile.name}` : 'Select Avatar (JPG/PNG < 2MB)'}
            </Button>

            {/* Submit Button */}
            <Button
                mode="contained"
                onPress={handleSubmit}
                disabled={!selectedFile || isUploading}
                loading={isUploading}
                style={styles.submitButton}
                labelStyle={styles.submitButtonLabel}
            >
                Upload Avatar
            </Button>
        </View>
    );
}

// --- STYLES ---
const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        flex: 1,
    },
    header: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 30,
        color: '#333',
    },
    alert: {
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
        fontSize: 14,
    },
    error: {
        backgroundColor: '#f8d7da',
        color: '#721c24',
        borderColor: '#f5c6cb',
        borderWidth: 1,
    },
    success: {
        backgroundColor: '#d4edda',
        color: '#155724',
        borderColor: '#c3e6cb',
        borderWidth: 1,
    },
    selectButton: {
        marginBottom: 20,
        paddingVertical: 8,
    },
    submitButton: {
        backgroundColor: '#006C76', // PRIMARY_TEAL equivalent
        paddingVertical: 5,
    },
    submitButtonLabel: {
        fontSize: 16,
        fontWeight: 'bold',
    }
});