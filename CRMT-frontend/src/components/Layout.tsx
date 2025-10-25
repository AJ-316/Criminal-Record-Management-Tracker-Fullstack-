"use client";

import React, { ReactNode, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useAuth } from "@/context/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { isAuthenticated, role } = useAuth();
  const isMobile = useIsMobile();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const showSidebar = isAuthenticated && (role === "police" || role === "admin" || role === "lawyer");

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        {showSidebar && !isMobile && (
          <Sidebar className="hidden md:flex" />
        )}
        {showSidebar && isMobile && (
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden absolute top-4 left-4 z-50">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <Sidebar isMobile onLinkClick={() => setIsSheetOpen(false)} />
            </SheetContent>
          </Sheet>
        )}
        <main className="flex-grow p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;