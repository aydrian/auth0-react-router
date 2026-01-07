import type { Route } from "./+types/_index";
import { Welcome } from "../../welcome/welcome";
import { getAuth0 } from "@auth0/auth0-react-router";
import { getInstance } from "~/middleware/i18next";
import { data } from "react-router";
import { useTranslation } from "react-i18next";

export function meta({ loaderData }: Route.MetaArgs) {
  return [
    { title: loaderData.title },
    { name: "description", content: loaderData.description }
  ];
}

export async function loader({ context }: Route.LoaderArgs) {
  const { isAuthenticated, user } = getAuth0(context);
  let i18n = getInstance(context);

  return data({
    isAuthenticated,
    user,
    title: i18n.t("title"),
    description: i18n.t("description")
  });
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { isAuthenticated, user } = loaderData;
  let { t } = useTranslation();

  if (!isAuthenticated) {
    return <Welcome />;
  }

  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
        <header className="flex flex-col items-center gap-9">
          <h1 className="text-2xl font-bold">
            {t("welcome")}, {user?.name || user?.email || "User"}!
          </h1>
          <div className="flex gap-4 mt-4">
            <a
              href="/profile"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow"
            >
              {t("viewProfile")}
            </a>
            <a
              href="/auth/logout"
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow"
            >
              {t("logOut")}
            </a>
          </div>
        </header>
      </div>
    </main>
  );
}
