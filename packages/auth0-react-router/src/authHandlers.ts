import { auth0Context } from './auth0Middleware.js';
import type { LoaderFunctionArgs } from 'react-router';
import { Auth0ContextType } from './types.js';

export async function loginRoute({ request, context }: LoaderFunctionArgs) {
  const { appBaseUrl, auth0Client } = context.get(auth0Context) as Auth0ContextType;
  // Build the Auth0 authorize URL and redirect
  const url = new URL(request.url);
  const returnTo = url.searchParams.get('returnTo') || appBaseUrl;
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
  const { appBaseUrl, auth0Client } = context.get(auth0Context) as Auth0ContextType;
  const response = new Response();
  const { appState } = await auth0Client.completeInteractiveLogin<{ returnTo: string }>(
    new URL(request.url, appBaseUrl),
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
  const { appBaseUrl, auth0Client } = context.get(auth0Context) as Auth0ContextType;
  const response = new Response();
  const returnTo = appBaseUrl;
  const logoutUrl = await auth0Client.logout({ returnTo }, { request, response });

  const headers = new Headers(response.headers);
  headers.set('Location', logoutUrl.href);

  return new Response(null, { status: 302, headers });
}
