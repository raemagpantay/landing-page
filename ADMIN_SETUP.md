# Admin Access Setup Guide

This guide explains how to set up admin access for users in your application.

## Overview

The application now supports automatic redirection to the admin dashboard when an admin user logs in through the sign-in page.

## How It Works

1. When a user signs in, the system checks if they have admin privileges
2. Admin users are automatically redirected to `/Admin` (Admin Dashboard)
3. Regular users are redirected to the homepage `/`

## Setting Up an Admin User

To grant admin privileges to a user, you need to set a custom claim in Firebase. You can do this in two ways:

### Method 1: Using the Set Admin API Endpoint

Make a POST request to `/api/set-admin` with the following body:

```json
{
  "email": "admin@example.com",
  "isAdmin": true
}
```

Example using curl:
```bash
curl -X POST http://localhost:3000/api/set-admin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","isAdmin":true}'
```

Example using PowerShell:
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/set-admin" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"email":"admin@example.com","isAdmin":true}'
```

### Method 2: Using Firebase Admin SDK Directly

You can also use the Firebase Admin SDK in a script or Cloud Function:

```javascript
const admin = require('firebase-admin');

// Initialize admin SDK
admin.initializeApp();

// Set admin claim
async function setAdminClaim(email) {
  const user = await admin.auth().getUserByEmail(email);
  await admin.auth().setCustomUserClaims(user.uid, { admin: true });
  console.log(`Admin privileges granted to ${email}`);
}

setAdminClaim('admin@example.com');
```

## Removing Admin Privileges

To remove admin privileges from a user, make the same API call with `isAdmin: false`:

```json
{
  "email": "admin@example.com",
  "isAdmin": false
}
```

## Important Notes

1. **Refresh Token**: After setting admin privileges, the user needs to sign out and sign in again for the changes to take effect, or their token needs to be refreshed.

2. **Security**: The `/api/set-admin` endpoint should be secured in production. Consider:
   - Adding authentication to ensure only authorized users can set admin privileges
   - Using environment variables to restrict who can call this endpoint
   - Moving this functionality to a secure admin-only interface

3. **Admin Dashboard Access**: The admin dashboard at `/Admin` should also be protected to ensure only authenticated admin users can access it.

## Features

- ✅ Automatic redirect to admin dashboard on login
- ✅ Admin status check API endpoint
- ✅ Admin claim management API endpoint
- ✅ Auth context includes admin status for easy access in components

## Using Admin Status in Components

You can check if a user is an admin in any component using the auth context:

```typescript
import { useAuth } from '@/app/context/auth-context';

function MyComponent() {
  const { user, isAdmin, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {isAdmin ? (
        <p>You are an admin!</p>
      ) : (
        <p>You are a regular user</p>
      )}
    </div>
  );
}
```
