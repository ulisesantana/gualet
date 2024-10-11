import React from "react";
import "./Header.css";
import { Link } from "wouter";
import { routes } from "@infrastructure/ui/routes";
import { useSession } from "@infrastructure/ui/contexts";
import { LogoutButton } from "@components";

export function Header() {
  const { session } = useSession();
  return (
    <header>
      <div className="content">
        <Link to={routes.root}>
          <span>
            <i>Gualet</i>
          </span>
        </Link>
        {session && <LogoutButton />}
      </div>
    </header>
  );
}
