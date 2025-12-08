import { createContext, MiddlewareFunction } from 'react-router';
import type { ServerClient, SessionData, UserClaims } from '@auth0/auth0-server-js';
import { StoreOptions } from './types.js';

// Define the shape of the Auth0 context
export interface Auth0ContextType {
  auth0Client: ServerClient;
  user?: UserClaims;
  session?: SessionData;
  isAuthenticated: boolean;
}

// Create the Auth0 context
export const auth0Context = createContext<Auth0ContextType | null>(null);

// Middleware to attach Auth0 client and user/session info to context
export const auth0Middleware = (auth0Client: ServerClient<StoreOptions>): MiddlewareFunction<Response> => {
  return async ({ request, context }, next) => {
    const user = await auth0Client.getUser({ request, response: new Response() });
    const session = await auth0Client.getSession({ request, response: new Response() });
    const isAuthenticated = !!user;
    // Attach to context
    context.set(auth0Context, { auth0Client, user, session, isAuthenticated });
    return next();
  };
};
