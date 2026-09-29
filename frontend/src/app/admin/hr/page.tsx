"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Modal } from "@/components/common/Modal";
import { toast } from "sonner";
import {
  UserCheck,
  Search,
  Filter,
  Eye,
  Edit,
  Building2,
  Briefcase,
  Phone,
  Mail,
  CheckCircle2,
  TrendingUp,
  Award,
  PowerOff,
  Power,
  Users
} from "lucide-react";
import { useApp } from "@/context/AppContext";

interface HRExecutive {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  mobile: string;
  assignedDrives: string[];
  assignedColleges: string[];
  pendingInterviews: number;
  completedInterviews: number;
  selectionPercentage: number;
  status: "Active" | "Inactive";
}

const INITIAL_HR_TEAM: HRExecutive[] = [
  {
    id: "hr-001",
    employeeId: "GQT-EMP-2041",
    name: "Hitha, Kusuma",
    email: "[EMAIL_ADDRESS]",
    mobile: "+91 98450 33445",
    assignedDrives: ["Karnataka CSR Drive 2025", "VTU Special Drive"],
    assignedColleges: ["R.V. College of Engineering", "BMS College of Engineering"],
    pendingInterviews: 14,
    completedInterviews: 182,
    selectionPercentage: 38.5,
    status: "Active",
  },
  {
    id: "hr-002",
    employeeId: "GQT-EMP-2049",
    name: "Divya.H",
    email: "[EMAIL_ADDRESS]",
    mobile: "+91 98450 33446",
    assignedDrives: ["Karnataka CSR Drive 2025"],
    assignedColleges: ["PES University", "Ramaiah Institute of Technology"],
    pendingInterviews: 8,
    completedInterviews: 145,
    selectionPercentage: 42.0,
    status: "Active",
  },
  {
    id: "hr-003",
    employeeId: "GQT-EMP-2055",
    name: "Sneha Rao",
    email: "[EMAIL_ADDRESS]",
    mobile: "+91 98450 55667",
    assignedDrives: ["North Karnataka Region Drive"],
    assignedColleges: ["KLE Technological University", "SDM College of Engg"],
    pendingInterviews: 22,
    completedInterviews: 110,
    selectionPercentage: 34.0,
    status: "Active",
  },
  {
    id: "hr-004",
    employeeId: "GQT-EMP-2060",
    name: "Arun Kumar",
    email: "[EMAIL_ADDRESS]",
    mobile: "+91 98450 66778",
    assignedDrives: ["Mysuru & Mandya Drive"],
    assignedColleges: ["NIE Mysore", "SJCE Mysore"],
    pendingInterviews: 5,
    completedInterviews: 95,
    selectionPercentage: 36.8,
    status: "Active",
  },
  {
    id: "hr-005",
    employeeId: "GQT-EMP-2012",
    name: "Pooja Hegde",
    email: "[EMAIL_ADDRESS]",
    mobile: "+91 98450 77889",
    assignedDrives: ["Coastal Karnataka Drive"],
    assignedColleges: ["NMAMIT Nitte", "Canara Engineering College"],
    pendingInterviews: 0,
    completedInterviews: 45,
    selectionPercentage: 28.0,
    status: "Inactive",
  },
];

