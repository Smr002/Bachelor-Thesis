import { User } from "lucide-react";
import { useState, useEffect } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  role: "student" | "professor";
}

interface AuthState {
  user: User | null;
  token: string;
}

export function useAuth(): AuthState {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    token: "",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setAuth({ user: parsedUser, token: storedToken });
      } catch {
        setAuth({ user: null, token: "" });
      }
    }
  }, []);

  return auth;
}
