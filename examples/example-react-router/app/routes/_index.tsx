import type { Route } from "./+types/_index";
import { Welcome } from "../welcome/welcome";
import { auth0Client } from "~/utils/auth0.server";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" }
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const user = await auth0Client.getUser({ request, response: new Response() });

  return { user };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;

  if (!user) {
    return <Welcome />;
  }

  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
        <header className="flex flex-col items-center gap-9">
          <h1 className="text-2xl font-bold">
            Welcome, {user.name || user.email || "User"}!
          </h1>
          <a
            href="/auth/logout"
            className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow"
          >
            Log out
          </a>
        </header>
      </div>
    </main>
  );
}
