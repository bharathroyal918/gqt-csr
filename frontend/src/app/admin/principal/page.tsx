"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Modal } from "@/components/common/Modal";
import { toast } from "sonner";
import {
  Building2,
  Search,
  Eye,
  Mail,
  Phone,
  PowerOff,
  Power,
  CheckCircle2,
  FileCheck2,
  AlertCircle
} from "lucide-react";

interface PrincipalRecord {
  id: string;
  name: string;
  collegeName: string;
  district: string;
  email: string;
  mobile: string;
  mouApprovalStatus: "Executed & Verified" | "In Review" | "Pending Signature";
  driveSignoffStatus: "Approved" | "Pending";
  communicationLog: string;
  status: "Active" | "Inactive";
}

const INITIAL_PRINCIPALS: PrincipalRecord[] = [
  {
    id: "prin-01",
    name: "Dr. K.N. Subramanya",
    collegeName: "R.V. College of Engineering",
    district: "Bengaluru Urban",
    email: "principal@rvce.edu.in",
    mobile: "+91 98450 11990",
    mouApprovalStatus: "Executed & Verified",
    driveSignoffStatus: "Approved",
    communicationLog: "Official MoU renewed for 2024-2027 academic cycle on Jan 15, 2025.",
    status: "Active",
  },
  {
    id: "prin-02",
    name: "Dr. S. Muralidhara",
    collegeName: "BMS College of Engineering",
    district: "Bengaluru Urban",
    email: "principal@bmsce.ac.in",
    mobile: "+91 98450 11991",
    mouApprovalStatus: "Executed & Verified",
    driveSignoffStatus: "Approved",
    communicationLog: "Confirmed campus auditorium and 400 lab PCs for Phase-1 testing.",
    status: "Active",
  },
  {
    id: "prin-03",
    name: "Dr. Ashok S. Shettar",
    collegeName: "KLE Technological University",
    district: "Dharwad",
    email: "vicechancellor@kletech.ac.in",
    mobile: "+91 98450 11992",
    mouApprovalStatus: "Executed & Verified",
    driveSignoffStatus: "Approved",
    communicationLog: "Endorsed multi-branch CSR participation for Hubballi-Dharwad cluster.",
    status: "Active",
  },
  {
    id: "prin-04",
    name: "Dr. N.V.R. Naidu",
    collegeName: "Ramaiah Institute of Technology",
    district: "Bengaluru Urban",
    email: "principal@msrit.edu",
    mobile: "+91 98450 11993",
    mouApprovalStatus: "In Review",
    driveSignoffStatus: "Pending",
    communicationLog: "Draft MoU shared with legal counsel for standard clauses review.",
    status: "Active",
  },
];

export default function AdminPrincipalManagementPage() {
  const [principals, setPrincipals] = useState<PrincipalRecord[]>(INITIAL_PRINCIPALS);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewingPrincipal, setViewingPrincipal] = useState<PrincipalRecord | null>(null);

  const filtered = principals.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.collegeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleStatus = (id: string) => {
    setPrincipals((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: p.status === "Active" ? "Inactive" : "Active" } : p
      )
    );
    toast.success("Principal account status updated");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900/40 via-blue-950/30 to-indigo-900/40 border border-blue-500/20 backdrop-blur-xl p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              Institutional Executive Leadership
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Principal Leadership Directory
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage institutional heads, track bilateral CSR MoU execution status, and audit drive authorizations.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border border-border/60 bg-card/60 backdrop-blur-md rounded-2xl">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground font-medium">College Principals</p>
            <p className="text-2xl font-bold text-foreground mt-1">{principals.length}</p>
          </CardContent>
        </Card>
        <Card className="border border-border/60 bg-card/60 backdrop-blur-md rounded-2xl">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground font-medium">MoUs Executed</p>
            <p className="text-2xl font-bold text-emerald-500 mt-1">
              {principals.filter((p) => p.mouApprovalStatus === "Executed & Verified").length}
            </p>
          </CardContent>
        </Card>
        <Card className="border border-border/60 bg-card/60 backdrop-blur-md rounded-2xl">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground font-medium">Drive Approved</p>
            <p className="text-2xl font-bold text-blue-400 mt-1">
              {principals.filter((p) => p.driveSignoffStatus === "Approved").length}
            </p>
          </CardContent>
        </Card>
        <Card className="border border-border/60 bg-card/60 backdrop-blur-md rounded-2xl">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground font-medium">Pending Approvals</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">
              {principals.filter((p) => p.mouApprovalStatus !== "Executed & Verified").length}
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
          placeholder="Search by principal name, college, or district..."
          className="pl-10 h-10 bg-card/60"
        />
      </div>

      {/* Table */}
      <Card className="border border-border/60 bg-card/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 border-b border-border/50 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              <tr>
                <th className="p-4 pl-6">Principal</th>
                <th className="p-4">Institution & District</th>
                <th className="p-4">Direct Contact</th>
                <th className="p-4 text-center">MoU Status</th>
                <th className="p-4 text-center">Drive Signoff</th>
                <th className="p-4 text-center">Account</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-medium">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="font-bold text-foreground">{p.name}</div>
                    <div className="text-xs text-muted-foreground">Executive Head</div>
                  </td>
                  <td className="p-4 text-xs">
                    <div className="font-semibold text-foreground">{p.collegeName}</div>
                    <div className="text-muted-foreground">{p.district}</div>
                  </td>
                  <td className="p-4 text-xs">
                    <div>{p.email}</div>
                    <div className="text-muted-foreground">{p.mobile}</div>
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-semibold border ${
                        p.mouApprovalStatus === "Executed & Verified"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }`}
                    >
                      {p.mouApprovalStatus}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-semibold border ${
                        p.driveSignoffStatus === "Approved"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }`}
                    >
                      {p.driveSignoffStatus}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-semibold border ${
                        p.status === "Active"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setViewingPrincipal(p)}
                        className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleStatus(p.id)}
                        className={`h-8 w-8 p-0 ${
                          p.status === "Active" ? "hover:bg-rose-500/10 text-rose-400" : "hover:bg-emerald-500/10 text-emerald-400"
                        }`}
                      >
                        {p.status === "Active" ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* View Modal */}
      {viewingPrincipal && (
        <Modal
          isOpen={!!viewingPrincipal}
          onClose={() => setViewingPrincipal(null)}
          title={`Principal Profile: ${viewingPrincipal.name}`}
        >
          <div className="space-y-4 pt-2">
            <div className="p-4 bg-muted/40 rounded-2xl space-y-2">
              <h3 className="text-base font-bold">{viewingPrincipal.collegeName}</h3>
              <p className="text-xs text-muted-foreground">{viewingPrincipal.district}, Karnataka</p>
              <div className="pt-2 border-t text-xs space-y-1">
                <p>Official Email: <span className="font-semibold text-foreground">{viewingPrincipal.email}</span></p>
                <p>Direct Mobile: <span className="font-semibold text-foreground">{viewingPrincipal.mobile}</span></p>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase text-muted-foreground mb-1">Bilateral Communication Log</h4>
              <p className="text-xs bg-card p-3 border rounded-xl leading-relaxed">{viewingPrincipal.communicationLog}</p>
            </div>
            <div className="flex justify-end pt-2">
              <Button onClick={() => setViewingPrincipal(null)}>Close</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
