import React from "react";
import { useLocation } from "wouter";

import { LogoutUseCase } from "../../application/cases";
import { useAuth } from "../AuthContext";

import "./LogoutButton.css";

interface LogoutButtonProps {
  logoutUseCase: LogoutUseCase;
}

export function LogoutButton({ logoutUseCase }: LogoutButtonProps) {
  const [, setLocation] = useLocation();
  const { logout } = useAuth();

  async function onLogout() {
    await logoutUseCase.exec();
    // Update auth state (triggers re-render of ProtectedRoute)
    logout();
    // Redirect to login
    setLocation("/login");
  }

  return (
    <button className="logout-button" onClick={onLogout}>
      <img src="/icons/logout.png" alt="Logout" />
    </button>
  );
}
