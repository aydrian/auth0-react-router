import { ServerClient, type StateData, type TransactionData } from '@auth0/auth0-server-js';
import { createCookieSessionStorage } from 'react-router';
import { ReactRouterTransactionStore } from './store/react-router-transaction-store.js';
import { ReactRouterSessionStore } from './store/react-router-session-store.js';
import type { Auth0ReactRouterOptions } from './types.js';

const StateStorage = createCookieSessionStorage<StateData>({
  cookie: {
    name: '__a0_session',
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    secrets: [process.env.AUTH0_SECRET || 'dev-secret'],
  },
});
const TransactionStorage = createCookieSessionStorage<TransactionData>({
  cookie: {
    name: '__a0_tx',
    httpOnly: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    secrets: [process.env.AUTH0_SECRET || 'dev-secret'],
  },
});

export function Auth0(options: Auth0ReactRouterOptions) {
  const callbackPath = '/auth/callback';
  const redirectUri = new URL(callbackPath, options.appBaseUrl);

  const auth0Client = new ServerClient({
    domain: options.domain,
    clientId: options.clientId,
    clientSecret: options.clientSecret,
    authorizationParams: {
      redirect_uri: redirectUri.toString(),
    },
    transactionStore: new ReactRouterTransactionStore(
      { secret: options.sessionSecret || 'dev-secret' },
      TransactionStorage
    ),
    stateStore: new ReactRouterSessionStore({ secret: options.sessionSecret || 'dev-secret' }, StateStorage),
  });

  return auth0Client;
}

export { auth0Middleware } from './auth0Middleware.js';
export { authSplatLoader } from './authSplatLoader.js';
