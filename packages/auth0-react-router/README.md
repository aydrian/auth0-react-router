# Auth0 React Router SDK

## Overview

This SDK provides seamless Auth0 authentication and route protection for React Router v7 Framework Mode using server-side middleware. It enables secure login, logout, callback handling, and easy protection of routes with minimal configuration.

## Features

- Auth0 server client integration
- Middleware for authentication and user/session context
- Route protection via middleware
- Easy-to-use helpers for loaders and actions
- Splat route support for `/auth/*` endpoints
- Utilities for accessing user/session data

## Getting Started

### 1. Install the SDK

```bash
npm install auth0-react-router
```

### 2. Enable Middleware in React Router

Add the future setting to your `react-router.config.ts`:

```typescript
export default {
  future: {
    middleware: true,
  },
};
```

### 3. Configure Auth0 Client

Set environment variables in your server environment:

- `AUTH0_DOMAIN`
- `AUTH0_CLIENT_ID`
- `AUTH0_CLIENT_SECRET`
- `AUTH0_SECRET` (for session)
- `APP_BASE_URL`

Or pass these options directly to the SDK.

### 4. Register Middleware

In your server entry or request handler setup:

```typescript
import { auth0Middleware } from 'auth0-react-router';

export const middleware = [auth0Middleware()];
```

### 5. Add Auth Routes

Create a catchall route file for `/auth/*`:

```typescript
// app/routes/auth.$.ts
export { authSplatLoader as loader } from 'auth0-react-router';
```

### 6. Protect Routes

Add the `requireAuth` middleware to any route you want to protect:

```typescript
import { requireAuth } from 'auth0-react-router';

export const middleware = [requireAuth];
```

### 7. Access User/Session in Loaders

Use the provided utility to access the Auth0 context:

```typescript
import { getAuth0 } from 'auth0-react-router';

export async function loader({ context }) {
  const auth0 = getAuth0(context);
  return { user: auth0.user };
}
```

## Example

See the `examples/example-react-router` directory for a full working app.

## License

MIT
