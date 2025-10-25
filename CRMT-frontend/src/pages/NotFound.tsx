"use client";

import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-950 p-4">
      <div className="text-center">
        <h1 className="text-6xl font-extrabold mb-4 text-gray-900 dark:text-gray-50">404</h1>
        <p className="text-2xl text-gray-700 dark:text-gray-300 mb-6">Oops! Page not found.</p>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link to="/">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;