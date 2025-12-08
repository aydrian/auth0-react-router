import { getUser, requireAuth } from "@auth0/auth0-react-router";
import type { Route } from "./+types/profile";

export const middleware = [requireAuth];

export async function loader({ context }: Route.LoaderArgs) {
  const user = getUser(context);

  return { user };
}

export default function Profile({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="bg-red-100 text-red-700 p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-2">No user profile found</h2>
          <p>Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
        <div className="flex items-center space-x-4 mb-6">
          {user.picture && (
            <img
              src={user.picture}
              alt="Profile"
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
              <span className="font-semibold">Nickname:</span> {user.nickname}
            </div>
          )}
          {user.updated_at && (
            <div>
              <span className="font-semibold">Last Updated:</span>{" "}
              {new Date(user.updated_at).toLocaleString()}
            </div>
          )}
          {user.sub && (
            <div>
              <span className="font-semibold">User ID:</span> {user.sub}
            </div>
          )}
        </div>
        <div className="mt-8 flex justify-center">
          <a
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow"
          >
            &larr; Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
