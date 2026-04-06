import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "student" | "admin";

export interface AuthUser {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  rollNo?: string;
  department?: string;
  year?: string;
  section?: string;
  phone?: string;
  dob?: string;
  bloodGroup?: string;
  address?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (credentials: { role: UserRole; identifier: string; password: string }) => Promise<{ success: boolean; message: string }>;
  loginWithGoogle: (credential: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const INITIAL_USERS: AuthUser[] = [
  { id: "1", name: "Student Demo", role: "student", email: "student@bitsathy.ac.in", rollNo: "22EC010", department: "Electronics & Communication Engineering", year: "3rd Year", section: "B", phone: "+91 9876543210", dob: "2003-05-14", bloodGroup: "A+", address: "Coimbatore, TN" },
  { id: "2", name: "Admin Setup", role: "admin", email: "admin@bitsathy.ac.in" }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const s = localStorage.getItem("bit_user");
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  });

  const API_URL = import.meta.env.VITE_API_URL || "https://student-orientation-portal.onrender.com";

  const login = async ({ role, identifier, password }: { role: UserRole; identifier: string; password: string }) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, identifier, password }),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        localStorage.setItem("bit_user", JSON.stringify(data.user));
        localStorage.setItem("bit_token", data.token);
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message || "Login failed" };
    } catch (err) {
      console.error(err);
      return { success: false, message: "Network error occurred." };
    }
  };

  const loginWithGoogle = async (credential: string) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential }),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        localStorage.setItem("bit_user", JSON.stringify(data.user));
        localStorage.setItem("bit_token", data.token);
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message || "Google Single Sign-On failed" };
    } catch (err) {
      console.error(err);
      return { success: false, message: "Network error occurred." };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("bit_user");
    localStorage.removeItem("bit_token");
  };

  return <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, loginWithGoogle, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
