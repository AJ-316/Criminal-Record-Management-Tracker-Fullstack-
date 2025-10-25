"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock, MapPin } from "lucide-react";

const mockSubmissions = [
  {
    id: "SUB001",
    type: "Criminal Sighting",
    date: "2023-10-20",
    status: "Under Review",
    description: "Saw a person matching John Doe's description near the old factory.",
    location: "Old Factory District",
  },
  {
    id: "SUB002",
    type: "Suspicious Activity",
    date: "2023-10-15",
    status: "Closed",
    description: "Group of individuals loitering suspiciously near the bank after hours.",
    location: "Bank Street",
  },
  {
    id: "SUB003",
    type: "Criminal Sighting",
    date: "2023-09-28",
    status: "Investigated",
    description: "Possible sighting of Jane Smith in a cafe.",
    location: "Central Cafe",
  },
];

const SubmissionHistory = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 dark:bg-gray-950 p-4 md:p-8">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold flex items-center justify-center gap-2">
            <FileText className="h-8 w-8 text-primary" /> My Submission History
          </CardTitle>
          <CardDescription>
            Review the status and details of your reported sightings and incidents.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Submission ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Location</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockSubmissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell className="font-medium">{submission.id}</TableCell>
                    <TableCell>{submission.type}</TableCell>
                    <TableCell className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" /> {submission.date}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          submission.status === "Under Review"
                            ? "secondary"
                            : submission.status === "Investigated"
                            ? "default"
                            : "outline"
                        }
                      >
                        {submission.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{submission.description}</TableCell>
                    <TableCell className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" /> {submission.location}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Thank you for contributing to public safety.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubmissionHistory;