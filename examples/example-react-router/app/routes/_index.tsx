import type { Route } from "./+types/_index";
import { Welcome } from "../welcome/welcome";
import { getAuth0, getUser } from "@auth0/auth0-react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" }
  ];
}

export async function loader({ context }: Route.LoaderArgs) {
  const { isAuthenticated, user } = getAuth0(context);

  return { isAuthenticated, user };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { isAuthenticated, user } = loaderData;

  if (!isAuthenticated) {
    return <Welcome />;
  }

  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
        <header className="flex flex-col items-center gap-9">
          <h1 className="text-2xl font-bold">
            Welcome, {user?.name || user?.email || "User"}!
          </h1>
          <div className="flex gap-4 mt-4">
            <a
              href="/profile"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow"
            >
              View Profile
            </a>
            <a
              href="/auth/logout"
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow"
            >
              Log out
            </a>
          </div>
        </header>
      </div>
    </main>
  );
}
