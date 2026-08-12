import { createContext, useState, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import api from "../services/api";

export interface User {
  _id: string;
  name: string;
  fullName?: string;
  email: string;
  role: "patient" | "doctor" | "admin";
  isActive?: boolean; // Doctor active/verification status from backend
  specialization?: string; // Doctor specialty
  isVerified?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  signup: (
    fullName: string,
    email: string,
    password: string,
    confirmPassword: string,
    role?: string,
    phone?: string,
  ) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage and verify with backend on page reload
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        try {
          // 1. Immediately load cached user to prevent blank loading screens
          setUser(JSON.parse(storedUser));

          // 2. Fetch the latest user profile from the backend to check verification state
          const response = await api.get("/auth/me");
          if (response && response.data && response.data.status === "success") {
            const latestUser = response.data.data.user;
            localStorage.setItem("user", JSON.stringify(latestUser));
            setUser(latestUser);
          }
        } catch (err: any) {
          console.error("Failed to sync session with backend on reload:", err);
          // If the token is expired or unauthorized (401), clean up storage and log out
          if (err?.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
          }
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (identifier: string, password: string) => {
    const response = await api.post("/auth/login", { identifier, password });
    if (response.data && response.data.status === "success") {
      let userData = response.data.data?.user;
      const token = response.data.token;
      if (token && userData) {
        // Save token first so the request interceptor can use it for the /auth/me call
        localStorage.setItem("token", token);

        // Fetch complete profile from /auth/me to get 'isActive' which is missing in login response
        try {
          const profileResponse = await api.get("/auth/me");
          if (profileResponse && profileResponse.data && profileResponse.data.status === "success") {
            userData = profileResponse.data.data.user;
          }
        } catch (profileErr) {
          console.error("Failed to fetch full user profile after login:", profileErr);
        }

        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
      } else {
        throw new Error("Authentication succeeded but server returned invalid data");
      }
    } else {
      throw new Error(response.data?.message || "Authentication failed");
    }
  };

  const signup = async (
    fullName: string,
    email: string,
    password: string,
    confirmPassword: string,
    role: string = "patient",
    phone?: string,
  ) => {
    const response = await api.post("/auth/signup", {
      fullName,
      email,
      password,
      confirmPassword,
      role: role || "patient",
      phone,
    });
    if (response.data && response.data.status === "success") {
      let userData = response.data.data?.user;
      const token = response.data.token;
      if (token && userData) {
        // Save token first so the request interceptor can use it
        localStorage.setItem("token", token);

        // Fetch complete profile from /auth/me to keep user data rich and consistent
        try {
          const profileResponse = await api.get("/auth/me");
          if (profileResponse && profileResponse.data && profileResponse.data.status === "success") {
            userData = profileResponse.data.data.user;
          }
        } catch (profileErr) {
          console.error("Failed to fetch full user profile after signup:", profileErr);
        }

        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
      } else {
        throw new Error("Registration succeeded but server returned invalid data");
      }
    } else {
      throw new Error(response.data?.message || "Registration failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, signup, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
