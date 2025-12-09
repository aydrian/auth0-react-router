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

### 3. Configure Auth0ReactRouter

You can configure the SDK by passing options directly to `Auth0ReactRouter`, or by setting environment variables. If an option is not provided, `Auth0ReactRouter` will automatically pull from the following environment variables:

**Supported Environment Variables:**

- `AUTH0_DOMAIN`: Your Auth0 domain
- `AUTH0_CLIENT_ID`: Your Auth0 client ID
- `AUTH0_CLIENT_SECRET`: Your Auth0 client secret
- `AUTH0_SECRET`: Secret for session encryption
- `APP_BASE_URL`: The base URL of your app

**Supported Options:**

- `domain`: Your Auth0 domain
- `clientId`: Your Auth0 client ID
- `clientSecret`: Your Auth0 client secret
- `sessionSecret`: Secret for session encryption
- `appBaseUrl`: The base URL of your app
- `authPath`: (optional) Path for auth routes (default: `/auth`)
- `defaultLoginRedirect`: (optional) Default login redirect URL (default: appBaseUrl)
- `defaultLogoutRedirect`: (optional) Default logout redirect URL (default: appBaseUrl)

You can override any environment variable by passing the corresponding option directly:

```typescript
import { Auth0ReactRouter } from 'auth0-react-router';

const auth0ReactRouter = Auth0ReactRouter({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  sessionSecret: process.env.AUTH0_SECRET,
  appBaseUrl: process.env.APP_BASE_URL,
  authPath: '/custom-auth', // Optional
});
```

### 4. Register Middleware

In your server entry or request handler setup, pass the `Auth0ReactRouterInstance` to the middleware:

```typescript
import { auth0Middleware, Auth0ReactRouter } from 'auth0-react-router';

const auth0ReactRouter = Auth0ReactRouter({
  /* options */
});

export const middleware = [auth0Middleware({ auth0ReactRouter })];
```

### 5. Add Auth Routes

Create a catchall route file for your auth path (default `/auth/*`, or your custom path):

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
