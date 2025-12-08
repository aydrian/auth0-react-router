import { auth0Context, Auth0ContextType } from './auth0Middleware.js';
import type { LoaderFunctionArgs } from 'react-router';

// TODO: Handle app base url better

export async function loginRoute({ request, context }: LoaderFunctionArgs) {
  const { auth0Client } = context.get(auth0Context) as Auth0ContextType;
  // Build the Auth0 authorize URL and redirect
  const url = new URL(request.url);
  const returnTo = url.searchParams.get('returnTo') || 'http://localhost:5173';
  console.log({ returnTo });

  const response = new Response();
  const authorizationUrl = await auth0Client.startInteractiveLogin(
    {
      appState: { returnTo },
    },
    { request, response }
  );

  const headers = new Headers(response.headers);
  headers.set('Location', authorizationUrl.href);

  return new Response(null, { status: 302, headers });
}

export async function callbackRoute({ context, request }: LoaderFunctionArgs) {
  const { auth0Client } = context.get(auth0Context) as Auth0ContextType;
  const response = new Response();
  const { appState } = await auth0Client.completeInteractiveLogin<{ returnTo: string }>(
    new URL(request.url, 'http://localhost:5173'),
    {
      request,
      response,
    }
  );
  console.log({ returnTo: appState?.returnTo });

  const headers = new Headers(response.headers);
  headers.set('Location', appState?.returnTo || '/');

  return new Response(null, { status: 302, headers });
}

export async function logoutRoute({ request, context }: LoaderFunctionArgs) {
  const { auth0Client } = context.get(auth0Context) as Auth0ContextType;
  const response = new Response();
  const returnTo = 'http://localhost:5173';
  const logoutUrl = await auth0Client.logout({ returnTo }, { request, response });

  const headers = new Headers(response.headers);
  headers.set('Location', logoutUrl.href);

  return new Response(null, { status: 302, headers });
}
