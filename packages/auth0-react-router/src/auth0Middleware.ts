import { createContext, MiddlewareFunction } from 'react-router';
import type { ServerClient, SessionData, UserClaims } from '@auth0/auth0-server-js';
import type { Auth0MiddlewareOptions } from './types.js';
import { Auth0 } from './index.js';

// Define the shape of the Auth0 context
export interface Auth0ContextType {
  auth0Client: ServerClient;
  user?: UserClaims;
  session?: SessionData;
  isAuthenticated: boolean;
  appBaseUrl: string;
}

// Create the Auth0 context
export const auth0Context = createContext<Auth0ContextType | null>(null);

// Middleware to attach Auth0 client and user/session info to context
export const auth0Middleware = (options?: Auth0MiddlewareOptions): MiddlewareFunction<Response> => {
  return async ({ request, context }, next) => {
    let auth0Client;
    const opts = options || {};

    // The App's Base URL must be set so we can add it to context to use in routes. Might be a better way.
    let appBaseUrl = opts.appBaseUrl;
    if (!appBaseUrl) {
      appBaseUrl = typeof process !== 'undefined' ? process.env.APP_BASE_URL : undefined;
    }
    if (!appBaseUrl) {
      throw new Error('Missing required appBaseUrl. Provide it in options or set APP_BASE_URL in the environment.');
    }

    if (!opts.auth0Client) {
      auth0Client = Auth0(opts);
    } else {
      auth0Client = opts.auth0Client;
    }

    const user = await auth0Client.getUser({ request, response: new Response() });
    const session = await auth0Client.getSession({ request, response: new Response() });
    const isAuthenticated = !!user;
    // Attach to context
    context.set(auth0Context, { auth0Client, user, session, isAuthenticated, appBaseUrl });
    return next();
  };
};
