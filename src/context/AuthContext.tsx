import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { jwtDecode } from "jwt-decode"; // Usa esta forma
import { loginRequest } from "../services/authService"; // asegúrate de que esto existe

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  userId: number | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [userId, setUserId] = useState<number | null>(null);

  const isAuthenticated = !!token;

  useEffect(() => {
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUserId(decoded.userId || decoded.id); // depende del backend
      } catch (err) {
        console.error("Error decoding token:", err);
        logout();
      }
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      const token = await loginRequest(email, password);
      if (!token || typeof token !== "string") {
        throw new Error("Token no válido recibido del servidor");
      }

      setToken(token);
      localStorage.setItem("token", token);

      const decoded: any = jwtDecode(token);
      setUserId(decoded.userId || decoded.id);
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    }
  };

  const logout = () => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, token, userId, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
