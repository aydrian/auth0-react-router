import { useTranslation } from "react-i18next";
import { Form, useLocation } from "react-router";
import type { Route } from "./+types/locale-switcher";
import { redirect } from "react-router";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);

  return redirect(url.searchParams.get("returnTo") || url.pathname);
}

export function LocaleSwitcher() {
  const { i18n } = useTranslation();
  const location = useLocation();
  return (
    <Form className="flex gap-2 ml-auto">
      <button
        type="submit"
        name="lng"
        value="ja"
        className={`px-3 py-1 rounded border transition-colors duration-150 ${i18n.language === "ja" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"}`}
      >
        日本語
      </button>
      <button
        type="submit"
        name="lng"
        value="en"
        className={`px-3 py-1 rounded border transition-colors duration-150 ${i18n.language === "en" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"}`}
      >
        English
      </button>
    </Form>
  );
}
