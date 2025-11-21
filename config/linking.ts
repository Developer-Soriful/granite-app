import Linking from "expo-linking";

export default {
    prefixes: [Linking.createURL('/'), 'granite://'],
    config: {
        screens: {
            // Handle OAuth callbacks
            'auth-callback': {
                path: 'auth/callback',
                parse: {
                    access_token: (access_token: string) => access_token,
                    refresh_token: (refresh_token: string) => refresh_token,
                    expires_in: (expires_in: string) => Number(expires_in),
                    token_type: (token_type: string) => token_type,
                    type: (type: string) => type,
                },
            },
        },
    },
};
