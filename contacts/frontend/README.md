# VOICE-GUARD Login Portal

A modern, responsive login portal UI for the VOICE-GUARD application.

## 🎨 Features

- **Modern Design**: Clean, professional interface with smooth animations
- **Responsive**: Works perfectly on desktop, tablet, and mobile devices
- **Form Validation**: Client-side validation with helpful error messages
- **Tab Toggle**: Easy switching between Login and Sign Up modes
- **Social Login**: UI for Google and GitHub authentication
- **Loading States**: Visual feedback during form submission
- **Accessible**: Keyboard navigation and screen reader friendly

## 🚀 Getting Started

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

The application will be available at `http://localhost:3000`

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

### Login Mode
- Enter your email and password
- Optional: Check "Remember me"
- Click "Sign In" or use "Forgot password?" link

### Sign Up Mode
- Enter your full name
- Enter your email address
- Create a password (minimum 8 characters)
- Confirm your password
- Click "Create Account"

### Social Login
- Click on Google or GitHub buttons to authenticate with those providers

## 🔧 Integration with Backend

The frontend is configured to proxy API requests to the backend service running on port 4000. To integrate with your NestJS backend:

1. Ensure your backend is running on `http://localhost:4000`
2. Update the API endpoints in the components as needed
3. Configure authentication middleware (Clerk) as per the backend setup

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── LoginPage.jsx      # Main login component
│   │   └── LoginPage.css       # Login component styles
│   ├── App.jsx                 # Root application component
│   ├── App.css                 # App styles
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles
├── index.html                  # HTML template
├── vite.config.js              # Vite configuration
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

This is a UI demo. For production use:
- Implement proper backend authentication
- Add CSRF protection
- Use HTTPS
- Implement rate limiting
- Add proper session management
- Secure API endpoints

## 📝 License

This project is part of the VOICE-GUARD application.
