"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { CASE_STATUS, PARTY_ROLE } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FileUpload from "@/components/FileUpload";
import MapPlaceholder from "@/components/MapPlaceholder";
import { toast } from "sonner";

const ReportCriminalSighting = () => {
  const [description, setDescription] = useState("");
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [victims, setVictims] = useState<any[]>([]);
  const [selectedVictim, setSelectedVictim] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await api.get('/api/parties?role=victim&page=0&size=100');
        if (!mounted) return;
        if (res.ok) {
          const items = res.body?.content ?? res.body ?? [];
          setVictims(items.map((p: any) => ({ id: p.partyId ?? p.id ?? p.party_id, name: p.fullName ?? p.full_name })));
        }
      } catch (e) {}
    })();
    return () => { mounted = false; };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || photoFiles.length === 0) {
      toast.error("Please provide a description and upload at least one photo.");
      return;
    }
    // For now create a lightweight case record with initialStatus 'sighting'
    try {
      const dto: any = {
        firId: null,
        registrationDate: new Date().toISOString().slice(0,10),
        jurisdictionId: null,
        description,
        // use valid backend enum for status
  initialStatus: CASE_STATUS.FIR_FILED,
        parties: []
      };
      if (selectedVictim) {
  dto.parties.push({ partyId: selectedVictim, roleInCase: PARTY_ROLE.VICTIM });
      }
      // if suspect not known, we won't add accused here
      const res = await api.postJson('/api/cases', dto);
      if (res.ok) {
        toast.success('Sighting reported and case created (ID: ' + (res.body.caseId ?? res.body.case_id) + ')');
      } else {
        toast.error('Failed to report sighting: ' + (res.body || res.status));
      }
    } catch (e: any) {
      toast.error('Network error while reporting sighting');
    }
    // Clear form
    setDescription("");
    setPhotoFiles([]);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Report a Criminal Sighting</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="description">Description of Sighting</Label>
              <Textarea
                id="description"
                placeholder="Provide details about the sighting: who, what, when, where, and any distinguishing features."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={7}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="victim">Related Victim (optional)</Label>
              <select id="victim" value={selectedVictim ?? ""} onChange={(e) => setSelectedVictim(e.target.value ? Number(e.target.value) : null)} className="w-full border rounded p-2">
                <option value="">Select victim (if known)</option>
                {victims.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="photo-upload">Upload Photos/Videos (Optional but Recommended)</Label>
              <FileUpload onFileChange={setPhotoFiles} maxFiles={5} accept={{ "image/*": [".jpeg", ".png", ".gif"], "video/*": [".mp4", ".mov"] }} />
            </div>

            <div className="space-y-2">
              <Label>Location of Sighting</Label>
              <MapPlaceholder />
              <p className="text-sm text-muted-foreground">
                (In a real application, this would be an interactive map for precise location picking.)
              </p>
            </div>

            <Button type="submit" className="w-full">
              Submit Sighting Report
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportCriminalSighting;