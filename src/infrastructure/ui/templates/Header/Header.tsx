import React, {MouseEventHandler} from 'react'
import {LogoutButton} from "infrastructure/ui/atoms";
import './Header.css'

export interface HeaderProps {
  onLogout: MouseEventHandler
}

export function Header({onLogout}: HeaderProps) {
  return <header>
    <span>
      <i>Misperrapp</i>
    </span>
    <LogoutButton onLogout={onLogout}/>
  </header>
}
