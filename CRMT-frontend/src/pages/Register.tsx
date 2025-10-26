"use client";

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("public");
  const { registerServer, loginServer } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName.trim() === "" || username.trim() === "") {
      toast.error("Please fill in required fields.");
      return;
    }
    // Try server registration when available
    if (registerServer) {
      try {
        await registerServer(username, password, fullName, selectedRole as any);
        toast.success("Registration successful! Logging in...");
        // auto-login after successful registration
        try {
          await (loginServer ? loginServer(username, password) : Promise.resolve());
        } catch (e) {}
        navigate("/");
      } catch (err: any) {
        toast.error(err?.body || "Registration failed");
      }
      return;
    }
    // fallback mock
    console.log("Registering user:", { fullName, username, selectedRole });
    toast.success("Registration successful! Please log in.");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Register</CardTitle>
          <CardDescription>Create a new public account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <select id="role" value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm p-2">
                <option value="public">Public</option>
                <option value="police">Police</option>
                <option value="lawyer">Lawyer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <Button type="submit" className="w-full">
              Register
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;