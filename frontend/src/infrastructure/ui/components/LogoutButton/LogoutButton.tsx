import React from "react";

import "./LogoutButton.css";

function onLogout() {
  // new LogoutUseCase(userRepository).exec();
}

export function LogoutButton() {
  return (
    <button className="logout-button" onClick={onLogout}>
      <img src="/icons/logout.png" alt="Logout" />
    </button>
  );
}
