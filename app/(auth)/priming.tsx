import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const primingQuestions = [
    {
        id: 'struggle',
        text: 'Where do you struggle most with budgeting?',
        options: [
            'Sticking to a plan',
            'Unexpected expenses',
            'Overspending on non-essentials',
            "I don't budget at all','Other",
        ],
    },
    {
        id: 'goal',
        text: "What's your biggest goal with budgeting ? ",
        options: [
            'Reduce financial stress',
            'Save for something important (vacation, house)',
            'Break bad spending habits',
            'Pay down debt',
            'Other',
        ],
    },
    {
        id: 'current_app',
        text: 'Are you currently using a budgeting app?',
        options: ['Yes', 'No', 'Tried but stopped'],
    },
];

export default function PrimingPage() {
    const router = useRouter();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const totalQuestions = primingQuestions.length;
    const currentQuestion = primingQuestions[currentQuestionIndex];
    const progressPercent = ((currentQuestionIndex + 1) / totalQuestions) * 100;

    const handleSelectOption = (option: string) => {
        setSelectedOption(option);
    };

    const handleNext = () => {
        if (selectedOption === null) {
            Alert.alert('Selection Required', 'Please select an option to continue.');
            return;
        }

        // Save answer
        const updatedAnswers = {
            ...selectedAnswers,
            [currentQuestion.id]: selectedOption,
        };
        setSelectedAnswers(updatedAnswers);

        // Reset selection for next question
        setSelectedOption(null);

        // Navigate or go to next question
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            console.log('Priming answers:', updatedAnswers);
            // Here you can save to AsyncStorage or send to your backend
            router.push('/(auth)/guess');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
            >
                <View className="flex-1 justify-center px-6 py-8">

                    {/* Progress Indicator */}
                    <View className="mb-8">
                        <View className="flex-row justify-between items-center mb-2">
                            <Text className="text-gray-600 text-sm">
                                Question {currentQuestionIndex + 1} of {totalQuestions}
                            </Text>
                            <Text className="text-gray-600 text-sm">
                                {Math.round(progressPercent)}%
                            </Text>
                        </View>
                        <View className="h-3 bg-gray-200 rounded-full overflow-hidden">
                            <View
                                style={{ width: `${progressPercent}%` }}
                                className="h-full bg-[#66BB6A] rounded-full"
                            />
                        </View>
                    </View>

                    {/* Question Card */}
                    <View className="bg-white rounded-2xl shadow-sm p-6 mb-8">
                        <Text className="text-2xl font-bold text-gray-900 text-center mb-2">
                            {currentQuestion.text}
                        </Text>
                        <Text className="text-gray-500 text-center text-sm mb-6">
                            Select the option that best describes your situation
                        </Text>

                        {/* Options List */}
                        <View className="flex flex-col gap-2">
                            {currentQuestion.options.map((option, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => handleSelectOption(option)}
                                    className={`p-4 rounded-xl border-2 flex-row items-center ${selectedOption === option
                                        ? 'bg-green-50 border-green-500'
                                        : 'bg-gray-50 border-gray-200'
                                        }`}
                                >
                                    <View className={`w-6 h-6 rounded-full border-2 mr-3 items-center justify-center ${selectedOption === option
                                        ? 'bg-green-500 border-green-500'
                                        : 'bg-white border-gray-300'
                                        }`}>
                                        {selectedOption === option && (
                                            <Text className="text-white text-xs font-bold">✓</Text>
                                        )}
                                    </View>
                                    <Text className={`text-base flex-1 ${selectedOption === option ? 'text-gray-900 font-medium' : 'text-gray-700'
                                        }`}>
                                        {option}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Next Button */}
                    <TouchableOpacity
                        onPress={handleNext}
                        disabled={selectedOption === null}
                        className={`py-4 rounded-2xl shadow-lg ${selectedOption !== null
                            ? 'bg-[#66BB6A]'
                            : 'bg-gray-300'
                            }`}
                    >
                        <Text className="text-white font-bold text-lg text-center">
                            {currentQuestionIndex < totalQuestions - 1 ? 'Continue' : 'Get Started'}
                        </Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}