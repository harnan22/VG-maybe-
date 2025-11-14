import React from 'react'
import { SignedIn, SignedOut, SignIn, SignUp, UserButton, useUser } from '@clerk/clerk-react'
import './App.css'

function App() {
  const [showSignUp, setShowSignUp] = React.useState(false)

  return (
    <div className="App">
      <header className="app-header">
        <h1>Voice Guard Portal</h1>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </header>

      <main className="app-main">
        <SignedOut>
          {!showSignUp ? (
            <div className="auth-container">
              <SignIn 
                routing="path" 
                path="/sign-in"
                signUpUrl="/sign-up"
                afterSignInUrl="/"
              />
              <p style={{ marginTop: '1rem', color: 'white' }}>
                Don't have an account?{' '}
                <button 
                  onClick={() => setShowSignUp(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    fontSize: 'inherit'
                  }}
                >
                  Sign up
                </button>
              </p>
            </div>
          ) : (
            <div className="auth-container">
              <SignUp 
                routing="path"
                path="/sign-up"
                signInUrl="/sign-in"
                afterSignUpUrl="/"
              />
              <p style={{ marginTop: '1rem', color: 'white' }}>
                Already have an account?{' '}
                <button 
                  onClick={() => setShowSignUp(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    fontSize: 'inherit'
                  }}
                >
                  Sign in
                </button>
              </p>
            </div>
          )}
        </SignedOut>

        <SignedIn>
          <Dashboard />
        </SignedIn>
      </main>
    </div>
  )
}

// Dashboard component shown when user is signed in
function Dashboard() {
  const { user } = useUser()

  return (
    <div className="dashboard">
      <h2>Welcome, {user?.firstName || 'User'}!</h2>
      <p>Email: {user?.primaryEmailAddress?.emailAddress}</p>
      <div className="dashboard-content">
        <h3>Your Profile</h3>
        <p>You are successfully authenticated with Clerk.</p>
        <p>This is your protected dashboard area where you can access all features.</p>
      </div>
    </div>
  )
}

export default App
