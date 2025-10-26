"use client";

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PARTY_ROLE, CASE_STATUS } from "@/lib/constants";
import { FileText, Calendar, MapPin, Phone, Mail, AlertTriangle, Shield, Eye, ChevronRight } from "lucide-react";
import api from "@/lib/api";

interface Case {
  caseId: string;
  firId: string;
  registrationDate: string;
  description: string;
  currentStatus: string;
  jurisdiction?: string;
}

interface Party {
  partyId: number;
  fullName: string;
  alias?: string;
  nationalId?: string;
  address?: string;
  photoUrl?: string;
  roleInCase?: string;
  isPublic?: boolean;
  phoneNumber?: string;
  email?: string;
  dateOfBirth?: string;
  gender?: string;
  nationality?: string;
  occupation?: string;
  distinguishingMarks?: string;
  notes?: string;
  createdAt?: string;
  lastUpdated?: string;
}

interface Evidence {
  evidenceId: string;
  caseId: string;
  title: string;
  type: string;
  fileUrl: string[];
  description?: string;
  submittedBy?: string;
  submittedAt: string;
  tags?: string[];
  status: string;
}

const PartyProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [party, setParty] = useState<Party | null>(null);
  const [cases, setCases] = useState<Case[]>([]);
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getRoleTitle = (role?: string) => {
    switch (role?.toLowerCase()) {
      case PARTY_ROLE.ACCUSED.toLowerCase(): return 'Accused';
      case PARTY_ROLE.VICTIM.toLowerCase(): return 'Victim';
      case PARTY_ROLE.COMPLAINANT.toLowerCase(): return 'Complainant';
      case PARTY_ROLE.WITNESS.toLowerCase(): return 'Witness';
      default: return 'Party';
    }
  };

  const getRoleBadgeVariant = (role?: string) => {
    switch (role?.toLowerCase()) {
      case PARTY_ROLE.ACCUSED.toLowerCase(): return 'destructive';
      case PARTY_ROLE.VICTIM.toLowerCase(): return 'secondary';
      case PARTY_ROLE.COMPLAINANT.toLowerCase(): return 'default';
      case PARTY_ROLE.WITNESS.toLowerCase(): return 'outline';
      default: return 'outline';
    }
  };

  const formatStatus = (status?: string) => {
    if (!status) return 'Unknown';
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
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

  const getEvidenceBadgeVariant = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'verified': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!id) return;
        
        // Fetch party details
        const pRes = await api.get(`/api/parties/${id}`);
        if (!mounted) return;
        if (!pRes.ok) {
          setError("Failed to load party");
          setLoading(false);
          return;
        }
        const pBody = pRes.body;
        const mapped = {
          partyId: pBody.partyId ?? pBody.id ?? pBody.party_id,
          fullName: pBody.fullName ?? pBody.full_name,
          alias: pBody.alias,
          nationalId: pBody.nationalId ?? pBody.national_id,
          address: pBody.address,
          photoUrl: pBody.photoUrl ?? pBody.photo_url,
          roleInCase: pBody.roleInCase ?? pBody.role_in_case,
          isPublic: pBody.isPublic ?? pBody.is_public,
          phoneNumber: pBody.phoneNumber ?? pBody.phone_number,
          email: pBody.email,
          dateOfBirth: pBody.dateOfBirth ?? pBody.date_of_birth,
          gender: pBody.gender,
          nationality: pBody.nationality,
          occupation: pBody.occupation,
          distinguishingMarks: pBody.distinguishingMarks ?? pBody.distinguishing_marks,
          notes: pBody.notes,
          createdAt: pBody.createdAt ?? pBody.created_at,
          lastUpdated: pBody.lastUpdated ?? pBody.last_updated
        };
        setParty(mapped);

        // Fetch associated cases
        const cRes = await api.get(`/api/parties/${id}/cases`);
        if (cRes.ok) {
          const cases = cRes.body ?? [];
          setCases(cases);
          
          // Fetch evidence for each case
          const evidencePromises = cases.map(async (c: Case) => {
            const eRes = await api.get(`/api/cases/${c.caseId}/evidence`);
            return eRes.ok ? eRes.body : [];
          });
          const evidenceResults = await Promise.all(evidencePromises);
          const allEvidence = evidenceResults.flat();
          setEvidence(allEvidence);
        }
      } catch (e: any) {
        setError(e?.message || String(e));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;
  if (!party) return <div className="p-4">Party not found</div>;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50 flex items-center gap-4">
            {getRoleTitle(party.roleInCase)} Profile: {party.fullName}
            <Badge variant={getRoleBadgeVariant(party.roleInCase)} className="text-base">
              {party.roleInCase ?? 'Unknown Role'}
            </Badge>
          </h1>
          <p className="text-gray-500 mt-2">Profile ID: {party.partyId} • Created {new Date(party.createdAt ?? '').toLocaleDateString()}</p>
        </div>
        <Button variant="outline" onClick={() => history.back()}>
          Back
        </Button>
      </div>

      {/* Profile Overview Card */}
      <Card className="bg-white dark:bg-gray-800 shadow-lg mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Column - Photo and Core Info */}
            <div className="md:w-1/3">
              <div className="text-center">
                <img
                  src={party.photoUrl ?? `https://via.placeholder.com/150?text=${encodeURIComponent(String(party.partyId))}`}
                  alt={party.fullName}
                  className="w-48 h-48 rounded-full object-cover border-4 border-primary mx-auto mb-4"
                />
                <Badge variant={party.isPublic ? "default" : "secondary"} className="mb-4">
                  {party.isPublic ? "Public Record" : "Private Record"}
                </Badge>
              </div>
              <div className="space-y-3 mt-4">
                {party.phoneNumber && (
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Phone className="w-4 h-4 mr-2" />
                    {party.phoneNumber}
                  </div>
                )}
                {party.email && (
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Mail className="w-4 h-4 mr-2" />
                    {party.email}
                  </div>
                )}
                {party.address && (
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4 mr-2" />
                    {party.address}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Detailed Info */}
            <div className="md:w-2/3 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">National ID</p>
                  <p className="font-medium">{party.nationalId ?? "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date of Birth</p>
                  <p className="font-medium">{party.dateOfBirth ? new Date(party.dateOfBirth).toLocaleDateString() : "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="font-medium">{party.gender ?? "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nationality</p>
                  <p className="font-medium">{party.nationality ?? "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Occupation</p>
                  <p className="font-medium">{party.occupation ?? "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Alias</p>
                  <p className="font-medium">{party.alias ?? "—"}</p>
                </div>
              </div>
              {party.distinguishingMarks && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-gray-500">Distinguishing Marks</p>
                    <p className="font-medium">{party.distinguishingMarks}</p>
                  </div>
                </>
              )}
              {party.notes && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-gray-500">Notes</p>
                    <p className="font-medium whitespace-pre-wrap">{party.notes}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Section */}
      <Tabs defaultValue="case-history" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="case-history">Case History</TabsTrigger>
          <TabsTrigger value="evidence">Evidence</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        {/* Case History Tab */}
        <TabsContent value="case-history" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Case History</CardTitle>
              <CardDescription>All cases associated with this {getRoleTitle(party.roleInCase).toLowerCase()}</CardDescription>
            </CardHeader>
            <CardContent>
              {cases.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">FIR ID</th>
                        <th className="text-left p-3">Status</th>
                        <th className="text-left p-3">Registration Date</th>
                        <th className="text-left p-3">Description</th>
                        <th className="text-left p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cases.map((c) => (
                        <tr key={c.caseId} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="p-3 font-medium">{c.firId}</td>
                          <td className="p-3">
                            <Badge variant={getStatusBadgeVariant(c.currentStatus)}>
                              {formatStatus(c.currentStatus)}
                            </Badge>
                          </td>
                          <td className="p-3">{new Date(c.registrationDate).toLocaleDateString()}</td>
                          <td className="p-3">{c.description.length > 100 ? c.description.slice(0, 100) + '...' : c.description}</td>
                          <td className="p-3">
                            <Link to={`/cases/${c.caseId}`}>
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4 mr-1" /> View
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center p-6 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No case history available for this {getRoleTitle(party.roleInCase).toLowerCase()}.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Evidence Tab */}
        <TabsContent value="evidence" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Evidence</CardTitle>
              <CardDescription>Evidence items related to cases involving this {getRoleTitle(party.roleInCase).toLowerCase()}</CardDescription>
            </CardHeader>
            <CardContent>
              {evidence.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {evidence.map((e) => (
                    <Card key={e.evidenceId}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{e.title}</CardTitle>
                          <Badge variant={getEvidenceBadgeVariant(e.status)}>
                            {e.status}
                          </Badge>
                        </div>
                        <CardDescription>{new Date(e.submittedAt).toLocaleDateString()}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          {e.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {e.fileUrl.map((url, i) => (
                            <a
                              key={i}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center"
                            >
                              File {i + 1} <ChevronRight className="w-4 h-4" />
                            </a>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center p-6 text-gray-500">
                  <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No evidence items found related to this {getRoleTitle(party.roleInCase).toLowerCase()}.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
              <CardDescription>Chronological history of events and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {/* Created */}
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Profile Created</p>
                    <p className="text-sm text-gray-500">{new Date(party.createdAt ?? '').toLocaleString()}</p>
                  </div>
                </div>

                {/* Cases */}
                {cases.map((c) => (
                  <div key={c.caseId} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                      <FileText className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">Associated with Case {c.firId}</p>
                      <p className="text-sm text-gray-500">{new Date(c.registrationDate).toLocaleString()}</p>
                      <Badge variant={getStatusBadgeVariant(c.currentStatus)} className="mt-2">
                        {formatStatus(c.currentStatus)}
                      </Badge>
                    </div>
                  </div>
                ))}

                {/* Last Updated */}
                {party.lastUpdated && (
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">Profile Updated</p>
                      <p className="text-sm text-gray-500">{new Date(party.lastUpdated).toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PartyProfile;