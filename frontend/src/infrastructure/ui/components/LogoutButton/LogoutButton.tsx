import React from "react";
import { LogoutUseCase } from "@application/cases";

import "./LogoutButton.css";

interface LogoutButtonProps {
  logoutUseCase: LogoutUseCase;
}

export function LogoutButton({ logoutUseCase }: LogoutButtonProps) {
  async function onLogout() {
    await logoutUseCase.exec();
  }

  return (
    <button className="logout-button" onClick={onLogout}>
      <img src="/icons/logout.png" alt="Logout" />
    </button>
  );
}
