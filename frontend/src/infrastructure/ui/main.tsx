import React from "react";
import ReactDOM from "react-dom/client";
import "./main.css";
import "./forms.css";
import "./theme.css";
import { SessionProvider } from "@infrastructure/ui/contexts";

import { App } from "./App";
import { SettingsProvider } from "./contexts";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <React.StrictMode>
    <SessionProvider>
      <SettingsProvider>
        <App />
      </SettingsProvider>
    </SessionProvider>
  </React.StrictMode>,
);
