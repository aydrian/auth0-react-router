export interface Auth0ReactRouterOptions {
  domain: string;
  clientId: string;
  clientSecret: string;
  appBaseUrl: string;
  sessionSecret: string;
}

export interface StoreOptions {
  request: Request;
  response: Response;
}
