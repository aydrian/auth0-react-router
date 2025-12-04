import type { Route } from "./+types/logout";
import { auth0Client } from "~/utils/auth0.server";
import { envServer } from "~/utils/env.server";

export async function loader({ request }: Route.LoaderArgs) {
  const response = new Response();
  const returnTo = envServer.APP_BASE_URL;
  const logoutUrl = await auth0Client.logout(
    { returnTo },
    { request, response }
  );

  const headers = new Headers(response.headers);
  headers.set("Location", logoutUrl.href);

  return new Response(null, { status: 302, headers });
}
