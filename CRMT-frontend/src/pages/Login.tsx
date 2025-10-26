"use client";

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, UserRole } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Fingerprint } from "lucide-react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("public");
  const { login, loginServer } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === "") {
      toast.error("Please enter your username.");
      return;
    }
    if (!selectedRole) {
      toast.error("Please select a role.");
      return;
    }
    // if backend available, try server login, else fallback to mock login
    if (loginServer) {
      try {
        const u = await loginServer(username, password);
        toast.success(`Logged in as ${u.name} (${u.role})`);
      } catch (err: any) {
        toast.error(err?.body || "Login failed");
        return;
      }
    } else {
      login(username, selectedRole);
      toast.success(`Logged in as ${username} (${selectedRole})`);
    }
    // Redirect based on role
    if (selectedRole === "police" || selectedRole === "admin") {
      navigate("/police/dashboard");
    } else if (selectedRole === "lawyer") {
      navigate("/lawyer/dashboard");
    } else {
      navigate("/");
    }
  };

  const handleBiometricLogin = () => {
    toast.info("Biometric login initiated (mock functionality).");
    // Simulate a successful biometric login for a public user
    login("Biometric User", "public");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Login</CardTitle>
          <CardDescription>Enter your details or use biometric login.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <Label htmlFor="password" className="mt-2">Password</Label>
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
              <Select value={selectedRole || ""} onValueChange={(value: UserRole) => setSelectedRole(value)}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public User</SelectItem>
                  <SelectItem value="police">Police Officer</SelectItem>
                  <SelectItem value="lawyer">Lawyer</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={handleBiometricLogin}
            >
              <Fingerprint className="h-5 w-5" />
              Biometric Login
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Register
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;