import type { LoaderFunctionArgs } from 'react-router';
import { getAuth0, createRedirectResponse } from './serverUtils.js';

/**
 * Initiates an Auth0 interactive login flow.
 *
 * Starts the OAuth 2.0 authorization code flow by redirecting the user to Auth0's
 * authorization endpoint. Preserves the requested destination in appState for
 * post-login redirect.
 *
 * @param args.request - The incoming HTTP request
 * @param args.context - React Router context containing Auth0 instance
 *
 * @returns A 302 redirect response to Auth0's authorization endpoint with session cookies
 *
 * @throws {Response} 500 - If Auth0 context is missing or login initiation fails
 *
 * Query parameters:
 * - `returnTo` (optional) - URL to redirect to after successful login. Defaults to configured login redirect.
 *
 * @example
 * ```typescript
 * // In your route file
 * import { loginRoute } from '@auth0/auth0-react-router';
 *
 * export const loader = loginRoute;
 * ```
 */
export async function loginRoute({ request, context }: LoaderFunctionArgs) {
  try {
    const { app, serverClient } = getAuth0(context);
    const url = new URL(request.url);
    const returnTo = url.searchParams.get('returnTo') || app.redirects.login;

    const response = new Response();
    const authorizationUrl = await serverClient.startInteractiveLogin(
      {
        appState: { returnTo },
      },
      { request, response }
    );

    return createRedirectResponse(response, authorizationUrl);
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error('Login failed:', error);
    throw new Response(
      `Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      { status: 500 }
    );
  }
}

/**
 * Completes the Auth0 interactive login flow.
 *
 * Handles the OAuth 2.0 authorization callback from Auth0, exchanges the authorization
 * code for tokens, establishes a session, and redirects the user to their intended
 * destination.
 *
 * @param args.context - React Router context containing Auth0 instance
 * @param args.request - The incoming HTTP request with Auth0 callback parameters
 *
 * @returns A 302 redirect response to the returnTo URL (from appState) or default login redirect
 *
 * @throws {Response} 500 - If Auth0 context is missing or callback processing fails
 *
 * Query parameters (provided by Auth0):
 * - `code` - Authorization code from Auth0
 * - `state` - State parameter for CSRF protection
 *
 * @example
 * ```typescript
 * // In your route file
 * import { callbackRoute } from '@auth0/auth0-react-router';
 *
 * export const loader = callbackRoute;
 * ```
 */
export async function callbackRoute({ context, request }: LoaderFunctionArgs) {
  try {
    const { app, serverClient } = getAuth0(context);
    const response = new Response();
    const { appState } = await serverClient.completeInteractiveLogin<{ returnTo: string }>(
      new URL(request.url, app.baseUrl),
      {
        request,
        response,
      }
    );

    return createRedirectResponse(response, appState?.returnTo || app.redirects.login);
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error('Login callback failed:', error);
    throw new Response(
      `Authentication callback failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      { status: 500 }
    );
  }
}

/**
 * Initiates an Auth0 logout flow.
 *
 * Terminates the user's Auth0 session and redirects to Auth0's logout endpoint,
 * which then redirects back to the configured logout URL.
 *
 * @param args.request - The incoming HTTP request
 * @param args.context - React Router context containing Auth0 instance
 *
 * @returns A 302 redirect response to Auth0's logout endpoint
 *
 * @throws {Response} 500 - If Auth0 context is missing or logout initiation fails
 *
 * @example
 * ```typescript
 * // In your route file
 * import { logoutRoute } from '@auth0/auth0-react-router';
 *
 * export const loader = logoutRoute;
 * ```
 */
