"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const AddFIR = () => {
  const [caseId, setCaseId] = useState("");
  const [suspectName, setSuspectName] = useState("");
  const [incidentDetails, setIncidentDetails] = useState("");
  const [dateOfIncident, setDateOfIncident] = useState<Date | undefined>(undefined);
  const [location, setLocation] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseId || !suspectName || !incidentDetails || !dateOfIncident || !location) {
      toast.error("Please fill in all required fields.");
      return;
    }
    // Mock submission logic
    console.log("Filing FIR:", { caseId, suspectName, incidentDetails, dateOfIncident, location });
    toast.success(`FIR ${caseId} filed successfully!`);
    // Clear form
    setCaseId("");
    setSuspectName("");
    setIncidentDetails("");
    setDateOfIncident(undefined);
    setLocation("");
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-gray-50">
        File New First Information Report (FIR)
      </h1>

      <Card className="bg-white dark:bg-gray-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">FIR Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="caseId">Case ID</Label>
                <Input
                  id="caseId"
                  type="text"
                  placeholder="e.g., FIR-2023-001"
                  value={caseId}
                  onChange={(e) => setCaseId(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="suspectName">Suspect Name</Label>
                <Input
                  id="suspectName"
                  type="text"
                  placeholder="e.g., John Doe"
                  value={suspectName}
                  onChange={(e) => setSuspectName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="incidentDetails">Incident Details</Label>
              <Textarea
                id="incidentDetails"
                placeholder="Provide a detailed description of the incident."
                value={incidentDetails}
                onChange={(e) => setIncidentDetails(e.target.value)}
                rows={7}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="dateOfIncident">Date of Incident</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateOfIncident && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateOfIncident ? format(dateOfIncident, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateOfIncident}
                      onSelect={setDateOfIncident}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location of Incident</Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="e.g., Main Street, Downtown"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full md:w-auto">
              File FIR
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddFIR;