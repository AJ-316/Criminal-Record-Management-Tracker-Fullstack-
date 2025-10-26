"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";

const ViewCriminalProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [party, setParty] = useState<any | null>(null);
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const getRoleTitle = (role?: string) => {
    switch (role?.toLowerCase()) {
      case 'accused': return 'Criminal';
      case 'victim': return 'Victim';
      case 'complainant': return 'Complainant';
      default: return 'Party';
    }
  };

  const getRoleBadgeVariant = (role?: string) => {
    switch (role?.toLowerCase()) {
      case 'accused': return 'destructive';
      case 'victim': return 'secondary';
      case 'complainant': return 'default';
      default: return 'outline';
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!id) return;
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
        };
        setParty(mapped);

        const cRes = await api.get(`/api/parties/${id}/cases`);
        if (cRes.ok) {
          setCases(cRes.body ?? []);
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
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-gray-50 flex items-center gap-4">
        {getRoleTitle(party.roleInCase)} Profile: {party.fullName}
        <Badge variant={getRoleBadgeVariant(party.roleInCase)} className="text-base">
          {party.roleInCase ?? 'Unknown Role'}
        </Badge>
      </h1>

      <Card className="bg-white dark:bg-gray-800 shadow-lg mb-8">
        <CardContent className="p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
          <img
            src={party.photoUrl ?? `https://via.placeholder.com/150?text=${encodeURIComponent(String(party.partyId))}`}
            alt={party.fullName}
            className="w-32 h-32 rounded-full object-cover border-4 border-primary"
          />
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-2 flex items-center gap-2">
              {party.fullName}
              {party.isPublic ? (
                <Badge variant="default" className="text-xs">Public Record</Badge>
              ) : (
                <Badge variant="secondary" className="text-xs">Private Record</Badge>
              )}
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              ID: {party.partyId}
            </p>
            <p className="text-md text-gray-600 dark:text-gray-400">
              National ID: {party.nationalId ?? "—"} | Address: {party.address ?? "—"}
            </p>
            <p className="text-md text-gray-600 dark:text-gray-400 mt-2">
              Notes: {/* brief notes not in Party entity yet */} N/A
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
              <CardTitle className="text-xl font-semibold">{getRoleTitle(party.roleInCase)} Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
              <div>
                <p className="font-medium">Full Name:</p>
                <p>{party.fullName}</p>
              </div>
              <Separator />
              <div>
                <p className="font-medium">Alias:</p>
                <p>{party.alias ?? "—"}</p>
              </div>
              <Separator />
              <div>
                <p className="font-medium">National ID:</p>
                <p>{party.nationalId ?? "—"}</p>
              </div>
              <Separator />
              <div>
                <p className="font-medium">Last Known Address:</p>
                <p>{party.address ?? "—"}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="case-history" className="mt-4">
          <Card className="bg-white dark:bg-gray-800 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Associated Cases</CardTitle>
            </CardHeader>
            <CardContent>
              {cases.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr>
                        <th className="px-4 py-2">Case ID</th>
                        <th className="px-4 py-2">FIR</th>
                        <th className="px-4 py-2">Registered</th>
                        <th className="px-4 py-2">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cases.map((c) => (
                        <tr key={c.case_id ?? c.caseId ?? c.case_id} className="border-t">
                          <td className="px-4 py-2">{c.case_id ?? c.caseId}</td>
                          <td className="px-4 py-2">{c.fir_id ?? c.firId ?? "—"}</td>
                          <td className="px-4 py-2">{c.reg_date ?? c.registrationDate ?? "—"}</td>
                          <td className="px-4 py-2">{c.description ?? "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
              <p className="text-gray-700 dark:text-gray-300">Evidence is available on each case page. Use the Case History tab to open case details.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ViewCriminalProfile;