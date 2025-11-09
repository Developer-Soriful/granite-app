import CalenderSection from '@/components/CalenderSection'
import React from 'react'
import { ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Calendar = () => {
    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: "#e6f5ee", paddingTop: 8 }}
        >
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    padding: 16,
                    paddingTop: 65,
                    gap: 16,
                }}
                showsVerticalScrollIndicator={false}
            >
                {/* this is for calender section here */}
                <CalenderSection />
            </ScrollView>
        </SafeAreaView>
    )
}

export default Calendar