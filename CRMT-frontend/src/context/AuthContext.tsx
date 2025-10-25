"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "public" | "police" | "lawyer" | "admin" | null;

interface AuthContextType {
  user: { name: string; role: UserRole } | null;
  login: (name: string, role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
  role: UserRole;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ name: string; role: UserRole } | null>(
    null,
  );
  const [role, setRole] = useState<UserRole>(null);

  const login = (name: string, selectedRole: UserRole) => {
    setUser({ name, role: selectedRole });
    setRole(selectedRole);
  };

  const logout = () => {
    setUser(null);
    setRole(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, role }}>
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