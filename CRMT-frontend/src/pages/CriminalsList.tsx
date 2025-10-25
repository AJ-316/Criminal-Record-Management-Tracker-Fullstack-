"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const mockCriminals = [
  {
    id: "CR001",
    name: "John 'The Shadow' Doe",
    age: 45,
    gender: "Male",
    crimeType: "Theft, Burglary",
    status: "Active",
  },
  {
    id: "CR002",
    name: "Jane 'The Viper' Smith",
    age: 32,
    gender: "Female",
    crimeType: "Fraud, Embezzlement",
    status: "Active",
  },
  {
    id: "CR003",
    name: "Mike 'Knuckles' Johnson",
    age: 58,
    gender: "Male",
    crimeType: "Assault, Battery",
    status: "Inactive",
  },
  {
    id: "CR004",
    name: "Emily 'Ghost' White",
    age: 28,
    gender: "Female",
    crimeType: "Drug Trafficking",
    status: "Active",
  },
  {
    id: "CR005",
    name: "David 'The Brain' Brown",
    age: 50,
    gender: "Male",
    crimeType: "Cybercrime, Hacking",
    status: "Active",
  },
];

const CriminalsList = () => {
  const handleDelete = (id: string) => {
    toast.info(`Deleting criminal ${id} (mock action)`);
    // In a real app, this would trigger an API call to delete the criminal
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-gray-50">
        Criminals List
      </h1>

      <Card className="bg-white dark:bg-gray-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Registered Criminals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Primary Crime</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockCriminals.map((criminal) => (
                  <TableRow key={criminal.id}>
                    <TableCell className="font-medium">{criminal.id}</TableCell>
                    <TableCell>{criminal.name}</TableCell>
                    <TableCell>{criminal.age}</TableCell>
                    <TableCell>{criminal.gender}</TableCell>
                    <TableCell>{criminal.crimeType}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          criminal.status === "Active"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        }`}
                      >
                        {criminal.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Link to={`/police/criminal/${criminal.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" /> View
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(criminal.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CriminalsList;