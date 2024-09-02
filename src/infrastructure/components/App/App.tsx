// src/App.tsx
import React, {useEffect, useMemo, useState} from 'react';
import {LastTransactionsView, LoginView} from "infrastructure/components/views";
import {LocalStorageRepository} from "infrastructure/repositories";

// Define the global 'google' object for TypeScript
declare global {
    interface Window {
        google: any;
    }
}

export const App: React.FC = () => {
    const ls = useMemo(() => new LocalStorageRepository('settings'), [])
    const accessToken = ls.get('accessToken');
    const [isSignedIn, setIsSignedIn] = useState<boolean>(Boolean(accessToken));
    const [tokenClient, setTokenClient] = useState<any>(null);

    useEffect(() => {
        window.onload = () => {
            const client = window.google.accounts.oauth2.initTokenClient({
                client_id: process.env.REACT_APP_CLIENT_ID,
                scope: 'https://www.googleapis.com/auth/spreadsheets',
                callback: (tokenResponse: any) => {
                    setIsSignedIn(true);
                    ls.set('accessToken', tokenResponse.access_token);
                },
            });
            setTokenClient(client);
        };
    }, [ls]);

    const handleSignIn = () => {
        if (tokenClient) {
            tokenClient.requestAccessToken();
        }
    };

    const handleSignOut = () => {
        setIsSignedIn(false);
        ls.remove('accessToken');
    };

    return isSignedIn
      ? <LastTransactionsView onLogout={handleSignOut}/>
      : <LoginView onLogin={handleSignIn}/>
};

export default App;
