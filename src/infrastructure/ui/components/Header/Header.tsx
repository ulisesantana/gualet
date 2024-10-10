import React, { MouseEventHandler } from "react";

import { LogoutButton } from "../LogoutButton";
import "./Header.css";

export interface HeaderProps {
  onLogout: MouseEventHandler;
}

export function Header({ onLogout }: HeaderProps) {
  return (
    <header>
      <span>
        <i>Misperrapp</i>
      </span>
      <LogoutButton onLogout={onLogout} />
    </header>
  );
}
