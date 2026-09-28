"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Modal } from "@/components/common/Modal";
import { toast } from "sonner";
import {
  School,
  Search,
  Filter,
  Eye,
  Building2,
  Mail,
  Phone,
  PowerOff,
  Power,
  MessageSquare,
  Briefcase,
  CheckCircle2,
  Clock
} from "lucide-react";
import { useApp } from "@/context/AppContext";

interface PlacementOfficerRecord {
  id: string;
  name: string;
  designation: string;
  email: string;
  mobile: string;
  collegeName: string;
  district: string;
  assignedDrivesCount: number;
  studentsRegistered: number;
  status: "Active" | "Inactive";
  lastCommunication: string;
}

const INITIAL_PTOS: PlacementOfficerRecord[] = [
  {
    id: "pto-01",
    name: "Prof. Chandrasekhar",
    designation: "Head - Department of Training & Placement",
    email: "placement@rvce.edu.in",
    mobile: "+91 98450 44556",
    collegeName: "R.V. College of Engineering",
    district: "Bengaluru Urban",
    assignedDrivesCount: 2,
    studentsRegistered: 280,
    status: "Active",
    lastCommunication: "2025-02-14 11:30 AM (Drive Signoff Confirmed)",
  },
  {
    id: "pto-02",
    name: "Dr. Muralidhara",
    designation: "Director - Placements",
    email: "placements@bmsce.ac.in",
    mobile: "+91 98450 44557",
    collegeName: "BMS College of Engineering",
    district: "Bengaluru Urban",
    assignedDrivesCount: 1,
    studentsRegistered: 215,
    status: "Active",
    lastCommunication: "2025-02-12 04:15 PM (Hall Tickets Verified)",
  },
  {
    id: "pto-03",
    name: "Prof. Ramesh Kulkarni",
    designation: "Training & Placement Officer",
    email: "placement@kletech.ac.in",
    mobile: "+91 98450 44558",
    collegeName: "KLE Technological University",
    district: "Dharwad",
    assignedDrivesCount: 1,
    studentsRegistered: 190,
    status: "Active",
    lastCommunication: "2025-02-10 02:00 PM (Lab Readiness Approved)",
  },
  {
    id: "pto-04",
    name: "Dr. Savitha Rani",
    designation: "Head - Industry Relations & Placements",
    email: "tpo@msrit.edu",
    mobile: "+91 98450 44559",
    collegeName: "Ramaiah Institute of Technology",
    district: "Bengaluru Urban",
    assignedDrivesCount: 2,
    studentsRegistered: 310,
    status: "Active",
    lastCommunication: "2025-02-08 10:20 AM (Student Roster Uploaded)",
  },
  {
    id: "pto-05",
    name: "Prof. Vinay Kumar",
    designation: "Placement Coordinator",
    email: "placements@nie.ac.in",
    mobile: "+91 98450 44560",
    collegeName: "The National Institute of Engineering (NIE)",
    district: "Mysuru",
    assignedDrivesCount: 0,
    studentsRegistered: 0,
    status: "Inactive",
    lastCommunication: "2025-01-20 03:45 PM (Inquiry Follow-up Pending)",
  },
];

