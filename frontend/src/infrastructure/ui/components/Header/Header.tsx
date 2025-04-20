import React from "react";
import "./Header.css";
import { Link, useLocation } from "wouter";
import { routes } from "@infrastructure/ui/routes";

export function Header() {
  const [location] = useLocation();
  const isProtectedRoute = !location.startsWith(routes.login);
  return (
    <header>
      <div className="content">
        <Link to={routes.root}>
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
            <Link to={routes.settings}>⚙️</Link>
          </span>
        )}
      </div>
    </header>
  );
}
