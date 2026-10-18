import React, { useState } from 'react'
import { useSignIn, useSignUp } from '@clerk/clerk-react'
import './LoginPage.css'

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [pendingVerification, setPendingVerification] = useState(false)
  const [code, setCode] = useState('')

  const { isLoaded: signInLoaded, signIn, setActive } = useSignIn()
  const { isLoaded: signUpLoaded, signUp } = useSignUp()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleCodeChange = (e) => {
    setCode(e.target.value)
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (!isLogin) {
      if (!formData.firstName) {
        newErrors.firstName = 'First name is required'
      }
      if (!formData.lastName) {
        newErrors.lastName = 'Last name is required'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      if (isLogin) {
        // Sign in
        if (!signInLoaded) return

        const result = await signIn.create({
          identifier: formData.email,
          password: formData.password,
        })

        if (result.status === 'complete') {
          await setActive({ session: result.createdSessionId })
          // Redirect will happen automatically via Clerk
        } else {
          console.error('Sign in incomplete:', result)
          setErrors({ submit: 'Sign in failed. Please try again.' })
        }
      } else {
        // Sign up
        if (!signUpLoaded) return

        const result = await signUp.create({
          emailAddress: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
        })

        // Check if email verification is required
        if (result.status === 'missing_requirements') {
          // Start email verification
          await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
          setPendingVerification(true)
        } else if (result.status === 'complete') {
          await setActive({ session: result.createdSessionId })
        }
      }
    } catch (err) {
      console.error('Authentication error:', err)
      const errorMessage = err.errors?.[0]?.message || `${isLogin ? 'Sign in' : 'Sign up'} failed. Please try again.`
      setErrors({ submit: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerification = async (e) => {
    e.preventDefault()
    if (!code) {
      setErrors({ code: 'Verification code is required' })
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code,
      })

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
      } else {
        setErrors({ code: 'Verification failed. Please try again.' })
      }
    } catch (err) {
      console.error('Verification error:', err)
      setErrors({ code: err.errors?.[0]?.message || 'Verification failed. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setPendingVerification(false)
    setCode('')
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: ''
    })
    setErrors({})
  }

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Logo and Header */}
        <div className="login-header">
          <div className="logo-container">
            <div className="logo-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C11.4477 2 11 2.44772 11 3V12C11 12.5523 11.4477 13 12 13C12.5523 13 13 12.5523 13 12V3C13 2.44772 12.5523 2 12 2Z" fill="currentColor"/>
                <path d="M8 7C8 5.89543 8.89543 5 10 5C10 5 10 5.89543 10 7V12C10 13.1046 9.10457 14 8 14C6.89543 14 6 13.1046 6 12C6 10.8954 6.89543 10 8 10V7Z" fill="currentColor"/>
                <path d="M16 7C16 5.89543 15.1046 5 14 5C14 5 14 5.89543 14 7V12C14 13.1046 14.8954 14 16 14C17.1046 14 18 13.1046 18 12C18 10.8954 17.1046 10 16 10V7Z" fill="currentColor"/>
                <path d="M5 12C5 13.6569 6.34315 15 8 15H16C17.6569 15 19 13.6569 19 12V11C19 8.79086 17.2091 7 15 7H9C6.79086 7 5 8.79086 5 11V12Z" fill="currentColor" opacity="0.3"/>
                <path d="M12 15V19M12 19H9M12 19H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
          <h1 className="brand-name">VOICE-GUARD</h1>
          <p className="brand-tagline">Secure Voice Authentication</p>
        </div>

        {/* Tab Toggle */}
        <div className="tab-toggle">
          <button
            className={`tab-button ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`tab-button ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
          <div className={`tab-slider ${!isLogin ? 'right' : ''}`}></div>
        </div>

        {/* Email Verification Form */}
        {pendingVerification ? (
          <form onSubmit={handleVerification} className="login-form">
            <div className="verification-message">
              <p>We've sent a verification code to your email address.</p>
              <p className="verification-email">{formData.email}</p>
            </div>
            
            <div className="form-group">
              <label htmlFor="code" className="form-label">Verification Code</label>
              <input
                type="text"
                id="code"
                name="code"
                value={code}
                onChange={handleCodeChange}
                className={`form-input ${errors.code ? 'error' : ''}`}
                placeholder="Enter verification code"
                maxLength="6"
              />
              {errors.code && <span className="error-message">{errors.code}</span>}
            </div>

            {errors.submit && <span className="error-message">{errors.submit}</span>}

            <button
              type="submit"
              className={`submit-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading-spinner"></span>
              ) : (
                'Verify Email'
              )}
            </button>

            <button
              type="button"
              onClick={toggleMode}
              className="toggle-link"
              style={{ marginTop: '16px', display: 'block', textAlign: 'center' }}
            >
              Back to {isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </form>
        ) : (
          /* Main Form */
          <form onSubmit={handleSubmit} className="login-form">
            {!isLogin && (
              <>
                <div className="form-group">
                  <label htmlFor="firstName" className="form-label">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`form-input ${errors.firstName ? 'error' : ''}`}
                    placeholder="Enter your first name"
                  />
                  {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="lastName" className="form-label">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`form-input ${errors.lastName ? 'error' : ''}`}
                    placeholder="Enter your last name"
                  />
                  {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                </div>
              </>
            )}

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="Enter your email"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="Enter your password"
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            {isLogin && (
              <div className="form-options">
                <label className="remember-me">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <a href="#" className="forgot-password">Forgot password?</a>
              </div>
            )}

            {errors.submit && (
              <div className="error-message" style={{ marginBottom: '16px', textAlign: 'center' }}>
                {errors.submit}
              </div>
            )}

            <button
              type="submit"
              className={`submit-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading-spinner"></span>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>
        )}

        {/* Footer */}
        <div className="login-footer">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={toggleMode} className="toggle-link">
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        {/* Divider */}
        <div className="divider">
          <span>or continue with</span>
        </div>

        {/* Social Login */}
        {!pendingVerification && (
          <>
            <div className="divider">
              <span>or continue with</span>
            </div>
            <div className="social-login">
              <button 
                type="button"
                className="social-button google"
                onClick={async () => {
                  try {
                    if (isLogin && signInLoaded) {
                      await signIn.authenticateWithRedirect({
                        strategy: 'oauth_google',
                        redirectUrl: '/',
                        redirectUrlComplete: '/',
                      })
                    } else if (!isLogin && signUpLoaded) {
                      await signUp.authenticateWithRedirect({
                        strategy: 'oauth_google',
                        redirectUrl: '/',
                        redirectUrlComplete: '/',
                      })
                    }
                  } catch (err) {
                    console.error('OAuth error:', err)
                    setErrors({ submit: 'OAuth authentication failed. Please try again.' })
                  }
                }}
                disabled={isLogin ? !signInLoaded : !signUpLoaded}
              >
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button 
                type="button"
                className="social-button github"
                onClick={async () => {
                  try {
                    if (isLogin && signInLoaded) {
                      await signIn.authenticateWithRedirect({
                        strategy: 'oauth_github',
                        redirectUrl: '/',
                        redirectUrlComplete: '/',
                      })
                    } else if (!isLogin && signUpLoaded) {
                      await signUp.authenticateWithRedirect({
                        strategy: 'oauth_github',
                        redirectUrl: '/',
                        redirectUrlComplete: '/',
                      })
                    }
                  } catch (err) {
                    console.error('OAuth error:', err)
                    setErrors({ submit: 'OAuth authentication failed. Please try again.' })
                  }
                }}
                disabled={isLogin ? !signInLoaded : !signUpLoaded}
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
                GitHub
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default LoginPage
