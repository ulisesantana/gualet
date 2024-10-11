import React from "react";
import { supabase } from "@infrastructure/data-sources";

// @ts-ignore
import LogoutIcon from "./logout.png";

import "./LogoutButton.css";

function onLogout() {
  supabase.auth.signOut();
}

export function LogoutButton() {
  return (
    <button className="logout-button" onClick={onLogout}>
      <img src={LogoutIcon} alt="Logout" />
    </button>
  );
}
