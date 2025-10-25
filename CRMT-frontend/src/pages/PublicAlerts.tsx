"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, MapPin } from "lucide-react";

const mockPublicAlerts = [
  {
    id: "PA001",
    criminalName: "John 'The Shadow' Doe",
    lastSeen: "2023-10-25 18:00",
    location: "Downtown Market Street",
    description: "Suspect in recent burglaries. Approach with caution.",
    riskLevel: "High",
  },
  {
    id: "PA002",
    criminalName: "Unknown Male",
    lastSeen: "2023-10-26 09:30",
    location: "Central Park Area",
    description: "Suspicious activity reported. Wearing a dark hoodie.",
    riskLevel: "Medium",
  },
  {
    id: "PA003",
    criminalName: "Jane 'The Viper' Smith",
    lastSeen: "2023-10-24 14:00",
    location: "Financial District",
    description: "Wanted for questioning in a fraud case.",
    riskLevel: "High",
  },
  {
    id: "PA004",
    criminalName: "Missing Person Alert",
    lastSeen: "2023-10-26 12:00",
    location: "Residential Area, Northwood",
    description: "5-year-old child, last seen wearing a blue jacket.",
    riskLevel: "Urgent",
  },
];

const PublicAlerts = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 dark:bg-gray-950 p-4 md:p-8">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold flex items-center justify-center gap-2">
            <AlertTriangle className="h-8 w-8 text-red-500" /> Public Safety Alerts
          </CardTitle>
          <CardDescription>
            Important information regarding criminal activities and public safety in your area.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Alert ID</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Last Seen</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Risk Level</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPublicAlerts.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell className="font-medium">{alert.id}</TableCell>
                    <TableCell>{alert.criminalName}</TableCell>
                    <TableCell>{alert.lastSeen}</TableCell>
                    <TableCell className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" /> {alert.location}
                    </TableCell>
                    <TableCell>{alert.description}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          alert.riskLevel === "High" || alert.riskLevel === "Urgent"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {alert.riskLevel}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Always exercise caution and report any suspicious activity to local authorities.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PublicAlerts;