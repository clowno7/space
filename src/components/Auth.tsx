import React from "react";
import { useStore } from "../store";
import { User } from "../types";
import Auth0 from "auth0-js";

const auth0 = new Auth0.WebAuth({
  domain: "YOUR_AUTH0_DOMAIN",
  clientID: "YOUR_AUTH0_CLIENT_ID",
  redirectUri: "http://localhost:3000",
  responseType: "token id_token",
  scope: "openid profile email",
});

export function Auth() {
  const setUser = useStore((state) => state.setUser);

  const handleLogin = () => {
    // Simulate Auth0 authentication
    const mockUser: User = {
      id: "1",
      email: "test@example.com",
      name: "Test User",
      role: "user",
    };
    setUser(mockUser);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="fixed inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-10" />
      <div className="bg-slate-800 p-8 rounded-lg shadow-xl w-full max-w-md relative">
        <h2 className="text-2xl font-bold text-white mb-6">Sign In</h2>
        <button
          onClick={handleLogin}
          className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
        >
          Sign In with Auth0
        </button>
      </div>
    </div>
  );
}
