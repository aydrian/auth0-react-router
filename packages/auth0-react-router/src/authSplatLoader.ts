// src/authSplatLoader.ts
import { loginRoute, callbackRoute, logoutRoute } from './authHandlers.js';
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
    default:
      throw new Response('Not Found', { status: 404 });
  }
}
