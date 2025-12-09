import { ServerClient, type StateData, type TransactionData } from '@auth0/auth0-server-js';
import { createCookieSessionStorage } from 'react-router';
import { ReactRouterTransactionStore } from './store/react-router-transaction-store.js';
import { ReactRouterSessionStore } from './store/react-router-session-store.js';
import type { Auth0ReactRouterInstance, Auth0ReactRouterOptions } from './types.js';
import { getAuth0Options } from './utils.js';

export function Auth0ReactRouter(options?: Auth0ReactRouterOptions): Auth0ReactRouterInstance {
  const {
    domain,
    clientId,
    clientSecret,
    sessionSecret,
    appBaseUrl,
    authPath,
    defaultLoginRedirect,
    defaultLogoutRedirect,
  } = getAuth0Options(options);

  const normalizedAuthPath = '/' + authPath.replace(/^\/|\/$/g, '');
  const callbackPath = `${normalizedAuthPath}/callback`;
  const redirectUri = new URL(callbackPath, appBaseUrl);

  const serverClient = new ServerClient({
    domain,
    clientId,
    clientSecret,
    authorizationParams: { redirect_uri: redirectUri.toString() },
    transactionStore: new ReactRouterTransactionStore(
      { secret: sessionSecret },
      createCookieSessionStorage<TransactionData>({
        cookie: {
          name: '__a0_tx',
          httpOnly: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          secrets: [sessionSecret],
        },
      })
    ),
    stateStore: new ReactRouterSessionStore(
      { secret: sessionSecret },
      createCookieSessionStorage<StateData>({
        cookie: {
          name: '__a0_session',
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
          secure: process.env.NODE_ENV === 'production',
          secrets: [sessionSecret],
        },
      })
    ),
  });

  return {
    app: {
      baseUrl: appBaseUrl,
      authPath: normalizedAuthPath,
      redirects: {
        login: defaultLoginRedirect,
        logout: defaultLogoutRedirect,
      },
    },
    serverClient,
  };
}

export { auth0Middleware, auth0Context, requireAuth } from './auth0Middleware.js';
export { authSplatLoader } from './authSplatLoader.js';
export { getAuth0, getUser } from './serverUtils.js';
