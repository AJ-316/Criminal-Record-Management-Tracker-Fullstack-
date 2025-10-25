"use client";

import React from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const mockCriminalData = {
  CR001: {
    name: "John 'The Shadow' Doe",
    age: 45,
    gender: "Male",
    nationality: "American",
    address: "123 Dark Alley, Gotham City",
    status: "Active",
    photo: "https://via.placeholder.com/150/FF0000/FFFFFF?text=CR001",
    notes: "Known for stealth and meticulous planning in burglaries. Operates primarily at night.",
    caseHistory: [
      { id: "C001", date: "2020-03-15", type: "Burglary", status: "Convicted", sentence: "5 years" },
      { id: "C002", date: "2022-07-20", type: "Grand Theft Auto", status: "Pending", details: "Stolen luxury vehicle from downtown." },
    ],
    evidence: [
      { id: "E001", type: "Fingerprints", description: "Found at crime scene C001" },
      { id: "E002", type: "CCTV Footage", description: "Suspect matching description at C002 location" },
    ],
  },
  CR002: {
    name: "Jane 'The Viper' Smith",
    age: 32,
    gender: "Female",
    nationality: "Canadian",
    address: "456 Snake Lane, Metropolis",
    status: "Active",
    photo: "https://via.placeholder.com/150/0000FF/FFFFFF?text=CR002",
    notes: "Master of disguise and social engineering. Targets high-net-worth individuals.",
    caseHistory: [
      { id: "C003", date: "2021-01-10", type: "Identity Theft", status: "Convicted", sentence: "3 years" },
      { id: "C004", date: "2023-05-01", type: "Wire Fraud", status: "Under Investigation", details: "Large sum transferred from corporate account." },
    ],
    evidence: [
      { id: "E003", type: "Digital Forensics", description: "Email traces linked to C003" },
      { id: "E004", type: "Witness Testimony", description: "Identified by victim in C004" },
    ],
  },
};

const ViewCriminalProfile = () => {
  const { id } = useParams<{ id: string }>();
  const criminal = mockCriminalData[id as keyof typeof mockCriminalData];

  if (!criminal) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-50">Criminal Not Found</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          The criminal profile with ID "{id}" does not exist.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-gray-50">
        Criminal Profile: {criminal.name}
      </h1>

      <Card className="bg-white dark:bg-gray-800 shadow-lg mb-8">
        <CardContent className="p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
          <img
            src={criminal.photo}
            alt={criminal.name}
            className="w-32 h-32 rounded-full object-cover border-4 border-primary"
          />
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-2">
              {criminal.name} <Badge variant={criminal.status === "Active" ? "destructive" : "secondary"}>{criminal.status}</Badge>
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              ID: {id} | Age: {criminal.age} | Gender: {criminal.gender}
            </p>
            <p className="text-md text-gray-600 dark:text-gray-400">
              Nationality: {criminal.nationality} | Address: {criminal.address}
            </p>
            <p className="text-md text-gray-600 dark:text-gray-400 mt-2">
              Notes: {criminal.notes}
            </p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="case-history">Case History</TabsTrigger>
          <TabsTrigger value="evidence">Evidence</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="mt-4">
          <Card className="bg-white dark:bg-gray-800 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Personal Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
              <div>
                <p className="font-medium">Full Name:</p>
                <p>{criminal.name}</p>
              </div>
              <Separator />
              <div>
                <p className="font-medium">Age:</p>
                <p>{criminal.age}</p>
              </div>
              <Separator />
              <div>
                <p className="font-medium">Gender:</p>
                <p>{criminal.gender}</p>
              </div>
              <Separator />
              <div>
                <p className="font-medium">Nationality:</p>
                <p>{criminal.nationality}</p>
              </div>
              <Separator />
              <div>
                <p className="font-medium">Last Known Address:</p>
                <p>{criminal.address}</p>
              </div>
              <Separator />
              <div>
                <p className="font-medium">Status:</p>
                <p>{criminal.status}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="case-history" className="mt-4">
          <Card className="bg-white dark:bg-gray-800 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Case History</CardTitle>
            </CardHeader>
            <CardContent>
              {criminal.caseHistory.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Case ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Details/Sentence</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {criminal.caseHistory.map((caseItem) => (
                        <TableRow key={caseItem.id}>
                          <TableCell>{caseItem.id}</TableCell>
                          <TableCell>{caseItem.date}</TableCell>
                          <TableCell>{caseItem.type}</TableCell>
                          <TableCell>
                            <Badge variant={caseItem.status === "Convicted" ? "destructive" : "secondary"}>
                              {caseItem.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{caseItem.sentence || caseItem.details}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-gray-700 dark:text-gray-300">No case history available.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="evidence" className="mt-4">
          <Card className="bg-white dark:bg-gray-800 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Evidence</CardTitle>
            </CardHeader>
            <CardContent>
              {criminal.evidence.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Evidence ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Description</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {criminal.evidence.map((evidenceItem) => (
                        <TableRow key={evidenceItem.id}>
                          <TableCell>{evidenceItem.id}</TableCell>
                          <TableCell>{evidenceItem.type}</TableCell>
                          <TableCell>{evidenceItem.description}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-gray-700 dark:text-gray-300">No evidence available.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ViewCriminalProfile;