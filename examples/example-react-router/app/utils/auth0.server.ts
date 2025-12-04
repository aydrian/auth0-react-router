import { Auth0 } from "@auth0/auth0-react-router";
import { envServer } from "~/utils/env.server";

export const auth0Client = Auth0({
  domain: envServer.AUTH0_DOMAIN,
  clientId: envServer.AUTH0_CLIENT_ID,
  clientSecret: envServer.AUTH0_CLIENT_SECRET,
  appBaseUrl: envServer.APP_BASE_URL,
  sessionSecret: envServer.AUTH0_SECRET
});