export default function AdminHRManagementPage() {
  const { colleges } = useApp();
  const [hrList, setHrList] = useState<HRExecutive[]>(INITIAL_HR_TEAM);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modals
  const [viewingHr, setViewingHr] = useState<HRExecutive | null>(null);
  const [assignCollegesHr, setAssignCollegesHr] = useState<HRExecutive | null>(null);
  const [selectedColleges, setSelectedColleges] = useState<string[]>([]);

  const filtered = hrList.filter((hr) => {
    const matchesSearch =
      hr.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hr.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hr.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || hr.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const toggleStatus = (id: string) => {
    setHrList((prev) =>
      prev.map((hr) =>
        hr.id === id ? { ...hr, status: hr.status === "Active" ? "Inactive" : "Active" } : hr
      )
    );
    toast.success("HR status updated");
  };

  const handleOpenAssignColleges = (hr: HRExecutive) => {
    setAssignCollegesHr(hr);
    setSelectedColleges(hr.assignedColleges);
  };

  const handleSaveColleges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignCollegesHr) return;
    setHrList((prev) =>
      prev.map((h) =>
        h.id === assignCollegesHr.id ? { ...h, assignedColleges: selectedColleges } : h
      )
    );
    toast.success(`Updated assigned colleges for ${assignCollegesHr.name}`);
    setAssignCollegesHr(null);
  };

  const toggleCollegeSelection = (name: string) => {
    setSelectedColleges((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900/40 via-blue-950/30 to-indigo-900/40 border border-blue-500/20 backdrop-blur-xl p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5" />
              Recruitment Division
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            HR Recruiter Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Monitor HR interview throughput, candidate conversion metrics, college allocations, and recruiter accountability.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border border-border/60 bg-card/60 backdrop-blur-md rounded-2xl">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground font-medium">Total HR Recruiters</p>
            <p className="text-2xl font-bold text-foreground mt-1">{hrList.length}</p>
          </CardContent>
        </Card>
        <Card className="border border-border/60 bg-card/60 backdrop-blur-md rounded-2xl">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground font-medium">Active Today</p>
            <p className="text-2xl font-bold text-emerald-500 mt-1">
              {hrList.filter((h) => h.status === "Active").length}
            </p>
          </CardContent>
        </Card>
        <Card className="border border-border/60 bg-card/60 backdrop-blur-md rounded-2xl">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground font-medium">Interviews Completed</p>
            <p className="text-2xl font-bold text-blue-400 mt-1">
              {hrList.reduce((acc, h) => acc + h.completedInterviews, 0)}
            </p>
          </CardContent>
        </Card>
        <Card className="border border-border/60 bg-card/60 backdrop-blur-md rounded-2xl">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground font-medium">Avg. Selection Rate</p>
            <p className="text-2xl font-bold text-purple-400 mt-1">36.3%</p>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-card/60 backdrop-blur-md p-4 rounded-2xl border border-border/60">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search HR by name, employee ID, or email..."
            className="pl-10 h-10 bg-background/80"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-3 text-xs rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <Card className="border border-border/60 bg-card/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 border-b border-border/50 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              <tr>
                <th className="p-4 pl-6">HR Executive</th>
                <th className="p-4">Contact Info</th>
                <th className="p-4">Assigned Drives</th>
                <th className="p-4 text-center">Colleges</th>
                <th className="p-4 text-center">Pending</th>
                <th className="p-4 text-center">Completed</th>
                <th className="p-4 text-center">Select %</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-medium">
              {filtered.map((hr) => (
                <tr key={hr.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="font-bold text-foreground">{hr.name}</div>
                    <div className="text-xs text-muted-foreground font-mono">{hr.employeeId}</div>
                  </td>
                  <td className="p-4 text-xs">
                    <div className="text-foreground">{hr.email}</div>
                    <div className="text-muted-foreground">{hr.mobile}</div>
                  </td>
                  <td className="p-4 text-xs">
                    {hr.assignedDrives.map((d, i) => (
                      <span key={i} className="inline-block bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full mr-1 mb-1">
                        {d}
                      </span>
                    ))}
                  </td>
                  <td className="p-4 text-center font-bold text-foreground">
                    {hr.assignedColleges.length}
                  </td>
                  <td className="p-4 text-center font-bold text-amber-500">
                    {hr.pendingInterviews}
                  </td>
                  <td className="p-4 text-center font-bold text-emerald-500">
                    {hr.completedInterviews}
                  </td>
                  <td className="p-4 text-center">
                    <span className="font-bold text-indigo-400">{hr.selectionPercentage}%</span>
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-semibold border ${
                        hr.status === "Active"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                      }`}
                    >
                      {hr.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setViewingHr(hr)}
                        title="View HR Performance"
                        className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleOpenAssignColleges(hr)}
                        title="Assign Colleges"
                        className="h-8 w-8 p-0 hover:bg-blue-500/10 hover:text-blue-400"
                      >
                        <Building2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleStatus(hr.id)}
                        title={hr.status === "Active" ? "Deactivate HR" : "Activate HR"}
                        className={`h-8 w-8 p-0 ${
                          hr.status === "Active" ? "hover:bg-rose-500/10 text-rose-400" : "hover:bg-emerald-500/10 text-emerald-400"
                        }`}
                      >
                        {hr.status === "Active" ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* HR View Performance Modal */}
      {viewingHr && (
        <Modal
          isOpen={!!viewingHr}
          onClose={() => setViewingHr(null)}
          title={`Recruiter Dossier: ${viewingHr.name}`}
        >
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3 p-4 bg-muted/40 rounded-2xl">
              <div>
                <p className="text-xs text-muted-foreground">Employee ID</p>
                <p className="text-xs font-bold text-foreground font-mono">{viewingHr.employeeId}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <p className="text-xs font-semibold text-emerald-400">{viewingHr.status}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Contact</p>
                <p className="text-xs font-semibold text-foreground">{viewingHr.email}</p>
                <p className="text-[11px] text-muted-foreground">{viewingHr.mobile}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Selection Efficiency</p>
                <p className="text-xs font-bold text-indigo-400">{viewingHr.selectionPercentage}% Conversion</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <p className="text-xs text-muted-foreground">Pending Queue</p>
                <p className="text-xl font-bold text-amber-500">{viewingHr.pendingInterviews}</p>
              </div>
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <p className="text-xs text-muted-foreground">Completed Evaluations</p>
                <p className="text-xl font-bold text-emerald-500">{viewingHr.completedInterviews}</p>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Assigned Institutions</h4>
              <ul className="text-xs space-y-1 list-disc list-inside text-foreground">
                {viewingHr.assignedColleges.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={() => setViewingHr(null)}>Close</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Assign Colleges Modal */}
      {assignCollegesHr && (
        <Modal
          isOpen={!!assignCollegesHr}
          onClose={() => setAssignCollegesHr(null)}
          title={`Allocate Institutions to ${assignCollegesHr.name}`}
        >
          <form onSubmit={handleSaveColleges} className="space-y-4 pt-2">
            <p className="text-xs text-muted-foreground">
              Select all engineering colleges this HR recruiter is authorized to conduct CSR evaluations for:
            </p>
            <div className="max-h-60 overflow-y-auto space-y-2 p-2 border border-border rounded-xl">
              {colleges.map((col) => {
                const isSelected = selectedColleges.includes(col.name);
                return (
                  <div
                    key={col.id}
                    onClick={() => toggleCollegeSelection(col.name)}
                    className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-colors text-xs ${
                      isSelected ? "bg-primary/10 border border-primary/30 font-medium" : "hover:bg-muted"
                    }`}
                  >
                    <span>{col.name}</span>
                    <span className="text-muted-foreground text-[11px]">{col.district}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setAssignCollegesHr(null)}>Cancel</Button>
              <Button type="submit" className="bg-primary text-white">Save Allocations</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
