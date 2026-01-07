import { Outlet } from "react-router";
import { useTranslation } from "react-i18next";
import { LocaleSwitcher } from "../resources/locale-switcher";

export async function action() {
  return null;
}
export default function Layout() {
  let { t } = useTranslation();

  return (
    <div className="h-screen flex flex-col">
      <header className="flex items-center justify-between px-6 py-4">
        <LocaleSwitcher />
      </header>
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <footer className="bg-gray-100">
        <p className="text-center p-4 text-sm text-gray-500">
          {t("copyright")} © 2026 Auth0.
        </p>
      </footer>
    </div>
  );
}
