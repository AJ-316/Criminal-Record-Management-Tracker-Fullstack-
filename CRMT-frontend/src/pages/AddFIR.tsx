"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { CASE_STATUS, PARTY_ROLE } from "@/lib/constants";
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
  const [complainants, setComplainants] = useState<Array<any>>([]);
  const [selectedComplainant, setSelectedComplainant] = useState<number | null>(null);
  const [accusedList, setAccusedList] = useState<Array<any>>([]);
  const [selectedAccused, setSelectedAccused] = useState<number | null>(null);
  const [isAddingAccused, setIsAddingAccused] = useState(false);
  const [newAccused, setNewAccused] = useState({ name: "", nationalId: "", address: "" });

  const [victimList, setVictimList] = useState<Array<any>>([]);
  const [selectedVictim, setSelectedVictim] = useState<number | null>(null);
  const [isAddingVictim, setIsAddingVictim] = useState(false);
  const [newVictim, setNewVictim] = useState({ name: "", nationalId: "", address: "" });
  const [isAddingComplainant, setIsAddingComplainant] = useState(false);
  const [newComplainant, setNewComplainant] = useState({
    name: "",
    nationalId: "",
    address: "",
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await api.get("/api/parties?role=complainant&page=0&size=100");
        if (!mounted) return;
        if (res.ok) {
          const items = res.body?.content ?? res.body ?? [];
          setComplainants(items.map((p: any) => ({ id: p.partyId ?? p.id ?? p.party_id, name: p.fullName ?? p.full_name })));
        }
      } catch (e) {}
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [accRes, vicRes] = await Promise.all([
          api.get("/api/parties?role=accused&page=0&size=100"),
          api.get("/api/parties?role=victim&page=0&size=100"),
        ]);

        if (!mounted) return;
        if (accRes.ok) {
          const items = accRes.body?.content ?? accRes.body ?? [];
          setAccusedList(items.map((p: any) => ({ id: p.partyId ?? p.id ?? p.party_id, name: p.fullName ?? p.full_name })));
        }
        if (vicRes.ok) {
          const items = vicRes.body?.content ?? vicRes.body ?? [];
          setVictimList(items.map((p: any) => ({ id: p.partyId ?? p.id ?? p.party_id, name: p.fullName ?? p.full_name })));
        }
      } catch (e) {}
    })();
    return () => { mounted = false; };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseId || !suspectName || !incidentDetails || !dateOfIncident || !location) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!isAddingComplainant && !selectedComplainant) {
      toast.error("Please select a complainant or add a new one.");
      return;
    }

    if (isAddingComplainant && (!newComplainant.name || !newComplainant.nationalId || !newComplainant.address)) {
      toast.error("Please fill in all complainant details.");
      return;
    }

  let complainantParty;
  let accusedEntry: any = null;
  let victimEntry: any = null;
    try {
      if (isAddingComplainant) {
        // Create new complainant
        const complainantResponse = await api.postJson('/api/parties', {
          fullName: newComplainant.name,
          nationalId: newComplainant.nationalId,
          address: newComplainant.address,
          roleInCase: PARTY_ROLE.COMPLAINANT,
          isPublic: true
        });

        if (!complainantResponse.ok) {
          console.error('Failed to create complainant:', complainantResponse);
          toast.error(`Failed to create complainant: ${complainantResponse.status} - ${JSON.stringify(complainantResponse.body)}`);
          return;
        }

        // backend returns partyId field
        complainantParty = { 
          partyId: complainantResponse.body.partyId ?? complainantResponse.body.id ?? null, 
          roleInCase: PARTY_ROLE.COMPLAINANT,
        };
      } else {
        complainantParty = { 
          partyId: selectedComplainant, 
          roleInCase: 'complainant' 
        };
      }
    } catch (error) {
      toast.error("Failed to create complainant. Please try again.");
      return;
    }

    // Prepare accused entry
    try {
  if (isAddingAccused) {
        if (!newAccused.name) {
          toast.error('Please provide accused full name');
          return;
        }
        const accRes = await api.postJson('/api/parties', {
          fullName: newAccused.name,
          nationalId: newAccused.nationalId,
          address: newAccused.address,
          roleInCase: PARTY_ROLE.ACCUSED,
          isPublic: true,
        });
        if (!accRes.ok) {
          console.error('Failed to create accused:', accRes);
          toast.error(`Failed to create accused: ${accRes.status} - ${JSON.stringify(accRes.body)}`);
          return;
        }
  accusedEntry = { partyId: accRes.body.partyId ?? accRes.body.id ?? null, roleInCase: PARTY_ROLE.ACCUSED };
      } else if (selectedAccused) {
        accusedEntry = { partyId: selectedAccused, roleInCase: PARTY_ROLE.ACCUSED };
      } else if (suspectName) {
        // include inline party object; backend will create it when creating case
        accusedEntry = { party: { fullName: suspectName, roleInCase: PARTY_ROLE.ACCUSED }, roleInCase: PARTY_ROLE.ACCUSED };
      }
    } catch (err) {
      console.error('Error preparing accused:', err);
      toast.error('Failed to prepare accused');
      return;
    }

    // Prepare victim entry (optional)
    try {
      if (isAddingVictim && newVictim.name) {
        const vicRes = await api.postJson('/api/parties', {
          fullName: newVictim.name,
          nationalId: newVictim.nationalId,
          address: newVictim.address,
          roleInCase: PARTY_ROLE.VICTIM,
          isPublic: true,
        });
        if (!vicRes.ok) {
          console.error('Failed to create victim:', vicRes);
          toast.error(`Failed to create victim: ${vicRes.status} - ${JSON.stringify(vicRes.body)}`);
          return;
        }
  victimEntry = { partyId: vicRes.body.partyId ?? vicRes.body.id ?? null, roleInCase: PARTY_ROLE.VICTIM };
      } else if (selectedVictim) {
        victimEntry = { partyId: selectedVictim, roleInCase: PARTY_ROLE.VICTIM };
      }
    } catch (err) {
      console.error('Error preparing victim:', err);
      toast.error('Failed to prepare victim');
      return;
    }

    const partiesArray: any[] = [complainantParty];
    if (accusedEntry) partiesArray.push(accusedEntry);
    if (victimEntry) partiesArray.push(victimEntry);

    const dto: any = {
      firId: caseId,
      registrationDate: (dateOfIncident ? (dateOfIncident.toISOString?.().slice(0,10) ?? new Date(dateOfIncident).toISOString().slice(0,10)) : new Date().toISOString().slice(0,10)),
      jurisdictionId: null,
      description: incidentDetails + "\nLocation: " + location,
  // must match backend enum values (see case_status enum in SQL)
  initialStatus: CASE_STATUS.FIR_FILED,
      parties: partiesArray,
    };

    try {
      const res = await api.postJson('/api/cases', dto);
      if (!res.ok) {
        console.error('Failed to file FIR response:', res);
        const body = typeof res.body === 'object' ? JSON.stringify(res.body) : String(res.body);
        toast.error(`Failed to file FIR: ${res.status} ${body}`);
      } else {
        toast.success(`FIR ${caseId} filed successfully!`);
        // Clear form
        setCaseId("");
        setSuspectName("");
        setIncidentDetails("");
        setDateOfIncident(undefined);
        setLocation("");
        setSelectedComplainant(null);
        setIsAddingComplainant(false);
        setNewComplainant({
          name: "",
          nationalId: "",
          address: "",
        });
      }
    } catch (e: any) {
      console.error('Network error filing FIR:', e);
      toast.error('Network error while filing FIR');
    }
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

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="complainant">Complainant</Label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddingComplainant(!isAddingComplainant)}
                  className="text-sm"
                >
                  {isAddingComplainant ? "Select Existing" : "Add New"}
                </Button>
              </div>

              {isAddingComplainant ? (
                <div className="space-y-4 border rounded-lg p-4">
                  <div className="space-y-2">
                    <Label htmlFor="newComplainantName">Full Name</Label>
                    <Input
                      id="newComplainantName"
                      placeholder="Complainant's Full Name"
                      value={newComplainant.name}
                      onChange={(e) =>
                        setNewComplainant({ ...newComplainant, name: e.target.value })
                      }
                      required={isAddingComplainant}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newComplainantNationalId">National ID</Label>
                    <Input
                      id="newComplainantNationalId"
                      placeholder="National ID Number"
                      value={newComplainant.nationalId}
                      onChange={(e) =>
                        setNewComplainant({
                          ...newComplainant,
                          nationalId: e.target.value,
                        })
                      }
                      required={isAddingComplainant}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newComplainantAddress">Address</Label>
                    <Input
                      id="newComplainantAddress"
                      placeholder="Current Address"
                      value={newComplainant.address}
                      onChange={(e) =>
                        setNewComplainant({
                          ...newComplainant,
                          address: e.target.value,
                        })
                      }
                      required={isAddingComplainant}
                    />
                  </div>
                </div>
              ) : (
                <select
                  id="complainant"
                  value={selectedComplainant ?? ""}
                  onChange={(e) => setSelectedComplainant(e.target.value ? Number(e.target.value) : null)}
                  className="w-full border rounded p-2"
                  required={!isAddingComplainant}
                >
                  <option value="">Select complainant</option>
                  {complainants.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Accused selection / add */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="accused">Accused</Label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddingAccused(!isAddingAccused)}
                  className="text-sm"
                >
                  {isAddingAccused ? "Select Existing" : "Add New"}
                </Button>
              </div>

              {isAddingAccused ? (
                <div className="space-y-4 border rounded-lg p-4">
                  <div className="space-y-2">
                    <Label htmlFor="newAccusedName">Full Name</Label>
                    <Input
                      id="newAccusedName"
                      placeholder="Accused Full Name"
                      value={newAccused.name}
                      onChange={(e) => setNewAccused({ ...newAccused, name: e.target.value })}
                      required={isAddingAccused}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newAccusedNationalId">National ID</Label>
                    <Input
                      id="newAccusedNationalId"
                      placeholder="National ID Number"
                      value={newAccused.nationalId}
                      onChange={(e) => setNewAccused({ ...newAccused, nationalId: e.target.value })}
                      required={isAddingAccused}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newAccusedAddress">Address</Label>
                    <Input
                      id="newAccusedAddress"
                      placeholder="Current Address"
                      value={newAccused.address}
                      onChange={(e) => setNewAccused({ ...newAccused, address: e.target.value })}
                      required={isAddingAccused}
                    />
                  </div>
                </div>
              ) : (
                <select
                  id="accused"
                  value={selectedAccused ?? ""}
                  onChange={(e) => setSelectedAccused(e.target.value ? Number(e.target.value) : null)}
                  className="w-full border rounded p-2"
                  required={!isAddingAccused}
                >
                  <option value="">Select accused (or leave blank and enter name above)</option>
                  {accusedList.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Victim selection / add (optional) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="victim">Victim (optional)</Label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddingVictim(!isAddingVictim)}
                  className="text-sm"
                >
                  {isAddingVictim ? "Select Existing" : "Add New"}
                </Button>
              </div>

              {isAddingVictim ? (
                <div className="space-y-4 border rounded-lg p-4">
                  <div className="space-y-2">
                    <Label htmlFor="newVictimName">Full Name</Label>
                    <Input
                      id="newVictimName"
                      placeholder="Victim's Full Name"
                      value={newVictim.name}
                      onChange={(e) => setNewVictim({ ...newVictim, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newVictimNationalId">National ID</Label>
                    <Input
                      id="newVictimNationalId"
                      placeholder="National ID Number"
                      value={newVictim.nationalId}
                      onChange={(e) => setNewVictim({ ...newVictim, nationalId: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newVictimAddress">Address</Label>
                    <Input
                      id="newVictimAddress"
                      placeholder="Current Address"
                      value={newVictim.address}
                      onChange={(e) => setNewVictim({ ...newVictim, address: e.target.value })}
                    />
                  </div>
                </div>
              ) : (
                <select
                  id="victim"
                  value={selectedVictim ?? ""}
                  onChange={(e) => setSelectedVictim(e.target.value ? Number(e.target.value) : null)}
                  className="w-full border rounded p-2"
                >
                  <option value="">Select victim (optional)</option>
                  {victimList.map((v) => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              )}
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