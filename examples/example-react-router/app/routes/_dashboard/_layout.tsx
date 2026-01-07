import { Outlet } from "react-router";

export default function Layout() {
  return (
    <div className="h-screen flex flex-col">
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <footer className="bg-gray-100">
        <p className="text-center p-4 text-sm text-gray-500">
          © 2026 Auth0. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
