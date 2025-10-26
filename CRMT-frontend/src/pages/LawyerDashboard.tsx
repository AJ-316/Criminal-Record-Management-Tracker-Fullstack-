"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download, Gavel, User } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const mockCases = [
  {
    id: "LCASE001",
    criminalName: "John 'The Shadow' Doe",
    criminalId: "CR001",
    status: "Active",
    nextHearing: "2023-11-15",
    description: "Representing in burglary and grand theft auto charges.",
  },
  {
    id: "LCASE002",
    criminalName: "Jane 'The Viper' Smith",
    criminalId: "CR002",
    status: "Pending",
    nextHearing: "2023-12-01",
    description: "Defense for wire fraud and identity theft.",
  },
  {
    id: "LCASE003",
    criminalName: "Mike 'Knuckles' Johnson",
    criminalId: "CR003",
    status: "Closed",
    nextHearing: "N/A",
    description: "Assault and battery case (completed).",
  },
];

const mockCriminalProfiles = [
  {
    id: "CR001",
    name: "John 'The Shadow' Doe",
    age: 45,
    crimeType: "Theft, Burglary",
    status: "Active",
  },
  {
    id: "CR002",
    name: "Jane 'The Viper' Smith",
    age: 32,
    crimeType: "Fraud, Embezzlement",
    status: "Active",
  },
  {
    id: "CR003",
    name: "Mike 'Knuckles' Johnson",
    age: 58,
    crimeType: "Assault, Battery",
    status: "Inactive",
  },
];

const LawyerDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/api/admin/summary');
        if (res.ok) setSummary(res.body);
      } catch (e) {}
      setLoading(false);
    })();
  }, []);

  const filteredCriminals = mockCriminalProfiles.filter((criminal) =>
    criminal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    criminal.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownloadPDF = (caseId: string) => {
    toast.info(`Downloading PDF for case ${caseId} (mock action)`);
    // In a real app, this would trigger a PDF generation/download
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-gray-50">
        Lawyer Dashboard
      </h1>

          {/* Summary tiles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card className="bg-white dark:bg-gray-800 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Total Cases</CardTitle>
                <CardDescription>
                  {loading ? "Loading..." : summary ? summary.totalCases : "—"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{loading ? "..." : summary ? summary.totalCases : "—"}</div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Total Parties</CardTitle>
                <CardDescription>
                  {loading ? "Loading..." : summary ? summary.totalParties : "—"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{loading ? "..." : summary ? summary.totalParties : "—"}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Assigned Cases */}
        <Card className="bg-white dark:bg-gray-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold flex items-center gap-2">
              <Gavel className="h-6 w-6" /> Assigned Cases
            </CardTitle>
            <CardDescription>Overview of cases you are currently handling.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockCases.length > 0 ? (
              mockCases.map((caseItem) => (
                <div
                  key={caseItem.id}
                  className="border p-4 rounded-lg bg-gray-50 dark:bg-gray-700 flex justify-between items-center"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                      {caseItem.criminalName} (Case ID: {caseItem.id})
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Status: {caseItem.status} | Next Hearing: {caseItem.nextHearing}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {caseItem.description}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadPDF(caseItem.id)}
                  >
                    <Download className="h-4 w-4 mr-2" /> PDF
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-gray-700 dark:text-gray-300">No assigned cases.</p>
            )}
          </CardContent>
        </Card>

        {/* Criminal Profile Preview & Search */}
        <Card className="bg-white dark:bg-gray-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold flex items-center gap-2">
              <User className="h-6 w-6" /> Criminal Profile Search
            </CardTitle>
            <CardDescription>Search and preview criminal profiles.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Button>
                <Search className="h-4 w-4 mr-2" /> Search
              </Button>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto">
              {filteredCriminals.length > 0 ? (
                filteredCriminals.map((criminal) => (
                  <div
                    key={criminal.id}
                    className="border p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
                  >
                    <h3 className="font-semibold text-gray-900 dark:text-gray-50">
                      {criminal.name} (ID: {criminal.id})
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Age: {criminal.age} | Crime: {criminal.crimeType} | Status: {criminal.status}
                    </p>
                    <Link to={`/police/criminal/${criminal.id}`} className="text-primary text-sm hover:underline mt-1 block">
                      View Full Profile
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-gray-700 dark:text-gray-300">No criminal profiles found.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LawyerDashboard;