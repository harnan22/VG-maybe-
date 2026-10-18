import React from 'react'
import { useUser } from '@clerk/clerk-react'
import './Dashboard.css'

function Dashboard() {
  const { user } = useUser()

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <div className="dashboard-header">
          <div className="welcome-section">
            <h1>Welcome back, {user?.firstName || 'User'}! 👋</h1>
            <p className="welcome-subtitle">You're successfully authenticated with Clerk</p>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="profile-section">
            <div className="profile-avatar">
              {user?.imageUrl ? (
                <img src={user.imageUrl} alt={user.firstName || 'User'} />
              ) : (
                <div className="avatar-placeholder">
                  {user?.firstName?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
            </div>
            <div className="profile-info">
              <h2>Profile Information</h2>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Full Name:</span>
                  <span className="info-value">
                    {user?.firstName} {user?.lastName}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email:</span>
                  <span className="info-value">
                    {user?.primaryEmailAddress?.emailAddress}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">User ID:</span>
                  <span className="info-value">{user?.id}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Account Created:</span>
                  <span className="info-value">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="features-section">
            <h3>Available Features</h3>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🔐</div>
                <h4>Secure Authentication</h4>
                <p>Your account is protected with Clerk's enterprise-grade security</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📊</div>
                <h4>Dashboard Access</h4>
                <p>Access your personalized dashboard and manage your account</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">⚙️</div>
                <h4>Account Settings</h4>
                <p>Manage your profile and preferences from your account</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard



