import React, { useEffect } from "react";
import {
  CategoriesView,
  LastTransactionsView,
  LoginView,
  SettingsView,
  TransactionDetailsView,
} from "@views";
import { supabase } from "@infrastructure/data-sources";
import { Header } from "@components";
import { Route, Router } from "wouter";
import { routes } from "@infrastructure/ui/routes";
import { useSession } from "@infrastructure/ui/contexts";

export const App: React.FC = () => {
  const { session, setSession } = useSession();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    // @ts-ignore
    <Router base={import.meta.env.BASE_URL}>
      <div className="App">
        <Header />
        <main className="App-main">
          {session ? (
            <>
              <Route path={routes.root} component={LastTransactionsView} />
              <Route
                path={routes.transactions.details}
                component={TransactionDetailsView}
              />
              <Route path={routes.categories.list} component={CategoriesView} />
              <Route path={routes.settings} component={SettingsView} />
            </>
          ) : (
            <LoginView />
          )}
        </main>
      </div>
    </Router>
  );
};
