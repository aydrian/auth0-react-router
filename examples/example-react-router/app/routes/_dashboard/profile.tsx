import { getUser, requireAuth } from "@auth0/auth0-react-router";
import type { Route } from "./+types/profile";
import { useTranslation } from "react-i18next";

export const middleware = [requireAuth];

export async function loader({ context }: Route.LoaderArgs) {
  const user = getUser(context);

  return { user };
}

export default function Profile({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;
  const { t, i18n } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center bg-gray-50 flex-1 w-full">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
        <div className="flex items-center space-x-4 mb-6">
          {user.picture && (
            <img
              src={user.picture}
              alt={t("profile.pictureAlt", "Profile")}
              className="w-16 h-16 rounded-full border"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold">
              {user.name || user.nickname || user.email}
            </h1>
            {user.email && <p className="text-gray-600">{user.email}</p>}
          </div>
        </div>
        <div className="space-y-2">
          {user.nickname && (
            <div>
              <span className="font-semibold">
                {t("profile.nickname", "Nickname:")}
              </span>{" "}
              {user.nickname}
            </div>
          )}
          {user.updated_at && (
            <div>
              <span className="font-semibold">
                {t("profile.lastUpdated", "Last Updated:")}
              </span>{" "}
              {new Date(user.updated_at).toLocaleString(
                i18n.language || undefined
              )}
            </div>
          )}
          {user.sub && (
            <div>
              <span className="font-semibold">
                {t("profile.userId", "User ID:")}
              </span>{" "}
              {user.sub}
            </div>
          )}
        </div>
        <div className="mt-8 flex justify-center">
          <a
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow"
          >
            &larr; {t("profile.backToHome", "Back to Home")}
          </a>
        </div>
      </div>
    </div>
  );
}
