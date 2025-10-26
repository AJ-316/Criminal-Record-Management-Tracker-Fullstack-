"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { PARTY_ROLE } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
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

type Party = {
  partyId: number;
  fullName: string;
  alias?: string;
  nationalId?: string;
  roleInCase?: string;
  isPublic?: boolean;
};

const PartyList = () => {
  const [parties, setParties] = useState<Party[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<string | null>(null);

  const getRoleTitle = (role?: string | null) => {
    switch (role?.toLowerCase()) {
      case PARTY_ROLE.ACCUSED.toLowerCase(): return 'Accused Parties';
      case PARTY_ROLE.VICTIM.toLowerCase(): return 'Victims';
      case PARTY_ROLE.COMPLAINANT.toLowerCase(): return 'Complainants';
      case PARTY_ROLE.WITNESS.toLowerCase(): return 'Witnesses';
      default: return 'All Parties';
    }
  };

  const getRoleSingular = (role?: string | null) => {
    switch (role?.toLowerCase()) {
      case PARTY_ROLE.ACCUSED.toLowerCase(): return 'Accused';
      case PARTY_ROLE.VICTIM.toLowerCase(): return 'Victim';
      case PARTY_ROLE.COMPLAINANT.toLowerCase(): return 'Complainant';
      case PARTY_ROLE.WITNESS.toLowerCase(): return 'Witness';
      default: return 'Party';
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const role = roleFilter;
        const res = await api.get(role ? `/api/parties?role=${encodeURIComponent(role)}&page=0&size=50` : "/api/parties?page=0&size=50");
        if (!mounted) return;
        if (!res.ok) {
          setError(res.body?.toString?.() ?? "Failed to load");
        } else {
          const body = res.body;
          const items = body?.content ?? body ?? [];
          const mapped = items.map((p: any) => ({
            partyId: p.partyId ?? p.id ?? p.party_id,
            fullName: p.fullName ?? p.full_name,
            alias: p.alias,
            nationalId: p.nationalId ?? p.national_id,
            roleInCase: p.roleInCase ?? p.role_in_case,
            isPublic: p.isPublic ?? p.is_public,
          }));
          setParties(mapped);
        }
      } catch (e: any) {
        setError(e?.message || String(e));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [roleFilter]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50">
          {getRoleTitle(roleFilter)}
        </h1>
        <Link to="/police/add-party">
          <Button>Add New Party</Button>
        </Link>
      </div>

      <div className="mb-4 flex items-center gap-4">
        <label className="text-sm font-medium">Filter by role:</label>
        <select
          value={roleFilter ?? ""}
          onChange={(e) => setRoleFilter(e.target.value || null)}
          className="border rounded px-2 py-1"
        >
          <option value="">All Parties</option>
          <option value={PARTY_ROLE.ACCUSED}>Accused</option>
          <option value={PARTY_ROLE.VICTIM}>Victim</option>
          <option value={PARTY_ROLE.COMPLAINANT}>Complainant</option>
          <option value={PARTY_ROLE.WITNESS}>Witness</option>
        </select>
      </div>

      <Card className="bg-white dark:bg-gray-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Party Registry</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                  <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>National ID</TableHead>
                  <TableHead>Visibility</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parties.map((p) => (
                  <TableRow key={p.partyId}>
                    <TableCell className="font-medium">{p.partyId}</TableCell>
                    <TableCell>{p.fullName}</TableCell>
                    <TableCell>{getRoleSingular(p.roleInCase)}</TableCell>
                    <TableCell>{p.nationalId}</TableCell>
                    <TableCell>
                      {p.isPublic ? (
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">Public</span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">Private</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Link to={`/police/parties/${p.partyId}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" /> View
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4 mr-1" /> Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete {getRoleSingular(p.roleInCase)} {p.fullName}</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this {getRoleSingular(p.roleInCase).toLowerCase()}? This action cannot be undone.
                                Any case associations will also be removed.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-500 hover:bg-red-600"
                                onClick={async () => {
                                  try {
                                    const response = await api.delete(`/api/parties/${p.partyId}`);
                                    if (response.ok) {
                                      toast.success("Party deleted successfully");
                                      // Refresh the list
                                      const role = roleFilter;
                                      const res = await api.get(role ? `/api/parties?role=${encodeURIComponent(role)}&page=0&size=50` : "/api/parties?page=0&size=50");
                                      if (res.ok) {
                                        const body = res.body;
                                        const items = body?.content ?? body ?? [];
                                        const mapped = items.map((p: any) => ({
                                          partyId: p.partyId ?? p.id ?? p.party_id,
                                          fullName: p.fullName ?? p.full_name,
                                          alias: p.alias,
                                          nationalId: p.nationalId ?? p.national_id,
                                          roleInCase: p.roleInCase ?? p.role_in_case,
                                          isPublic: p.isPublic ?? p.is_public,
                                        }));
                                        setParties(mapped);
                                      }
                                    } else {
                                      toast.error("Failed to delete party");
                                    }
                                  } catch (error) {
                                    toast.error("Error deleting party");
                                  }
                                }}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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

export default PartyList;