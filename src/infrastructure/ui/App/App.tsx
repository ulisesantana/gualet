import React, { useEffect, useMemo, useState } from "react";
import { LastTransactionsView, LoginView } from "@views";
import { LocalStorageRepository } from "@repositories";

// Define the global 'google' object for TypeScript
declare global {
  interface Window {
    google: any;
  }
}

function initApp({
  setIsSignedIn,
  setTokenClient,
}: {
  setIsSignedIn(isSignedIn: boolean): void;
  setTokenClient(client: any): void;
}) {
  const ls = new LocalStorageRepository("settings");
  function loadClient() {
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: process.env.REACT_APP_CLIENT_ID,
      scope: "https://www.googleapis.com/auth/spreadsheets",
      callback: (tokenResponse: any) => {
        console.log("Token loaded.");
        setIsSignedIn(true);
        ls.set("accessToken", tokenResponse.access_token);
      },
    });
    setTokenClient(client);
  }
  function init() {
    if (window?.google?.accounts?.oauth2?.initTokenClient) {
      loadClient();
    } else {
      const delay = 100;
      console.log(`Retrying to load token in ${delay}`);
      setTimeout(init, delay, { setIsSignedIn, setTokenClient });
    }
  }

  return init();
}

export const App: React.FC = () => {
  const ls = useMemo(() => new LocalStorageRepository("settings"), []);
  const accessToken = ls.get("accessToken");
  const [isSignedIn, setIsSignedIn] = useState<boolean>(Boolean(accessToken));
  const [tokenClient, setTokenClient] = useState<any>(null);

  useEffect(() => {
    initApp({ setIsSignedIn, setTokenClient });
  }, [setIsSignedIn, setTokenClient]);

  const handleSignIn = () => {
    if (tokenClient) {
      tokenClient.requestAccessToken();
    }
  };

  const handleSignOut = () => {
    setIsSignedIn(false);
    ls.remove("accessToken");
  };

  return isSignedIn ? (
    <LastTransactionsView onLogout={handleSignOut} />
  ) : (
    <LoginView onLogin={handleSignIn} />
  );
};

export default App;
