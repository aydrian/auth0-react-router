import { createContext, MiddlewareFunction } from 'react-router';
import type { Auth0ContextType, Auth0MiddlewareOptions } from './types.js';
import { Auth0ReactRouter } from './index.js';

// Create the Auth0 context
export const auth0Context = createContext<Auth0ContextType | null>(null);

// Middleware to attach Auth0 client and user/session info to context
export const auth0Middleware = (options?: Auth0MiddlewareOptions): MiddlewareFunction<Response> => {
  return async ({ request, context }, next) => {
    const opts = options || {};
    const auth0ReactRouter = opts.auth0ReactRouter ?? Auth0ReactRouter(opts);
    const { serverClient } = auth0ReactRouter;

    const user = await serverClient.getUser({ request, response: new Response() });
    const session = await serverClient.getSession({ request, response: new Response() });
    const isAuthenticated = !!user;

    // Attach to context
    context.set(auth0Context, {
      ...auth0ReactRouter,
      user,
      session,
      isAuthenticated,
    });
    return next();
  };
};

export const requireAuth: MiddlewareFunction<Response> = async ({ context, request }, next) => {
  const { isAuthenticated, app } = context.get(auth0Context) as Auth0ContextType;
  if (!isAuthenticated) {
    const url = new URL(request.url);
    const returnTo = url.pathname + url.search;
    const loginUrl = `${app.baseUrl}${app.authPath}/login?returnTo=${encodeURIComponent(returnTo)}`;
    return Response.redirect(loginUrl, 302);
  }
  return next();
};
