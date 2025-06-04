import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { loginRequest } from "../services/authService";
import { getUserById } from "../services/userService";
import axios from "axios";

interface UserData {
  id: number;
  name: string;
  surname: string;
  profileImage?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  userId: number | null;
  user: UserData | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [userId, setUserId] = useState<number | null>(null);
  const [user, setUser] = useState<UserData | null>(null);

  const isAuthenticated = !!token;

  useEffect(() => {
    const initializeUser = async () => {
      if (token) {
        try {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  
          const decoded: any = jwtDecode(token);
          const rawId = decoded?.id;
  
          if (typeof rawId !== "number") {
            throw new Error("El token no contiene un ID válido");
          }
  
          const id: number = rawId; 
          setUserId(id);
  
          const userData = await getUserById(id);
          setUser({
            id: userData.id,
            name: userData.name,
            surname: userData.surname,
            //profileImage: userData.profileImage,
          });
        } catch (err) {
          console.error("Error decoding token:", err);
          logout();
        }
      } else {
        delete axios.defaults.headers.common["Authorization"];
      }
    };
  
    initializeUser();
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
      const id = (decoded.userId || decoded.id) as number;
      setUserId(id);

      const userData = await getUserById(id);
      setUser({
      id: userData.id as number,
      name: userData.name,
      surname: userData.surname,
      profileImage: userData.profileImage
      ? `${import.meta.env.VITE_API_URL}/${userData.profileImage}`
      : undefined,
      });
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    }
  };

  const logout = () => {
    setToken(null);
    setUserId(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, token, userId, user, login, logout }}
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
