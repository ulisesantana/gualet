// src/App.tsx
import React, {useEffect, useMemo, useState} from 'react';
import {LastTransactionsView, LoginView} from "infrastructure/ui/views";
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
            const client = window.google.accounts.oauth2.initTokenClient({
                client_id: process.env.REACT_APP_CLIENT_ID,
                scope: 'https://www.googleapis.com/auth/spreadsheets',
                callback: (tokenResponse: any) => {
                    setIsSignedIn(true);
                    new LocalStorageRepository('settings').set('accessToken', tokenResponse.access_token);
                },
            });
            setTokenClient(client);
    }, []);

    const handleSignIn = () => {
        console.debug('SIGN IN', tokenClient)
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
