import { useStore } from "../store";
import { useState } from "react";

export function Auth() {
  const setUser = useStore((state) => state.setUser);
  const [formError, setFormError] = useState(null);

  const handleLogin = () => {
    const mockUser = {
      id: "1",
      email: "test@example.com",
      name: "Test User",
      role: "user",
    };
    setUser(mockUser);
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
          <button
            onClick={handleLogin}
            className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Sign In with Auth0
          </button>
        </div>
      </div>
    </div>
  );
}
