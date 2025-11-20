// data/mockFinancialData.ts

export interface Transaction {
    id: string;
    name: string;
    amount: number;
    date: string;
    category: string;
}

export interface SpendingInsight {
    name: string;
    total: number;
    color: string;
}

export interface FinancialDataType {
    currentBalance: number;
    transactions: Transaction[];
    spendingInsights: {
        totalSpentLast30Days: number;
        categoryBreakdown: SpendingInsight[];
    };
}

export const MOCK_FINANCIAL_DATA: FinancialDataType = {
    currentBalance: 3250.75,
    transactions: [
        { id: 't1', name: 'Starbucks Coffee', amount: 5.50, date: '2025-11-19', category: 'Food & Drink' },
        { id: 't2', name: 'Netflix Subscription', amount: 15.49, date: '2025-11-15', category: 'Entertainment' },
        { id: 't3', name: 'Whole Foods Market', amount: 88.20, date: '2025-11-14', category: 'Groceries' },
    ],
    spendingInsights: {
        totalSpentLast30Days: 1659.19,
        categoryBreakdown: [
            { name: 'Housing', total: 1500, color: '#338059' },
            { name: 'Groceries', total: 88.20, color: '#FFB833' },
            { name: 'Entertainment', total: 15.49, color: '#88A3A1' },
        ]
    }
};