"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import api from "@/lib/api";

export type UserRole = "public" | "police" | "lawyer" | "admin" | null;

interface AuthContextType {
  user: { name: string; role: UserRole } | null;
  login: (name: string, role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
  role: UserRole;
  loginServer?: (username: string, password: string) => Promise<any>;
  registerServer?: (username: string, password: string, fullName?: string, role?: UserRole) => Promise<any>;
  token?: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ name: string; role: UserRole; id?: number } | null>(
    null,
  );
  const [role, setRole] = useState<UserRole>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("crmt_user");
      const t = localStorage.getItem("crmt_token");
      if (raw) {
        setUser(JSON.parse(raw));
      }
      if (t) setToken(t);
    } catch (e) {
      // ignore
    }
  }, []);

  const login = (name: string, selectedRole: UserRole) => {
    setUser({ name, role: selectedRole });
    setRole(selectedRole);
  };

  // Server-backed login: calls backend /api/auth/login
  const loginServer = async (username: string, password: string) => {
    const res = await api.postJson("/api/auth/login", { username, password });
    if (!res.ok) throw res;
    const body = res.body;
    const newUser = { name: body.fullName ?? body.username, role: body.role ?? null, id: body.userId };
    setUser(newUser);
    setRole(newUser.role);
    setToken(body.token ?? null);
    try {
      localStorage.setItem("crmt_user", JSON.stringify(newUser));
      if (body.token) localStorage.setItem("crmt_token", body.token);
    } catch (e) {}
    return newUser;
  };

  const registerServer = async (username: string, password: string, fullName?: string, roleParam?: UserRole) => {
    const res = await api.postJson("/api/auth/register", { username, password, fullName, role: roleParam });
    if (!res.ok) throw res;
    return res.body;
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    setToken(null);
    try {
      localStorage.removeItem("crmt_user");
      localStorage.removeItem("crmt_token");
    } catch (e) {}
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, role, loginServer, registerServer, token }}>
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