export async function logoutRoute({ request, context }: LoaderFunctionArgs) {
  try {
    const { app, serverClient } = getAuth0(context);
    const response = new Response();
    const returnTo = app.redirects.logout;
    const logoutUrl = await serverClient.logout({ returnTo }, { request, response });

    return createRedirectResponse(response, logoutUrl);
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error('Logout failed:', error);
    throw new Response(
      `Logout failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      { status: 500 }
    );
  }
}

/**
 * Initiates an Auth0 account linking flow.
 *
 * Starts the process of linking an additional identity provider account to the
 * currently authenticated user. Requires the user to be authenticated.
 *
 * @param args.request - The incoming HTTP request
 * @param args.context - React Router context containing Auth0 instance
 *
 * @returns A 302 redirect response to Auth0's authorization endpoint for account linking
 *
 * @throws {Response} 400 - If required 'connection' parameter is missing
 * @throws {Response} 401 - If user is not authenticated
 * @throws {Response} 500 - If Auth0 context is missing or account linking initiation fails
 *
 * Query parameters:
 * - `connection` (required) - The identity provider connection to link (e.g., 'google-oauth2', 'github')
 * - `scopes` (optional, repeatable) - Provider-specific OAuth scopes. Defaults to 'profile'.
 * - `returnTo` (optional) - URL to redirect to after successful linking. Defaults to configured login redirect.
 * - Any other query parameters are passed through as authorization parameters (e.g., `scope`, `audience`)
 *
 * @example
 * ```typescript
 * // In your route file
 * import { connectAccountRoute } from '@auth0/auth0-react-router';
 *
 * export const loader = connectAccountRoute;
 *
 * // Basic account linking (uses default scope 'profile')
 * // GET /auth/connect-account?connection=google-oauth2&returnTo=/profile
 *
 * // Request Google Calendar permissions (multiple scopes)
 * // GET /auth/connect-account?connection=google-oauth2&scopes=profile&scopes=email&scopes=https://www.googleapis.com/auth/calendar&returnTo=/profile
 *
 * // Request GitHub repo access
 * // GET /auth/connect-account?connection=github&scopes=user:email&scopes=repo&returnTo=/profile
 *
 * // Pass additional authorization parameters (OAuth scope, audience)
 * // GET /auth/connect-account?connection=google-oauth2&scopes=profile&scopes=email&scope=openid%20profile%20email%20offline_access&audience=https://api.example.com&returnTo=/profile
 * ```
 */
export async function connectAccountRoute({ request, context }: LoaderFunctionArgs) {
  try {
    const auth0 = getAuth0(context);
    const { app, serverClient, isAuthenticated } = auth0;

    if (!isAuthenticated) {
      throw new Response('User must be authenticated to connect an account', { status: 401 });
    }

    const url = new URL(request.url);
    const connection = url.searchParams.get('connection');
    const returnTo = url.searchParams.get('returnTo') || app.redirects.login;
    const scopes = url.searchParams.getAll('scopes');

    if (!connection) {
      throw new Response('Missing required parameter: connection', { status: 400 });
    }

    // Build connectionScope from scopes array (join with spaces)
    // Default to 'profile' if no scopes provided
    const connectionScope = scopes.length > 0 ? scopes.join(' ') : 'profile';

    // Pass through all other query params as authorizationParams
    // Filter out reserved params: connection, returnTo, scopes
    const authorizationParams = Object.fromEntries(
      [...url.searchParams.entries()].filter(
        ([key]) => key !== 'connection' && key !== 'returnTo' && key !== 'scopes'
      )
    );

    const response = new Response();
    const authorizationUrl = await serverClient.startLinkUser(
      {
        connection,
        connectionScope,
        appState: { returnTo },
        ...(Object.keys(authorizationParams).length > 0 && { authorizationParams }),
      },
      { request, response }
    );

    return createRedirectResponse(response, authorizationUrl);
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error('Connect account failed:', error);
    throw new Response(
      `Connect account failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      { status: 500 }
    );
  }
}

/**
 * Completes the Auth0 account linking flow.
 *
 * Handles the OAuth callback from Auth0 after the user has authenticated with the
 * additional identity provider. Links the new identity to the user's existing account
 * and redirects to the intended destination.
 *
 * @param args.context - React Router context containing Auth0 instance
 * @param args.request - The incoming HTTP request with Auth0 callback parameters
 *
 * @returns A 302 redirect response to the returnTo URL (from appState) or default login redirect
 *
 * @throws {Response} 500 - If Auth0 context is missing or callback processing fails
 *
 * Query parameters (provided by Auth0):
 * - `code` - Authorization code from Auth0
 * - `state` - State parameter for CSRF protection
 *
 * @example
 * ```typescript
 * // In your route file
 * import { connectAccountCallbackRoute } from '@auth0/auth0-react-router';
 *
 * export const loader = connectAccountCallbackRoute;
 * ```
 */
