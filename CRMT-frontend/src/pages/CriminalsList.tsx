"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye } from "lucide-react";
import { Link } from "react-router-dom";
// uses API to fetch parties from backend

type Party = {
  partyId: number;
  fullName: string;
  alias?: string;
  nationalId?: string;
  roleInCase?: string;
  isPublic?: boolean;
};

const CriminalsList = () => {
  const [parties, setParties] = useState<Party[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await api.get("/api/parties?page=0&size=50");
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
  }, []);

  const handleDelete = (id: number) => {
    // implement API delete later; for now mock
    setParties((s) => s.filter((p) => p.partyId !== id));
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

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
                    <TableCell>{p.roleInCase}</TableCell>
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
                        <Link to={`/police/criminal/${p.partyId}`}>
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
                          onClick={() => handleDelete(p.partyId)}
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