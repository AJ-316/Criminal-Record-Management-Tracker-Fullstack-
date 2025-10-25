"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, logout, role } = useAuth();

  return (
    <nav className="bg-primary text-primary-foreground p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          CRTS
        </Link>
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              {role === "police" || role === "admin" ? (
                <Link to="/police/dashboard">
                  <Button variant="ghost" className="text-primary-foreground hover:bg-primary/80">Dashboard</Button>
                </Link>
              ) : role === "lawyer" ? (
                <Link to="/lawyer/dashboard">
                  <Button variant="ghost" className="text-primary-foreground hover:bg-primary/80">Dashboard</Button>
                </Link>
              ) : (
                <Link to="/public/submission-history">
                  <Button variant="ghost" className="text-primary-foreground hover:bg-primary/80">My Submissions</Button>
                </Link>
              )}
              <Button onClick={logout} variant="ghost" className="text-primary-foreground hover:bg-primary/80">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" className="text-primary-foreground hover:bg-primary/80">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="ghost" className="text-primary-foreground hover:bg-primary/80">
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;