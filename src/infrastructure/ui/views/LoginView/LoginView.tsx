import React, { useMemo } from "react";
import { LocalStorageRepository } from "@infrastructure/repositories";
import { useSettingsContext } from "@infrastructure/ui/contexts";
import { LoginForm } from "@components";

export interface LoginViewProps {
  onLogin(): void;
}

export function LoginView({ onLogin }: LoginViewProps) {
  const ls = useMemo(() => new LocalStorageRepository("settings"), []);
  const { settings, setSettings } = useSettingsContext();
  const onSubmit = (spreadsheetId: string) => {
    ls.set("spreadsheetId", spreadsheetId);
    setSettings({ ...settings, spreadsheetId: spreadsheetId });
    onLogin();
  };

  return (
    <div className="login-view">
      <LoginForm
        onSubmit={onSubmit}
        defaultSpreadsheetId={settings.spreadsheetId}
      />
    </div>
  );
}
