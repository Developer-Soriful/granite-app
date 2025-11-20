// context/FinancialContext.tsx

import React, { createContext, useEffect, useState } from 'react';
// 🛑 এই লাইনটি কমেন্ট করে দিন বা মুছে দিন
// import { FinancialDataType, MOCK_FINANCIAL_DATA } from '@/data/mockFinancialData'; 

// 💡 ডামি ইন্টারফেস ও ডেটা তৈরি করুন যাতে ইম্পোর্ট না লাগে
interface FinancialDataType { currentBalance: number; }
const DUMMY_DATA: FinancialDataType = { currentBalance: 0 };

interface FinancialContextType {
    financialData: FinancialDataType | null;
    isDataLoading: boolean;
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

export const useFinancialData = () => {
    // ... (rest of the hook is unchanged)
};

export function FinancialProvider({ children }: { children: React.ReactNode }) {
    const [financialData, setFinancialData] = useState<FinancialDataType | null>(null);
    const [isDataLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setFinancialData(DUMMY_DATA); // 💡 ডামি ডেটা ব্যবহার করুন
            setIsLoading(false);
        }, 1000);
    }, []);

    return (
        <FinancialContext.Provider value={{ financialData, isDataLoading }}>
            {children}
        </FinancialContext.Provider>
    );
}