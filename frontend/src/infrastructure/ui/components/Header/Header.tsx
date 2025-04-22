import React from "react";
import "./Header.css";
import { Link, useLocation } from "wouter";
import { routes } from "@infrastructure/ui/routes";

function checkIsProtectedRoute(location: string) {
  return (
    !location.startsWith(routes.login) && !location.startsWith(routes.register)
  );
}

export function Header() {
  const [location] = useLocation();
  const isProtectedRoute = checkIsProtectedRoute(location);
  return (
    <header>
      <div className="content">
        <Link to={routes.home}>
          <span className="logo-container">
            <img
              className="logo-image"
              src={"/icons/gualet.png"}
              alt="Gualet logo"
            />
            <span className="logo-text">Gualet</span>
          </span>
        </Link>
        {isProtectedRoute && (
          <span className="settings" data-testid="header-settings-cta">
            <Link to={routes.settings} aria-label="Settings">
              ⚙️
            </Link>
          </span>
        )}
      </div>
    </header>
  );
}
