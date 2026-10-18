import React from 'react'
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/clerk-react'
import LoginPage from './components/LoginPage'
import Dashboard from './components/Dashboard'
import './App.css'

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <div className="logo-container-small">
            <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
              <path d="M12 2C11.4477 2 11 2.44772 11 3V12C11 12.5523 11.4477 13 12 13C12.5523 13 13 12.5523 13 12V3C13 2.44772 12.5523 2 12 2Z" fill="currentColor"/>
              <path d="M8 7C8 5.89543 8.89543 5 10 5C10 5 10 5.89543 10 7V12C10 13.1046 9.10457 14 8 14C6.89543 14 6 13.1046 6 12C6 10.8954 6.89543 10 8 10V7Z" fill="currentColor"/>
              <path d="M16 7C16 5.89543 15.1046 5 14 5C14 5 14 5.89543 14 7V12C14 13.1046 14.8954 14 16 14C17.1046 14 18 13.1046 18 12C18 10.8954 17.1046 10 16 10V7Z" fill="currentColor"/>
            </svg>
            <h1>VOICE-GUARD</h1>
          </div>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </header>

      <main className="app-main">
        <SignedOut>
          <LoginPage />
        </SignedOut>

        <SignedIn>
          <Dashboard />
        </SignedIn>
      </main>
    </div>
  )
}

export default App
