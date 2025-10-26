"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MapPlaceholder from "@/components/MapPlaceholder";
import { Users, FileText, AlertTriangle } from "lucide-react";
import api from "@/lib/api";

const PoliceAdminDashboard = () => {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/api/admin/summary");
        if (!res.ok) {
          setError(res.body?.toString?.() ?? "Failed to load summary");
        } else {
          setSummary(res.body);
        }
      } catch (e: any) {
        setError(e?.message || String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-gray-50">
        Police/Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-white dark:bg-gray-800 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Criminals</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : (summary?.totalParties ?? 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              +20 from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Cases</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? '...' : (summary?.recentCases ?? 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              +5 new cases this week
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High-Risk Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {/* highRiskAlerts not available in backend yet - placeholder */}
              {loading ? '...' : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Immediate action required
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-50">
          Crime Hotspots
        </h2>
        <MapPlaceholder />
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-50">
          Recent Activity Log
        </h2>
        <Card className="bg-white dark:bg-gray-800 shadow-lg">
          <CardContent className="p-6">
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              <li>[2023-10-26 14:30] Officer Smith added new criminal record for John Doe.</li>
              <li>[2023-10-26 11:15] FIR #2023-005 filed for incident at Main Street.</li>
              <li>[2023-10-25 09:00] Alert issued for suspicious activity in Sector 7.</li>
              <li>[2023-10-24 16:00] Criminal profile for Jane Doe updated.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PoliceAdminDashboard;