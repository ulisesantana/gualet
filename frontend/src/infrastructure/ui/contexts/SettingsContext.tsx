import React, {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";
import { StorageDataSource } from "@infrastructure/data-sources";

interface Settings {
  spreadsheetId: string;
}

// Define a type for the context value
interface SettingsContextType {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
}

// Create the context with a default value
const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

// Create a custom provider component
const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const ls = useMemo(() => new StorageDataSource("settings"), []);
  const [settings, setSettings] = useState<Settings>({
    spreadsheetId: ls.get("spreadsheetId") || "",
  });

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

// Create a custom hook to use the context
const useSettingsContext = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettingsContext must be used within a MyProvider");
  }
  return context;
};

export { SettingsProvider, useSettingsContext };