export default function AdminPlacementOfficersPage() {
  const [ptos, setPtos] = useState<PlacementOfficerRecord[]>(INITIAL_PTOS);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewingPto, setViewingPto] = useState<PlacementOfficerRecord | null>(null);

  const filtered = ptos.filter((p) => {
    return (
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.collegeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.district.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const toggleStatus = (id: string) => {
    setPtos((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: p.status === "Active" ? "Inactive" : "Active" } : p
      )
    );
    toast.success("Placement Officer status updated");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900/40 via-blue-950/30 to-indigo-900/40 border border-blue-500/20 backdrop-blur-xl p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1.5">
              <School className="w-3.5 h-3.5" />
              Institutional Placement Leadership
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Placement Officer (PTO) Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Oversee college Training & Placement Officers, campus coordinators, communication history, and student registration turnout.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border border-border/60 bg-card/60 backdrop-blur-md rounded-2xl">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground font-medium">Onboarded PTOs</p>
            <p className="text-2xl font-bold text-foreground mt-1">{ptos.length}</p>
          </CardContent>
        </Card>
        <Card className="border border-border/60 bg-card/60 backdrop-blur-md rounded-2xl">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground font-medium">Active Accounts</p>
            <p className="text-2xl font-bold text-emerald-500 mt-1">{ptos.filter((p) => p.status === "Active").length}</p>
          </CardContent>
        </Card>
        <Card className="border border-border/60 bg-card/60 backdrop-blur-md rounded-2xl">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground font-medium">Total Registered</p>
            <p className="text-2xl font-bold text-blue-400 mt-1">
              {ptos.reduce((acc, p) => acc + p.studentsRegistered, 0)} Students
            </p>
          </CardContent>
        </Card>
        <Card className="border border-border/60 bg-card/60 backdrop-blur-md rounded-2xl">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground font-medium">Districts Represented</p>
            <p className="text-2xl font-bold text-indigo-400 mt-1">3 Districts</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by PTO name, institution, or email..."
          className="pl-10 h-10 bg-card/60"
        />
      </div>

      {/* PTO Table */}
      <Card className="border border-border/60 bg-card/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 border-b border-border/50 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              <tr>
                <th className="p-4 pl-6">Placement Officer</th>
                <th className="p-4">Institution & District</th>
                <th className="p-4">Contact</th>
                <th className="p-4 text-center">Drives</th>
                <th className="p-4 text-center">Registered</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4">Recent Communication</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-medium">
              {filtered.map((pto) => (
                <tr key={pto.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="font-bold text-foreground">{pto.name}</div>
                    <div className="text-xs text-muted-foreground">{pto.designation}</div>
                  </td>
                  <td className="p-4 text-xs">
                    <div className="font-semibold text-foreground">{pto.collegeName}</div>
                    <div className="text-muted-foreground">{pto.district}</div>
                  </td>
                  <td className="p-4 text-xs">
                    <div>{pto.email}</div>
                    <div className="text-muted-foreground">{pto.mobile}</div>
                  </td>
                  <td className="p-4 text-center font-bold">{pto.assignedDrivesCount}</td>
                  <td className="p-4 text-center font-bold text-blue-400">{pto.studentsRegistered}</td>
                  <td className="p-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-semibold border ${
                        pto.status === "Active"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                      }`}
                    >
                      {pto.status}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-muted-foreground max-w-xs truncate">
                    {pto.lastCommunication}
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setViewingPto(pto)}
                        className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleStatus(pto.id)}
                        className={`h-8 w-8 p-0 ${
                          pto.status === "Active" ? "hover:bg-rose-500/10 text-rose-400" : "hover:bg-emerald-500/10 text-emerald-400"
                        }`}
                      >
                        {pto.status === "Active" ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* PTO View Modal */}
      {viewingPto && (
        <Modal
          isOpen={!!viewingPto}
          onClose={() => setViewingPto(null)}
          title={`Placement Officer Dossier: ${viewingPto.name}`}
        >
          <div className="space-y-4 pt-2">
            <div className="p-4 bg-muted/40 rounded-2xl space-y-2">
              <p className="text-xs text-muted-foreground">{viewingPto.designation}</p>
              <h3 className="text-base font-bold">{viewingPto.collegeName}</h3>
              <p className="text-xs text-muted-foreground">{viewingPto.district}, Karnataka</p>
              <div className="pt-2 border-t text-xs space-y-1">
                <p>Email: <span className="font-semibold text-foreground">{viewingPto.email}</span></p>
                <p>Mobile: <span className="font-semibold text-foreground">{viewingPto.mobile}</span></p>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase text-muted-foreground mb-1">Communication Record</h4>
              <p className="text-xs bg-card p-3 border rounded-xl">{viewingPto.lastCommunication}</p>
            </div>
            <div className="flex justify-end pt-2">
              <Button onClick={() => setViewingPto(null)}>Close</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
