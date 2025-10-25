"use client";

import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Home,
  UserPlus,
  Users,
  FileText,
  ClipboardList,
  BellRing,
  Gavel,
  Search,
  Download,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isMobile?: boolean;
  onLinkClick?: () => void;
}

const Sidebar = ({ className, isMobile, onLinkClick }: SidebarProps) => {
  const { role } = useAuth();

  const policeAdminNavItems = [
    {
      to: "/police/dashboard",
      icon: <Home className="h-5 w-5" />,
      label: "Dashboard",
    },
    {
      to: "/police/add-criminal",
      icon: <UserPlus className="h-5 w-5" />,
      label: "Add Criminal",
    },
    {
      to: "/police/criminals",
      icon: <Users className="h-5 w-5" />,
      label: "Criminal List",
    },
    {
      to: "/police/firs",
      icon: <FileText className="h-5 w-5" />,
      label: "Add FIR",
    },
    {
      to: "/police/case-files",
      icon: <ClipboardList className="h-5 w-5" />,
      label: "Case Files",
    },
    {
      to: "/police/reports",
      icon: <FileText className="h-5 w-5" />,
      label: "Reports",
    },
    {
      to: "/police/alerts",
      icon: <BellRing className="h-5 w-5" />,
      label: "Alerts",
    },
  ];

  const lawyerNavItems = [
    {
      to: "/lawyer/dashboard",
      icon: <Home className="h-5 w-5" />,
      label: "Dashboard",
    },
    {
      to: "/lawyer/criminal-profiles",
      icon: <Users className="h-5 w-5" />,
      label: "Criminal Profiles",
    },
    {
      to: "/lawyer/search",
      icon: <Search className="h-5 w-5" />,
      label: "Search Records",
    },
    {
      to: "/lawyer/download-case",
      icon: <Download className="h-5 w-5" />,
      label: "Download Case PDF",
    },
  ];

  const navItems =
    role === "police" || role === "admin"
      ? policeAdminNavItems
      : role === "lawyer"
      ? lawyerNavItems
      : [];

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-sidebar text-sidebar-foreground border-r border-sidebar-border",
        isMobile ? "w-64" : "w-64",
        className,
      )}
    >
      <div className="p-4 text-2xl font-bold text-sidebar-primary-foreground border-b border-sidebar-border">
        {role === "police" || role === "admin" ? "Police/Admin" : "Lawyer"}
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Link to={item.to} key={item.to} onClick={onLinkClick}>
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              {item.icon}
              <span className="ml-3">{item.label}</span>
            </Button>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;