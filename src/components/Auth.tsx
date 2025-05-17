import { useStore } from "../store";
import { useState } from "react";

export function Auth() {
  const setUser = useStore((state) => state.setUser);
  const [formError, setFormError] = useState(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
      const response = await fetch("/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Authentication failed");
      }

      const data = await response.json();
      localStorage.setItem("token", data.access);
      const user = await fetchUser();
      setUser(user);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }

    const response = await fetch("/api/users/me/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }

    return response.json();
  };

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center"
      style={{
        background: `linear-gradient(to right, #1e293b, #2d3748)`,
        animation: `gradientAnimation 10s ease infinite`,
        height: "100vh",
      }}
    >
      <div className="flex flex-col items-center justify-center h-full">
        <div className="bg-slate-800 p-8 rounded-lg shadow-xl w-full max-w-md relative">
          <h2 className="text-2xl font-bold text-white mb-6">Sign In</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full py-2 px-4 border border-gray-300 rounded-lg mb-4"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full py-2 px-4 border border-gray-300 rounded-lg mb-4"
          />
          <button
            onClick={handleLogin}
            className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
