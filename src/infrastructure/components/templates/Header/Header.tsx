import React, {MouseEventHandler} from 'react'
import {LogoutButton} from "infrastructure/components/atoms";
import './Header.css'

export interface HeaderProps {
    onLogout: MouseEventHandler
}

export function Header({onLogout}: HeaderProps) {
    return <header>
        <i>Misperrapp</i>
        <div className="clock">
            <LogoutButton onLogout={onLogout}/>
        </div>
    </header>
}
