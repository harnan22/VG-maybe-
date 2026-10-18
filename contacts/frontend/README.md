# VOICE-GUARD Login Portal

A modern, responsive login portal with Clerk authentication for the VOICE-GUARD application.

## 🎨 Features

- **Clerk Authentication**: Secure authentication powered by Clerk
- **Modern Design**: Clean, professional interface with smooth animations
- **Responsive**: Works perfectly on desktop, tablet, and mobile devices
- **Form Validation**: Client-side validation with helpful error messages
- **Tab Toggle**: Easy switching between Login and Sign Up modes
- **Social Login**: Google and GitHub OAuth authentication via Clerk
- **Email Verification**: Secure email verification flow
- **Loading States**: Visual feedback during form submission
- **Accessible**: Keyboard navigation and screen reader friendly
- **Protected Dashboard**: User dashboard with profile information

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- A Clerk account (sign up at [clerk.com](https://clerk.com))

### Clerk Setup

1. **Create a Clerk Application**
   - Go to [Clerk Dashboard](https://dashboard.clerk.com)
   - Click "Add application" or "Create application"
   - Choose a name for your application (e.g., "Voice Guard")
   - Select your preferred sign-in methods (Email, Google, GitHub, etc.)

2. **Get Your Publishable Key**
   - In your Clerk dashboard, go to **API Keys** section
   - Copy the **Publishable Key** (starts with `pk_test_` or `pk_live_`)

3. **Configure Environment Variables**
   - Create a `.env` file in the `frontend` directory:
     ```bash
     cd frontend
     touch .env
     ```
   - Add your Clerk publishable key:
     ```env
     VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
     ```

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

Create a production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## 🎯 Usage

### Sign Up
1. Click on the "Sign Up" tab
2. Enter your first name and last name
3. Enter your email address
4. Create a password (minimum 8 characters)
5. Click "Create Account"
6. Check your email for a verification code
7. Enter the verification code to complete sign up

### Sign In
1. Enter your email and password
2. Optional: Check "Remember me"
3. Click "Sign In"
4. You'll be redirected to your dashboard upon successful authentication

### Social Login
- Click on Google or GitHub buttons to authenticate with those providers
- Make sure you've enabled these providers in your Clerk dashboard

## 🔧 Integration with Backend

The frontend uses Clerk for authentication. To integrate with your NestJS backend:

1. Ensure your backend is running and configured with Clerk
2. The frontend automatically includes Clerk session tokens in API requests
3. Your backend should verify these tokens using Clerk's backend SDK
4. See the `boilerplate-service` README for backend Clerk configuration

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── LoginPage.jsx       # Clerk-integrated login component
│   │   ├── LoginPage.css       # Login component styles
│   │   ├── Dashboard.jsx       # Protected dashboard component
│   │   └── Dashboard.css       # Dashboard styles
│   ├── App.jsx                 # Root application component with Clerk provider
│   ├── App.css                 # App styles
│   ├── main.jsx                # Entry point with ClerkProvider
│   └── index.css               # Global styles
├── index.html                  # HTML template
├── vite.config.js              # Vite configuration
├── .env                        # Environment variables (create this)
└── package.json                # Dependencies and scripts
```

## 🎨 Customization

### Colors
Edit the CSS variables in `src/index.css`:
```css
:root {
  --primary-color: #2563eb;
  --primary-dark: #1d4ed8;
  --primary-light: #3b82f6;
  /* ... other colors */
}
```

### Logo
Replace the SVG in the `.logo-icon` section of `LoginPage.jsx` with your own logo.

## 🔐 Security Notes

This application uses Clerk for authentication, which provides:
- ✅ Secure session management
- ✅ JWT token-based authentication
- ✅ OAuth 2.0 for social logins
- ✅ Email verification
- ✅ Password hashing and security best practices

For production use:
- Use HTTPS
- Set up proper CORS policies
- Configure Clerk webhooks for user events
- Implement rate limiting on your backend
- Use environment variables for all sensitive keys

## 📝 License

This project is part of the VOICE-GUARD application.
