import type { ServerClient, SessionData, UserClaims } from '@auth0/auth0-server-js';

export interface Auth0ReactRouterOptions {
  domain?: string;
  clientId?: string;
  clientSecret?: string;
  appBaseUrl?: string;
  sessionSecret?: string;
}

export interface StoreOptions {
  request: Request;
  response: Response;
}

export type Auth0MiddlewareOptions = Auth0ReactRouterOptions & {
  auth0Client?: ServerClient<StoreOptions>;
};

export interface Auth0ContextType {
  auth0Client: ServerClient;
  user?: UserClaims;
  session?: SessionData;
  isAuthenticated: boolean;
  appBaseUrl: string;
}
