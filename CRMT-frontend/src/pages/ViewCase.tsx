"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import api from "@/lib/api";
import { CASE_STATUS, PARTY_ROLE } from "@/lib/constants";
import { toast } from "sonner";

interface Party {
  partyId: number;
  roleInCase: string;
  party: {
    fullName: string;
    address: string;
    nationalId: string;
    notes?: string;
  };
}

interface Evidence {
  evidenceId: number;
  title: string;
  description: string;
  fileUrls: string[];
  submissionDate: string;
  evidenceType: string;
  status: string;
}

interface Case {
  caseId: string;
  firId: string;
  registrationDate: string;
  description: string;
  currentStatus: string;
  parties: Party[];
  evidence?: Evidence[];
}

const ViewCase = () => {
  const { id } = useParams<{ id: string }>();
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchCaseDetails();
    }
  }, [id]);

  const fetchCaseDetails = async () => {
    try {
      const response = await api.get(`/api/cases/${id}`);
      if (response.ok) {
        console.log("Fetched case data:", response.body);
        setCaseData(response.body);
      } else {
        toast.error("Failed to fetch case details");
      }
      setLoading(false);
    } catch (error) {
      toast.error("Error fetching case details");
      setLoading(false);
    }
  };

  const getStatusBadgeVariant = (status?: string) => {
    if (!status) return 'outline';
    switch (status.toLowerCase()) {
      case 'fir_filed':
      case 'chargesheet_filed':
      case 'cognizance_taken':
      case 'under_trial':
        return 'secondary';
      case 'judgment_given':
      case 'appeal_pending':
      case 'closed':
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

  if (loading) {
    return (
      <Card className="container mx-auto p-4 m-4">
        <CardContent className="pt-6">
          <div className="flex justify-center items-center min-h-[200px] text-muted-foreground">
            Loading case details...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!caseData) {
    return (
      <Card className="container mx-auto p-4 m-4">
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">Case not found or failed to load</div>
        </CardContent>
      </Card>
    );
  }

  const getPartiesByRole = (role: string) => {
    if (!caseData?.parties) return [];
    return caseData.parties.filter(p => p.roleInCase === role);
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-gray-50">
        Case File: {caseData.firId}
      </h1>

      <div className="space-y-6">
        <Card className="bg-white dark:bg-gray-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Case Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">FIR ID</p>
                <p className="font-medium">{caseData.firId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Registration Date</p>
                <p className="font-medium">{new Date(caseData.registrationDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                <Badge variant={getStatusBadgeVariant(caseData.currentStatus)}>
                  {formatStatus(caseData.currentStatus)}
                </Badge>
              </div>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2">Incident Description</h3>
              <p className="whitespace-pre-wrap">{caseData.description}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Involved Parties</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              {[PARTY_ROLE.COMPLAINANT, PARTY_ROLE.ACCUSED, PARTY_ROLE.WITNESS].map(role => {
                const parties = getPartiesByRole(role);
                if (parties.length === 0) return null;

                return (
                  <AccordionItem key={role} value={role}>
                    <AccordionTrigger className="text-lg font-semibold">
                      {role.charAt(0).toUpperCase() + role.slice(1)}s ({parties.length})
                    </AccordionTrigger>
                    <AccordionContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>National ID</TableHead>
                            <TableHead>Address</TableHead>
                            <TableHead>Notes</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {parties.map((p) => (
                            <TableRow key={p.partyId}>
                              <TableCell>{p.party.fullName}</TableCell>
                              <TableCell>{p.party.nationalId}</TableCell>
                              <TableCell>{p.party.address}</TableCell>
                              <TableCell>{p.party.notes || 'N/A'}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </CardContent>
        </Card>

        {caseData.evidence && caseData.evidence.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Evidence</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Submission Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Files</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {caseData.evidence.map((e) => (
                    <TableRow key={e.evidenceId}>
                      <TableCell>{e.title}</TableCell>
                      <TableCell>{e.evidenceType}</TableCell>
                      <TableCell>{e.description}</TableCell>
                      <TableCell>{new Date(e.submissionDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(e.status)}>
                          {formatStatus(e.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {e.fileUrls.map((url, i) => (
                          <a
                            key={i}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:underline block"
                          >
                            File {i + 1}
                          </a>
                        ))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ViewCase;