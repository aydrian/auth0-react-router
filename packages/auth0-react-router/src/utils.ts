import type { Auth0ReactRouterOptions } from './types.js';

export function getAuth0Options(options?: Partial<Auth0ReactRouterOptions>): Required<Auth0ReactRouterOptions> {
  // Get values from environment variables
  const env = typeof process !== 'undefined' ? process.env : {};

  const appBaseUrl = options?.appBaseUrl || env.APP_BASE_URL || '';
  const resolved: Required<Auth0ReactRouterOptions> = {
    domain: env.AUTH0_DOMAIN || '',
    clientId: env.AUTH0_CLIENT_ID || '',
    clientSecret: env.AUTH0_CLIENT_SECRET || '',
    appBaseUrl,
    sessionSecret: env.AUTH0_SECRET || '',
    authPath: '/auth',
    defaultLoginRedirect: options?.defaultLoginRedirect || appBaseUrl,
    defaultLogoutRedirect: options?.defaultLogoutRedirect || appBaseUrl,
    ...options,
  };

  // Validate required values
  const requiredKeys: Array<keyof Auth0ReactRouterOptions> = [
    'domain',
    'clientId',
    'clientSecret',
    'appBaseUrl',
    'sessionSecret',
  ];

  for (const key of requiredKeys) {
    if (!resolved[key]) {
      throw new Error(`Missing required Auth0 option: ${key}`);
    }
  }

  return resolved;
}
