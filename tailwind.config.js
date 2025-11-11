/** @type {import('tailwindcss').Config} */
module.exports = {
    // NOTE: Update this to include the paths to all files that contain Nativewind classes.
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            fontFamily: {
                'sans-condensed': [
                    {
                        fontFamily: 'InstrumentSans_Condensed-Regular',
                        fontWeight: '400',
                    },
                    {
                        fontFamily: 'InstrumentSans_Condensed-Medium',
                        fontWeight: '500',
                    },
                    {
                        fontFamily: 'InstrumentSans_Condensed-SemiBold',
                        fontWeight: '600',
                    },
                    {
                        fontFamily: 'InstrumentSans_Condensed-Bold',
                        fontWeight: '700',
                    },
                    {
                        fontFamily: 'InstrumentSans_Condensed-Italic',
                        fontStyle: 'italic',
                        fontWeight: '400',
                    },
                    {
                        fontFamily: 'InstrumentSans_Condensed-BoldItalic',
                        fontStyle: 'italic',
                        fontWeight: '700',
                    }
                ],

                'sans-semicondensed': [
                    {
                        fontFamily: 'InstrumentSans_SemiCondensed-Bold',
                        fontWeight: '700',
                    },
                    {
                        fontFamily: 'InstrumentSans_SemiCondensed-BoldItalic',
                        fontStyle: 'italic',
                        fontWeight: '700',
                    }
                ],
            },
        },
    },
    plugins: [],
}