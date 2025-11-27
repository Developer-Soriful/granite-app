// hooks/usePlaidItems.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../config/supabase.config';

export interface PlaidItem {
    id: string;
    user_id: string;
    access_token: string;
    item_id: string;
    institution_name: string;
    created_at: string;
    updated_at: string;
}

export const usePlaidItems = () => {
    return useQuery<PlaidItem[]>({
        queryKey: ['plaid', 'items'],
        queryFn: async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) return [];

            const { data, error } = await supabase
                .from('user_plaid_items')
                .select('*')
                .eq('user_id', session.user.id);

            if (error) {
                console.error('Error fetching Plaid items:', error);
                throw error;
            }

            return data || [];
        },
    });
};