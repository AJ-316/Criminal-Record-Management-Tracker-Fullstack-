"use client";

import React, { useEffect, useState } from "react";
import { CASE_STATUS, PARTY_ROLE } from "@/lib/constants";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import api from "@/lib/api";
import { toast } from "sonner";

interface Case {
  caseId: string;
  firId: string;
  registrationDate: string;
  description: string;
  currentStatus: string;
  parties: Array<{
    partyId: number;
    roleInCase: string;
    party: {
      fullName: string;
    };
  }>;
}

const CaseFiles = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const response = await api.get("/api/cases");
      if (response.ok) {
        setCases(response.body?.content ?? response.body ?? []);
      } else {
        toast.error("Failed to fetch cases");
      }
      setLoading(false);
    } catch (error) {
      toast.error("Error fetching cases");
      setLoading(false);
    }
  };

  const getStatusBadgeVariant = (status?: string) => {
    if (!status) return 'outline';
    switch (status.toLowerCase()) {
      case CASE_STATUS.FIR_FILED:
      case CASE_STATUS.CHARGESHEET_FILED:
      case CASE_STATUS.COGNIZANCE_TAKEN:
      case CASE_STATUS.UNDER_TRIAL:
        return 'secondary';
      case CASE_STATUS.JUDGMENT_GIVEN:
      case CASE_STATUS.APPEAL_PENDING:
      case CASE_STATUS.CLOSED:
        return 'default';
      case 'dismissed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const formatStatus = (status?: string) => {
    if (!status) return 'Unknown';
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  const getPartyByRole = (caseFile: Case, role: string) => {
    const party = caseFile.parties?.find(p => p.roleInCase === role);
    return party?.party?.fullName || 'N/A';
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-gray-50">
        Case Files
      </h1>

      <Card className="bg-white dark:bg-gray-800 shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-semibold">All Cases</CardTitle>
            <Button onClick={() => navigate("/police/firs")}>
              File New FIR
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading cases...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>FIR ID</TableHead>
                  <TableHead>Date Filed</TableHead>
                  <TableHead>Complainant</TableHead>
                  <TableHead>Accused</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cases.map((caseFile) => (
                  <TableRow key={caseFile.caseId}>
                    <TableCell>{caseFile.firId}</TableCell>
                    <TableCell>{new Date(caseFile.registrationDate).toLocaleDateString()}</TableCell>
                    <TableCell>{getPartyByRole(caseFile, PARTY_ROLE.COMPLAINANT)}</TableCell>
                    <TableCell>{getPartyByRole(caseFile, PARTY_ROLE.ACCUSED)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(caseFile.currentStatus)}>
                        {formatStatus(caseFile.currentStatus)}
                      </Badge>
                    </TableCell>
                    <TableCell className="space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => navigate(`/cases/${caseFile.caseId}`)}
                      >
                        View Details
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive">Delete</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Case {caseFile.firId}</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this case? This action cannot be undone.
                              All related data including parties and evidence will be deleted.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-500 hover:bg-red-600"
                              onClick={async () => {
                                try {
                                  const response = await api.delete(`/api/cases/${caseFile.caseId}`);
                                  if (response.ok) {
                                    toast.success("Case deleted successfully");
                                    fetchCases(); // Refresh the list
                                  } else {
                                    toast.error("Failed to delete case");
                                  }
                                } catch (error) {
                                  toast.error("Error deleting case");
                                }
                              }}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CaseFiles;