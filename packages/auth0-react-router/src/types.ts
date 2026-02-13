import type { ServerClient, SessionData, UserClaims } from '@auth0/auth0-server-js';

export interface Auth0ReactRouterOptions {
  authPath?: string;
  defaultLoginRedirect?: string;
  defaultLogoutRedirect?: string;
  domain?: string;
  clientId?: string;
  clientSecret?: string;
  appBaseUrl?: string;
  sessionSecret?: string;
}

export interface Auth0ReactRouterInstance {
  app: {
    authPath: string;
    baseUrl: string;
    redirects: {
      login: string;
      logout: string;
    };
  };
  serverClient: ServerClient<StoreOptions>;
}

export interface StoreOptions {
  request: Request;
  response: Response;
}

export type Auth0MiddlewareOptions = Auth0ReactRouterOptions & {
  auth0ReactRouter?: Auth0ReactRouterInstance;
};

export type Auth0ContextType = Auth0ReactRouterInstance & {
  user?: UserClaims;
  session?: SessionData;
  isAuthenticated: boolean;
};

// Export types for account linking and unlinking
export type {
  StartLinkUserOptions,
  StartUnlinkUserOptions,
} from '@auth0/auth0-server-js';