export async function connectAccountCallbackRoute({ context, request }: LoaderFunctionArgs) {
  try {
    const { app, serverClient } = getAuth0(context);
    const response = new Response();
    const { appState } = await serverClient.completeLinkUser<{ returnTo: string }>(
      new URL(request.url, app.baseUrl),
      {
        request,
        response,
      }
    );

    return createRedirectResponse(response, appState?.returnTo || app.redirects.login);
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error('Connect account callback failed:', error);
    throw new Response(
      `Connect account callback failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      { status: 500 }
    );
  }
}

/**
 * Initiates an Auth0 account unlinking flow.
 *
 * Starts the process of unlinking an identity provider account from the currently
 * authenticated user. Requires the user to be authenticated.
 *
 * @param args.request - The incoming HTTP request
 * @param args.context - React Router context containing Auth0 instance
 *
 * @returns A 302 redirect response to Auth0's authorization endpoint for account unlinking
 *
 * @throws {Response} 400 - If required 'connection' parameter is missing
 * @throws {Response} 401 - If user is not authenticated
 * @throws {Response} 500 - If Auth0 context is missing or account unlinking initiation fails
 *
 * Query parameters:
 * - `connection` (required) - The identity provider connection to unlink (e.g., 'google-oauth2', 'github')
 * - `returnTo` (optional) - URL to redirect to after successful unlinking. Defaults to configured login redirect.
 *
 * @example
 * ```typescript
 * // In your route file
 * import { disconnectAccountRoute } from '@auth0/auth0-react-router';
 *
 * export const loader = disconnectAccountRoute;
 *
 * // Unlink a Google account
 * // GET /auth/disconnect-account?connection=google-oauth2&returnTo=/profile
 * ```
 */
export async function disconnectAccountRoute({ request, context }: LoaderFunctionArgs) {
  try {
    const auth0 = getAuth0(context);
    const { app, serverClient, isAuthenticated } = auth0;

    if (!isAuthenticated) {
      throw new Response('User must be authenticated to disconnect an account', { status: 401 });
    }

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

    return createRedirectResponse(response, authorizationUrl);
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error('Disconnect account failed:', error);
    throw new Response(
      `Disconnect account failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      { status: 500 }
    );
  }
}

/**
 * Completes the Auth0 account unlinking flow.
 *
 * Handles the OAuth callback from Auth0 after unlinking the identity provider
 * from the user's account. Redirects to the intended destination.
 *
 * @param args.context - React Router context containing Auth0 instance
 * @param args.request - The incoming HTTP request with Auth0 callback parameters
 *
 * @returns A 302 redirect response to the returnTo URL (from appState) or default login redirect
 *
 * @throws {Response} 500 - If Auth0 context is missing or callback processing fails
 *
 * Query parameters (provided by Auth0):
 * - `code` - Authorization code from Auth0
 * - `state` - State parameter for CSRF protection
 *
 * @example
 * ```typescript
 * // In your route file
 * import { disconnectAccountCallbackRoute } from '@auth0/auth0-react-router';
 *
 * export const loader = disconnectAccountCallbackRoute;
 * ```
 */
export async function disconnectAccountCallbackRoute({ context, request }: LoaderFunctionArgs) {
  try {
    const { app, serverClient } = getAuth0(context);
    const response = new Response();
    const { appState } = await serverClient.completeUnlinkUser<{ returnTo: string }>(
      new URL(request.url, app.baseUrl),
      {
        request,
        response,
      }
    );

    return createRedirectResponse(response, appState?.returnTo || app.redirects.login);
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error('Disconnect account callback failed:', error);
    throw new Response(
      `Disconnect account callback failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      { status: 500 }
    );
  }
}
