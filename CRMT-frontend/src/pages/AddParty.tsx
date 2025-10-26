"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import api from "@/lib/api";
import { PARTY_ROLE, PARTY_ROLES_LIST } from "@/lib/constants";

const AddParty = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [address, setAddress] = useState("");
  const [alias, setAlias] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [roleInCase, setRoleInCase] = useState<string>(PARTY_ROLE.ACCUSED);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !nationalId || !address) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const payload = {
        fullName: name,
        alias: alias || null,
        nationalId: nationalId,
        address: address,
        roleInCase: roleInCase,
        isPublic: isPublic,
        photoUrl: null
      };

      const response = await api.postJson("/api/parties", payload);

      if (!response.ok) {
        console.error("Failed to create party:", response);
        toast.error(`Failed to add party: ${response.status} ${JSON.stringify(response.body)}`);
        return;
      }

      toast.success("Party added successfully!");
      navigate("/police/criminals");
    } catch (error) {
      toast.error("Failed to add party. Please try again.");
      console.error("Error adding party:", error);
    }

    // Reset form
    setName("");
    setAlias("");
    setNationalId("");
    setAddress("");
    setIsPublic(true);
    setRoleInCase(PARTY_ROLE.ACCUSED);
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-gray-50">
        Add Party
      </h1>

      <Card className="bg-white dark:bg-gray-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Party Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nationalId">National ID</Label>
                <Input
                  id="nationalId"
                  type="text"
                  placeholder="National ID Number"
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="Current Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="alias">Alias / Nickname</Label>
                <Input
                  id="alias"
                  type="text"
                  placeholder="Optional alias"
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="roleInCase">Role</Label>
                <select
                  id="roleInCase"
                  value={roleInCase}
                  onChange={(e) => setRoleInCase(e.target.value)}
                  className="w-full border rounded p-2"
                >
                  <option value={PARTY_ROLE.ACCUSED}>Accused</option>
                  <option value={PARTY_ROLE.VICTIM}>Victim</option>
                  <option value={PARTY_ROLE.COMPLAINANT}>Complainant</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input id="isPublic" type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
              <Label htmlFor="isPublic">Make this party public</Label>
            </div>

            <Button type="submit" className="w-full md:w-auto">
              Add Party
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddParty;