import type { Route } from "./+types/callback";
import { auth0Client } from "~/utils/auth0.server";
import { envServer } from "~/utils/env.server";

export async function loader({ request }: Route.LoaderArgs) {
  const response = new Response();
  const { appState } = await auth0Client.completeInteractiveLogin<
    { returnTo: string } | undefined
  >(new URL(request.url, envServer.APP_BASE_URL), { request, response });

  const headers = new Headers(response.headers);
  headers.set("Location", appState?.returnTo || envServer.APP_BASE_URL);

  return new Response(null, { status: 302, headers });
}
