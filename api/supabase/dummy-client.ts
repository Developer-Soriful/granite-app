// api/supabase/dummy-client.ts
export const dummySupabase = {
    auth: {
        getUser: async () => {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            return {
                data: {
                    user: {
                        id: 'user-123',
                        email: 'user@example.com',
                        user_metadata: {
                            fullName: 'John Doe',
                            income: 5000,
                            investments: 1000,
                            savings: 500,
                            fixedExpenses: {
                                rent: 1200,
                                utilities: 200,
                                internet: 80,
                                groceries: 400,
                                additional: [
                                    { name: 'Netflix', amount: 15 },
                                    { name: 'Gym', amount: 50 }
                                ]
                            }
                        }
                    }
                },
                error: null
            };
        },

        updateUser: async (updates: any) => {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            console.log('User updated with:', updates);

            // In a real app, this would update the actual user data
            // For demo, we'll just return success
            return {
                data: { user: null },
                error: null
            };
        }
    },

    from: (table: string) => ({
        select: (columns: string) => ({
            eq: (column: string, value: string) => ({
                order: (column: string, options: { ascending: boolean }) => ({
                    limit: (count: number) => ({
                        maybeSingle: async () => {
                            // Simulate API delay
                            await new Promise(resolve => setTimeout(resolve, 800));

                            if (table === 'subscriptions') {
                                return {
                                    data: {
                                        status: 'active',
                                        cancel_at_period_end: false,
                                        current_period_end: '2024-12-31T23:59:59Z'
                                    },
                                    error: null
                                };
                            }

                            return { data: null, error: null };
                        }
                    })
                })
            })
        })
    })
};