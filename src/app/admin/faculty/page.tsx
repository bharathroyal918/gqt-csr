"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Modal } from "@/components/common/Modal";
import { toast } from "sonner";
import {
  Award,
  Search,
  Building2,
  CheckCircle2,
  Clock,
  PowerOff,
  Power,
  Users,
  CheckSquare,
  QrCode
} from "lucide-react";

interface FacultyCoordinator {
  id: string;
  name: string;
  department: string;
  collegeName: string;
  email: string;
  mobile: string;
  verificationTaskAssigned: boolean;
  attendanceTaskAssigned: boolean;
  assignedStudentsCount: number;
  verifiedCount: number;
  status: "Active" | "Inactive";
}

const INITIAL_FACULTY: FacultyCoordinator[] = [
  {
    id: "fac-01",
    name: "Dr. Suma Swamy",
    department: "Computer Science & Engineering",
    collegeName: "R.V. College of Engineering",
    email: "sumaswamy@rvce.edu.in",
    mobile: "+91 98450 66112",
    verificationTaskAssigned: true,
    attendanceTaskAssigned: true,
    assignedStudentsCount: 140,
    verifiedCount: 132,
    status: "Active",
  },
  {
    id: "fac-02",
    name: "Prof. Girish Rao",
    department: "Information Science & Engineering",
    collegeName: "BMS College of Engineering",
    email: "girish.ise@bmsce.ac.in",
    mobile: "+91 98450 66113",
    verificationTaskAssigned: true,
    attendanceTaskAssigned: false,
    assignedStudentsCount: 110,
    verifiedCount: 95,
    status: "Active",
  },
  {
    id: "fac-03",
    name: "Dr. Pratibha Patil",
    department: "Electronics & Communication Engg",
    collegeName: "KLE Technological University",
    email: "pratibha.ece@kletech.ac.in",
    mobile: "+91 98450 66114",
    verificationTaskAssigned: false,
    attendanceTaskAssigned: true,
    assignedStudentsCount: 90,
    verifiedCount: 88,
    status: "Active",
  },
  {
    id: "fac-04",
    name: "Prof. Anand Joshi",
    department: "Artificial Intelligence & ML",
    collegeName: "Ramaiah Institute of Technology",
    email: "anand.aiml@msrit.edu",
    mobile: "+91 98450 66115",
    verificationTaskAssigned: true,
    attendanceTaskAssigned: true,
    assignedStudentsCount: 120,
    verifiedCount: 115,
    status: "Active",
  },
];

export default function AdminFacultyManagementPage() {
  const [facultyList, setFacultyList] = useState<FacultyCoordinator[]>(INITIAL_FACULTY);
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = facultyList.filter(
    (f) =>
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.collegeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleVerificationTask = (id: string) => {
    setFacultyList((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, verificationTaskAssigned: !f.verificationTaskAssigned } : f
      )
    );
    toast.success("Verification task assignment updated");
  };

  const toggleAttendanceTask = (id: string) => {
    setFacultyList((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, attendanceTaskAssigned: !f.attendanceTaskAssigned } : f
      )
    );
    toast.success("Attendance duty assignment updated");
  };

  const toggleStatus = (id: string) => {
    setFacultyList((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, status: f.status === "Active" ? "Inactive" : "Active" } : f
      )
    );
    toast.success("Faculty coordinator status updated");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900/40 via-blue-950/30 to-indigo-900/40 border border-blue-500/20 backdrop-blur-xl p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" />
              Academic Department Coordinators
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Faculty Coordinator Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Assign candidate credential verification, manage hall-ticket attendance duties, and monitor department-level candidate throughput.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border border-border/60 bg-card/60 backdrop-blur-md rounded-2xl">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground font-medium">Faculty Coordinators</p>
            <p className="text-2xl font-bold text-foreground mt-1">{facultyList.length}</p>
          </CardContent>
        </Card>
        <Card className="border border-border/60 bg-card/60 backdrop-blur-md rounded-2xl">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground font-medium">On Duty Verification</p>
            <p className="text-2xl font-bold text-emerald-500 mt-1">
              {facultyList.filter((f) => f.verificationTaskAssigned).length}
            </p>
          </CardContent>
        </Card>
        <Card className="border border-border/60 bg-card/60 backdrop-blur-md rounded-2xl">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground font-medium">Students Assigned</p>
            <p className="text-2xl font-bold text-blue-400 mt-1">
              {facultyList.reduce((acc, f) => acc + f.assignedStudentsCount, 0)}
            </p>
          </CardContent>
        </Card>
        <Card className="border border-border/60 bg-card/60 backdrop-blur-md rounded-2xl">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground font-medium">Verified Credentials</p>
            <p className="text-2xl font-bold text-purple-400 mt-1">
              {facultyList.reduce((acc, f) => acc + f.verifiedCount, 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by faculty name, department, or college..."
          className="pl-10 h-10 bg-card/60"
        />
      </div>

      {/* Table */}
      <Card className="border border-border/60 bg-card/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 border-b border-border/50 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              <tr>
                <th className="p-4 pl-6">Faculty Coordinator</th>
                <th className="p-4">Department & College</th>
                <th className="p-4 text-center">Verification Duty</th>
                <th className="p-4 text-center">Attendance Duty</th>
                <th className="p-4 text-center">Progress</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-medium">
              {filtered.map((f) => (
                <tr key={f.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="font-bold text-foreground">{f.name}</div>
                    <div className="text-xs text-muted-foreground">{f.email}</div>
                  </td>
                  <td className="p-4 text-xs">
                    <div className="font-semibold text-primary">{f.department}</div>
                    <div className="text-muted-foreground">{f.collegeName}</div>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      type="button"
                      onClick={() => toggleVerificationTask(f.id)}
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold border transition-colors ${
                        f.verificationTaskAssigned
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                      }`}
                    >
                      {f.verificationTaskAssigned ? "Assigned" : "Unassigned"}
                    </button>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      type="button"
                      onClick={() => toggleAttendanceTask(f.id)}
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold border transition-colors ${
                        f.attendanceTaskAssigned
                          ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                          : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                      }`}
                    >
                      {f.attendanceTaskAssigned ? "Assigned" : "Unassigned"}
                    </button>
                  </td>
                  <td className="p-4 text-center text-xs">
                    <span className="font-bold text-foreground">{f.verifiedCount}</span>
                    <span className="text-muted-foreground"> / {f.assignedStudentsCount}</span>
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-semibold border ${
                        f.status === "Active"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                      }`}
                    >
                      {f.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleStatus(f.id)}
                      className={`h-8 w-8 p-0 ${
                        f.status === "Active" ? "hover:bg-rose-500/10 text-rose-400" : "hover:bg-emerald-500/10 text-emerald-400"
                      }`}
                    >
                      {f.status === "Active" ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
