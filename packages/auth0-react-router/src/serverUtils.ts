import { auth0Context } from './auth0Middleware.js';
import type { RouterContextProvider } from 'react-router';
import type { Auth0ContextType } from './types.js';

export function getAuth0(context: Readonly<RouterContextProvider>) {
  const auth0 = context.get(auth0Context) as Auth0ContextType;

  if (!auth0) {
    throw new Response('Auth0 context is missing. Ensure auth0Middleware is registered for this route.', {
      status: 500,
    });
  }

  return auth0;
}

export function getUser(context: Readonly<RouterContextProvider>) {
  const auth0 = getAuth0(context);
  const { user } = auth0;

  if (!user) {
    throw new Response('User is not authenticated. Please log in to access this resource.', { status: 401 });
  }

  return user;
}
