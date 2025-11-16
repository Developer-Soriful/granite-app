import { AntDesign, Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

// Dummy hook implementation
const useTrackSignupProgress = (path: string) => {
    React.useEffect(() => {
        console.log(`Tracking signup progress for: ${path}`);
    }, [path]);
};

// Dummy supabase implementation
const supabase = {
    auth: {
        getUser: async () => {
            // Mock user data - in real app, this would come from your auth provider
            return {
                data: {
                    user: {
                        id: '1',
                        user_metadata: {
                            full_name: 'John Doe',
                            income: '5000',
                            investments: '500',
                            savings: '1000',
                            daily_budget_guess: '100',
                            fixedExpenses: {
                                rent: '1500',
                                utilities: '200',
                                additional: []
                            }
                        }
                    }
                },
                error: null
            };
        }
    }
};

// Utility functions
const formatCurrency = (amount: number | string): string => {
    const numericAmount = Number(amount);
    if (isNaN(numericAmount)) {
        return '$0';
    }
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(numericAmount);
};

const safeParseFloat = (value: number | string | null | undefined): number => {
    if (typeof value === 'number' && !isNaN(value)) return value;
    if (typeof value !== 'string' || value.trim() === '') return 0;
    const number = parseFloat(value);
    return isNaN(number) ? 0 : number;
};

export default function PlanSummaryPage() {
    useTrackSignupProgress('/plan-summary');
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [userData, setUserData] = useState<any>(null);
    const [calculatedData, setCalculatedData] = useState<any>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const { data: { user }, error } = await supabase.auth.getUser();

                if (error || !user) {
                    console.error('Error fetching user:', error?.message);
                    router.replace('/(auth)');
                    return;
                }

                setUserData(user);

                const progressInterval = setInterval(() => {
                    setProgress((prev) => {
                        if (prev >= 100) {
                            clearInterval(progressInterval);
                            calculateBudget(user);
                            setIsLoading(false);
                            return 100;
                        }
                        return prev + Math.random() * 10 + 5;
                    });
                }, 100);

                setTimeout(() => {
                    clearInterval(progressInterval);
                    setProgress(100);
                    calculateBudget(user);
                    setIsLoading(false);
                }, Math.random() * 1000 + 1000);

            } catch (error) {
                console.error('Error in fetchUserData:', error);
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [router]);

    const calculateBudget = (user: any) => {
        const userMetadata = user?.user_metadata || {};

        const monthlyIncome = safeParseFloat(userMetadata.income);
        const monthlyInvestments = safeParseFloat(userMetadata.investments);
        const monthlySavings = safeParseFloat(userMetadata.savings);
        const fixedExpensesData = userMetadata.fixedExpenses || {};
        const userGuess = safeParseFloat(userMetadata.daily_budget_guess);

        let totalFixedExpenses = 0;

        for (const key in fixedExpensesData) {
            if (
                key !== 'additional' &&
                Object.prototype.hasOwnProperty.call(fixedExpensesData, key)
            ) {
                totalFixedExpenses += safeParseFloat(fixedExpensesData[key]);
            }
        }

        if (Array.isArray(fixedExpensesData.additional)) {
            fixedExpensesData.additional.forEach((item: any) => {
                if (typeof item === 'object' && item !== null && item.amount) {
                    totalFixedExpenses += safeParseFloat(item.amount);
                }
            });
        }

        const totalMonthlyDeductions =
            totalFixedExpenses + monthlySavings + monthlyInvestments;
        const remainingMonthlyForSpending = monthlyIncome - totalMonthlyDeductions;
        const actualDaily =
            remainingMonthlyForSpending > 0 ? remainingMonthlyForSpending / 30 : 0;

        const difference = actualDaily - userGuess;
        const percentageDiff =
            userGuess > 0 ? Math.abs(difference / userGuess) * 100 : 0;

        setCalculatedData({
            userName: userMetadata.full_name || userMetadata.name || null,
            userGuess,
            actualDaily,
            difference,
            percentageDiff,
        });
    };

    const getNudgeContent = () => {
        if (!calculatedData) return null;

        const { actualDaily, userGuess, percentageDiff } = calculatedData;

        if (percentageDiff <= 10) {
            return {
                icon: <MaterialIcons name="track-changes" size={20} color="#66BB6A" />,
                title: "Nice work, you're close!",
                message:
                    'Granite keeps you on track each day so you can consistently end the month with extra money in the bank.',
            };
        } else if (actualDaily < userGuess) {
            return {
                icon: <Feather name="trending-down" size={20} color="#FF9800" />,
                title: 'You guessed higher than what you can actually spend.',
                message:
                    "Don't worry, Granite helps you avoid overspending so you don't fall behind.",
            };
        } else {
            return {
                icon: <Feather name="trending-up" size={20} color="#66BB6A" />,
                title: 'Good news! You have more room than you thought.',
                message:
                    'Granite helps you keep it that way so you can put more money toward your financial goals.',
            };
        }
    };

    if (isLoading) {
        return (
            <View style={styles.container}>
                <View style={styles.card}>
                    <Text style={styles.title}>Crunching your numbers...</Text>

                    {/* Progress Bar */}
                    <View style={styles.progressBar}>
                        <View
                            style={[
                                styles.progressFill,
                                { width: `${Math.min(progress, 100)}%` }
                            ]}
                        />
                    </View>

                    <Text style={styles.progressText}>
                        {progress < 100
                            ? `${Math.round(progress)}% complete`
                            : 'Almost done...'}
                    </Text>
                </View>
            </View>
        );
    }

    if (!calculatedData) {
        return (
            <View style={styles.container}>
                <View style={styles.card}>
                    <Text style={styles.title}>Unable to calculate budget</Text>
                    <Text style={styles.subtitle}>
                        Please go back and enter your financial information.
                    </Text>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => router.back()}
                    >
                        <Text style={styles.buttonText}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    const nudge = getNudgeContent();

    return (
        <View
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
        >
            <View className='px-4 py-6'>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <View style={styles.container}>
                <View style={styles.card}>
                    {/* Header */}
                    <Text style={styles.title}>
                        Here's how you did
                        {calculatedData.userName ? `, ${calculatedData.userName}` : ''}
                    </Text>

                    {/* Side-by-side Budget Tiles */}
                    <View style={styles.budgetTiles}>
                        {/* Your Guess */}
                        <View style={styles.budgetTile}>
                            <View style={styles.tileHeader}>
                                <AntDesign name="questioncircle" size={16} color="#6B7280" />
                                <Text style={styles.tileLabel}>Your guess</Text>
                            </View>
                            <Text style={styles.tileAmount}>
                                {formatCurrency(calculatedData.userGuess)}
                            </Text>
                            <Text style={styles.tileSubtext}>/day</Text>
                        </View>

                        {/* Actual Budget */}
                        <View style={[styles.budgetTile, styles.actualBudgetTile]}>
                            <View style={styles.tileHeader}>
                                <AntDesign name="checkcircle" size={16} color="#66BB6A" />
                                <Text style={styles.tileLabel}>Actual</Text>
                            </View>
                            <Text style={styles.actualAmount}>
                                {formatCurrency(calculatedData.actualDaily)}
                            </Text>
                            <Text style={styles.actualSubtext}>/day</Text>
                        </View>
                    </View>

                    {/* Delta Line */}
                    <View style={styles.deltaContainer}>
                        <View style={styles.deltaRow}>
                            <Text style={styles.deltaLabel}>Difference:</Text>
                            <Text
                                style={[
                                    styles.deltaValue,
                                    {
                                        color: calculatedData.difference >= 0 ? '#66BB6A' : '#FF9800'
                                    }
                                ]}
                            >
                                {calculatedData.difference >= 0 ? '+' : ''}
                                {formatCurrency(Math.abs(calculatedData.difference))}/day
                            </Text>
                        </View>

                        {/* Monthly Impact Warning - Only show for negative balance */}
                        {calculatedData.difference < 0 && (
                            <Text style={styles.warningText}>
                                {calculatedData.percentageDiff > 10
                                    ? `At that rate, you'd spend ${formatCurrency(Math.abs(calculatedData.difference) * 30)} more than you make this month`
                                    : `That's ${formatCurrency(Math.abs(calculatedData.difference) * 30)} overspent by the end of the month`}
                            </Text>
                        )}
                    </View>

                    {/* Conditional Nudge */}
                    {nudge && (
                        <View style={styles.nudgeContainer}>
                            <View style={styles.nudgeContent}>
                                {nudge.icon}
                                <View style={styles.nudgeText}>
                                    <Text style={styles.nudgeTitle}>{nudge.title}</Text>
                                    <Text style={styles.nudgeMessage}>{nudge.message}</Text>
                                </View>
                            </View>
                        </View>
                    )}

                    {/* CTA Button */}
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => router.push('/(auth)/education')}
                    >
                        <Text style={styles.buttonText}>Continue</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    scrollContent: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#F9FAFB',
    },
    card: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#F5F5F5',
        borderRadius: 16,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#2E2E2E',
        marginBottom: 24,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: '#6B7280',
        marginBottom: 24,
    },
    progressBar: {
        width: '100%',
        height: 8,
        backgroundColor: '#E5E7EB',
        borderRadius: 4,
        marginBottom: 16,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#66BB6A',
        borderRadius: 4,
    },
    progressText: {
        fontSize: 14,
        textAlign: 'center',
        color: '#6B7280',
    },
    budgetTiles: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 24,
    },
    budgetTile: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    actualBudgetTile: {
        backgroundColor: 'rgba(102, 187, 106, 0.1)',
        borderColor: 'rgba(102, 187, 106, 0.3)',
        borderWidth: 1,
    },
    tileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    tileLabel: {
        fontSize: 14,
        color: '#6B7280',
        marginLeft: 4,
    },
    tileAmount: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2E2E2E',
        marginBottom: 2,
    },
    actualAmount: {
        fontSize: 20,
        fontWeight: '900',
        color: '#66BB6A',
        marginBottom: 2,
    },
    tileSubtext: {
        fontSize: 12,
        color: '#6B7280',
    },
    actualSubtext: {
        fontSize: 12,
        color: '#66BB6A',
    },
    deltaContainer: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 16,
        marginBottom: 24,
        borderColor: '#E5E7EB',
        borderWidth: 1,
    },
    deltaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    deltaLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
    },
    deltaValue: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    warningText: {
        fontSize: 12,
        color: '#FF9800',
        fontWeight: '500',
    },
    nudgeContainer: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 16,
        marginBottom: 24,
        borderColor: '#E5E7EB',
        borderWidth: 1,
    },
    nudgeContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    nudgeText: {
        flex: 1,
        marginLeft: 12,
    },
    nudgeTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2E2E2E',
        marginBottom: 4,
    },
    nudgeMessage: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
    },
    button: {
        backgroundColor: '#66BB6A',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});