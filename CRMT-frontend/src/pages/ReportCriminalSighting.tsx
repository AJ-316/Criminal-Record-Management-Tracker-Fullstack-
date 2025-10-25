"use client";

import React, { useState } from "react";
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || photoFiles.length === 0) {
      toast.error("Please provide a description and upload at least one photo.");
      return;
    }
    // Mock submission logic
    console.log("Reporting sighting:", { description, photoFiles });
    toast.success("Criminal sighting reported successfully! Thank you for your submission.");
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