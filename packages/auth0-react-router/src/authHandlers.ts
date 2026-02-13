import { auth0Context } from './auth0Middleware.js';
import type { LoaderFunctionArgs } from 'react-router';
import { Auth0ContextType } from './types.js';

export async function loginRoute({ request, context }: LoaderFunctionArgs) {
  const { app, serverClient } = context.get(auth0Context) as Auth0ContextType;
  const url = new URL(request.url);
  const returnTo = url.searchParams.get('returnTo') || app.redirects.login;

  const response = new Response();
  const authorizationUrl = await serverClient.startInteractiveLogin(
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
  const { app, serverClient } = context.get(auth0Context) as Auth0ContextType;
  const response = new Response();
  const { appState } = await serverClient.completeInteractiveLogin<{ returnTo: string }>(
    new URL(request.url, app.baseUrl),
    {
      request,
      response,
    }
  );

  const headers = new Headers(response.headers);
  headers.set('Location', appState?.returnTo || app.redirects.login);

  return new Response(null, { status: 302, headers });
}

export async function logoutRoute({ request, context }: LoaderFunctionArgs) {
  const { app, serverClient } = context.get(auth0Context) as Auth0ContextType;
  const response = new Response();
  const returnTo = app.redirects.logout;
  const logoutUrl = await serverClient.logout({ returnTo }, { request, response });

  const headers = new Headers(response.headers);
  headers.set('Location', logoutUrl.href);

  return new Response(null, { status: 302, headers });
}

export async function connectAccountRoute({ request, context }: LoaderFunctionArgs) {
  const { app, serverClient } = context.get(auth0Context) as Auth0ContextType;
  const url = new URL(request.url);
  const connection = url.searchParams.get('connection');
  const connectionScope = url.searchParams.get('connectionScope') || 'profile';
  const returnTo = url.searchParams.get('returnTo') || app.redirects.login;

  if (!connection) {
    throw new Response('Missing required parameter: connection', { status: 400 });
  }

  const response = new Response();
  const authorizationUrl = await serverClient.startLinkUser(
    {
      connection,
      connectionScope,
      appState: { returnTo },
    },
    { request, response }
  );

  const headers = new Headers(response.headers);
  headers.set('Location', authorizationUrl.href);

  return new Response(null, { status: 302, headers });
}

export async function connectAccountCallbackRoute({ context, request }: LoaderFunctionArgs) {
  const { app, serverClient } = context.get(auth0Context) as Auth0ContextType;
  const response = new Response();
  const { appState } = await serverClient.completeLinkUser<{ returnTo: string }>(
    new URL(request.url, app.baseUrl),
    {
      request,
      response,
    }
  );

  const headers = new Headers(response.headers);
  headers.set('Location', appState?.returnTo || app.redirects.login);

  return new Response(null, { status: 302, headers });
}

export async function disconnectAccountRoute({ request, context }: LoaderFunctionArgs) {
  const { app, serverClient } = context.get(auth0Context) as Auth0ContextType;
  const url = new URL(request.url);
  const connection = url.searchParams.get('connection');
  const returnTo = url.searchParams.get('returnTo') || app.redirects.login;

  if (!connection) {
    throw new Response('Missing required parameter: connection', { status: 400 });
  }

  const response = new Response();
  const authorizationUrl = await serverClient.startUnlinkUser(
    {
      connection,
      appState: { returnTo },
    },
    { request, response }
  );

  const headers = new Headers(response.headers);
  headers.set('Location', authorizationUrl.href);

  return new Response(null, { status: 302, headers });
}

export async function disconnectAccountCallbackRoute({ context, request }: LoaderFunctionArgs) {
  const { app, serverClient } = context.get(auth0Context) as Auth0ContextType;
  const response = new Response();
  const { appState } = await serverClient.completeUnlinkUser<{ returnTo: string }>(
    new URL(request.url, app.baseUrl),
    {
      request,
      response,
    }
  );

  const headers = new Headers(response.headers);
  headers.set('Location', appState?.returnTo || app.redirects.login);

  return new Response(null, { status: 302, headers });
}
