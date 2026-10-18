# Clerk Authentication Setup Guide

## Quick Setup Steps

1. **Create a Clerk Account**
   - Visit [https://clerk.com](https://clerk.com) and sign up
   - Create a new application

2. **Get Your Publishable Key**
   - In Clerk Dashboard → API Keys
   - Copy your **Publishable Key** (starts with `pk_test_` or `pk_live_`)

3. **Create Environment File**
   ```bash
   cd frontend
   touch .env
   ```

4. **Add Your Clerk Key**
   Open `.env` and add:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
   ```

5. **Enable OAuth Providers (Optional)**
   - In Clerk Dashboard → User & Authentication → Social Connections
   - Enable Google and/or GitHub if you want social login

6. **Start the Application**
   ```bash
   npm run dev
   ```

## Testing

1. Visit `http://localhost:5173`
2. Click "Sign Up" to create a new account
3. Enter your email and password
4. Check your email for verification code
5. Enter the code to complete sign up
6. You'll be redirected to the dashboard

## Troubleshooting

- **"Missing Clerk Publishable Key" error**: Make sure your `.env` file exists and contains `VITE_CLERK_PUBLISHABLE_KEY`
- **OAuth buttons not working**: Make sure you've enabled the OAuth providers in your Clerk dashboard
- **Email verification not working**: Check your Clerk dashboard email settings



