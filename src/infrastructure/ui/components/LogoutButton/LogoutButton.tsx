import React from "react";
import { supabase } from "@infrastructure/data-sources";
import { LogoutUseCase } from "@application/cases";

import "./LogoutButton.css";

function onLogout() {
  new LogoutUseCase(supabase).exec();
}

export function LogoutButton() {
  return (
    <button className="logout-button" onClick={onLogout}>
      <img src="icons/logout.png" alt="Logout" />
    </button>
  );
}
