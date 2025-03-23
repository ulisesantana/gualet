import React, { createContext, ReactNode, useContext, useState } from "react";
import { Session } from "@supabase/supabase-js";

interface SessionContextType {
  session: Session | null;
  setSession: (session: Session | null) => void;
}

export const SessionContext = createContext<SessionContextType>({
  session: null,
  setSession: () => {},
});

export const useSession = () => {
  return useContext(SessionContext);
};

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);

  return (
    <SessionContext.Provider value={{ session, setSession }}>
      {children}
    </SessionContext.Provider>
  );
};
