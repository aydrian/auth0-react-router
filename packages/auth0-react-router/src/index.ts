import { ServerClient, type StateData, type TransactionData } from '@auth0/auth0-server-js';
import { createCookieSessionStorage } from 'react-router';
import { ReactRouterTransactionStore } from './store/react-router-transaction-store.js';
import { ReactRouterSessionStore } from './store/react-router-session-store.js';
import type { Auth0ReactRouterOptions } from './types.js';
import { getAuth0Options } from './utils.js';

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

export function Auth0(options?: Auth0ReactRouterOptions) {
  const resolvedOptions = getAuth0Options(options);
  const callbackPath = '/auth/callback';
  const redirectUri = new URL(callbackPath, resolvedOptions.appBaseUrl);

  const auth0Client = new ServerClient({
    domain: resolvedOptions.domain,
    clientId: resolvedOptions.clientId,
    clientSecret: resolvedOptions.clientSecret,
    authorizationParams: {
      redirect_uri: redirectUri.toString(),
    },
    transactionStore: new ReactRouterTransactionStore(
      { secret: resolvedOptions.sessionSecret || 'dev-secret' },
      TransactionStorage
    ),
    stateStore: new ReactRouterSessionStore({ secret: resolvedOptions.sessionSecret || 'dev-secret' }, StateStorage),
  });

  return auth0Client;
}

export { auth0Middleware, auth0Context } from './auth0Middleware.js';
export { authSplatLoader } from './authSplatLoader.js';
