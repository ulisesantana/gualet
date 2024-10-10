import React, { MouseEventHandler } from "react";

// @ts-ignore
import LogoutIcon from "./logout.png";
import "./LogoutButton.css";

export function LogoutButton({ onLogout }: { onLogout: MouseEventHandler }) {
  return (
    <button className="logout-button" onClick={onLogout}>
      <img src={LogoutIcon} alt="Logout" />
    </button>
  );
}
