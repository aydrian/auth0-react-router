// src/authSplatLoader.ts
import {
  loginRoute,
  callbackRoute,
  logoutRoute,
  connectAccountRoute,
  connectAccountCallbackRoute,
  disconnectAccountRoute,
  disconnectAccountCallbackRoute,
} from './authHandlers.js';
import type { LoaderFunctionArgs } from 'react-router';

export async function authSplatLoader(args: LoaderFunctionArgs) {
  const { params } = args;
  switch (params['*']) {
    case 'login':
      return loginRoute(args);
    case 'callback':
      return callbackRoute(args);
    case 'logout':
      return logoutRoute(args);
    case 'connect-account':
      return connectAccountRoute(args);
    case 'connect-account/callback':
      return connectAccountCallbackRoute(args);
    case 'disconnect-account':
      return disconnectAccountRoute(args);
    case 'disconnect-account/callback':
      return disconnectAccountCallbackRoute(args);
    default:
      throw new Response('Not Found', { status: 404 });
  }
}
