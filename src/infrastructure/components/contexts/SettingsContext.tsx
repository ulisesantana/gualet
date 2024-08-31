// src/contexts/SettingsContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define a type for the context value
interface SettingsContextType {
  sharedValue: string;
  setSharedValue: React.Dispatch<React.SetStateAction<string>>;
}

// Create the context with a default value
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Create a custom provider component
const MyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sharedValue, setSharedValue] = useState<string>('Default Value');

  return (
    <SettingsContext.Provider value={{ sharedValue, setSharedValue }}>
  {children}
  </SettingsContext.Provider>
);
};

// Create a custom hook to use the context
const useSettingsContext = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettingsContext must be used within a MyProvider');
  }
  return context;
};

export { MyProvider, useSettingsContext };
