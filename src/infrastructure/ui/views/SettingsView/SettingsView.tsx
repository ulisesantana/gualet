import React from "react";
import "./SettingsView.css";
import { Link } from "wouter";
import { routes } from "@infrastructure/ui/routes";
import { LogoutButton } from "@components";

export function SettingsView() {
  return (
    <ul className="settings-view">
      <li>
        <Link to={routes.categories.add}>
          <button className="cta">Add a new category</button>
        </Link>
      </li>
      <li>
        <Link to={routes.categories.list}>
          <button className="cta">Manage categories</button>
        </Link>
      </li>
      {/*<li>*/}
      {/*  <Link to={routes.categories.list}>*/}
      {/*    <button className="cta">Manage payment methods</button>*/}
      {/*  </Link>*/}
      {/*</li>*/}
      <li>
        <span>Logout</span>
        <LogoutButton />
      </li>
    </ul>
  );
}
