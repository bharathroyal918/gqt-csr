"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { Input } from "@/components/common/Input";
import {
  Shield,
  Key,
  Users,
  CheckCircle,
  XCircle,
  Edit,
  ArrowRight,
  ExternalLink,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

interface RoleItem {
  id: string;
  name: string;
  key: string;
  portalUrl: string;
  description: string;
  permissionsCount: number;
  activeUsersCount: number;
  createdDate: string;
  status: "Active" | "Restricted";
  isSystemLocked?: boolean;
}

export function RoleManagementView() {
  const [roles, setRoles] = useState<RoleItem[]>([
    {
      id: "role-1",
      name: "Super Administrator",
      key: "super_admin",
      portalUrl: "/admin/dashboard",
      description: "Root sovereign authority with unrestricted read/write clearance across all 8 enterprise portals and databases.",
      permissionsCount: 32,
      activeUsersCount: 2,
      createdDate: "Jan 10, 2025",
      status: "Active",
      isSystemLocked: true,
    },
    {
      id: "role-2",
      name: "CSR Program Manager",
      key: "csr_manager",
      portalUrl: "/csr-manager/dashboard",
      description: "Orchestrates statewide 15-phase CSR drives, partner college onboarding, WhatsApp communications, and HR assignment.",
      permissionsCount: 18,
      activeUsersCount: 4,
      createdDate: "Jan 12, 2025",
      status: "Active",
    },
    {
      id: "role-3",
      name: "HR Recruitment Lead",
      key: "hr",
      portalUrl: "/hr/dashboard",
      description: "Conducts candidate interviews, logs CRM calls, marks scoring rubrics, and triggers offer letter releases.",
      permissionsCount: 10,
      activeUsersCount: 8,
      createdDate: "Jan 15, 2025",
      status: "Active",
    },
    {
      id: "role-4",
      name: "Placement Officer (PTO)",
      key: "placement_officer",
      portalUrl: "/pto/dashboard",
      description: "College placement cell representative verifying enrolled candidates, hall tickets, and institutional participation.",
      permissionsCount: 8,
      activeUsersCount: 24,
      createdDate: "Jan 20, 2025",
      status: "Active",
    },
    {
      id: "role-5",
      name: "Faculty Coordinator",
      key: "faculty",
      portalUrl: "/faculty/dashboard",
      description: "Department-level coordinator verifying student academic criteria, lab exam attendance check-ins, and proctoring.",
      permissionsCount: 6,
      activeUsersCount: 48,
      createdDate: "Feb 01, 2025",
      status: "Active",
    },
    {
      id: "role-6",
      name: "Principal & Dean",
      key: "principal",
      portalUrl: "/principal/dashboard",
      description: "Institutional leadership reviewing campus drive performance, approving MoUs, and downloading NAAC placement reports.",
      permissionsCount: 7,
      activeUsersCount: 18,
      createdDate: "Feb 05, 2025",
      status: "Active",
    },
    {
      id: "role-7",
      name: "Executive Management",
      key: "management",
      portalUrl: "/management/dashboard",
      description: "Board level governance with read-only clearance over statewide conversion analytics and audit trails.",
      permissionsCount: 8,
      activeUsersCount: 5,
      createdDate: "Feb 10, 2025",
      status: "Active",
    },
    {
      id: "role-8",
      name: "Student Candidate",
      key: "student",
      portalUrl: "/student/dashboard",
      description: "Candidate portal for taking online proctored exams, viewing interview outcomes, and accepting offer letters.",
      permissionsCount: 5,
      activeUsersCount: 4280,
      createdDate: "Feb 15, 2025",
      status: "Active",
    },
  ]);

  const [selectedRole, setSelectedRole] = useState<RoleItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editDesc, setEditDesc] = useState("");
  const [editName, setEditName] = useState("");

  const handleEditRole = (r: RoleItem) => {
    setSelectedRole(r);
    setEditName(r.name);
    setEditDesc(r.description);
    setIsEditModalOpen(true);
  };

  const handleSaveRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;
    setRoles((prev) =>
      prev.map((item) =>
        item.id === selectedRole.id ? { ...item, name: editName, description: editDesc } : item
      )
    );
    setIsEditModalOpen(false);
    toast.success(`Role ${editName} updated successfully in Supabase`);
  };

  const handleToggleRoleStatus = (id: string) => {
    setRoles((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          if (r.isSystemLocked) {
            toast.error("Super Administrator role cannot be restricted");
            return r;
          }
          const next = r.status === "Active" ? "Restricted" : "Active";
          toast.success(`Role ${r.name} status updated to ${next}`);
          return { ...r, status: next };
        }
        return r;
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-[#005BBB] dark:text-[#14B8FF] text-[10px] font-extrabold uppercase tracking-wider mb-1">
            Access Governance
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Shield className="w-6 h-6 text-[#005BBB] dark:text-[#14B8FF]" />
            <span>Role-Based Access Control (RBAC)</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure the 8 official authority roles of the GQT CSR Platform, portal boundaries, and user counts.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/admin/permissions">
            <Button variant="primary" size="sm" leftIcon={<Key className="w-4 h-4" />}>
              Open Permission Matrix
            </Button>
          </Link>
        </div>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {roles.map((r) => (
          <Card key={r.id} className="relative overflow-hidden flex flex-col justify-between group">
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-[#005BBB] dark:text-[#14B8FF] uppercase font-bold">
                  {r.key}
                </span>

                <button
                  type="button"
                  onClick={() => handleToggleRoleStatus(r.id)}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-all ${
                    r.status === "Active"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                      : "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                  }`}
                >
                  {r.status}
                </button>
              </div>

              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5 flex items-center gap-1.5">
                <span>{r.name}</span>
                {r.isSystemLocked && <Shield className="w-3.5 h-3.5 text-[#005BBB]" />}
              </h3>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                {r.description}
              </p>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-2 text-[11px]">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span>Portal Route:</span>
                  <code className="font-mono text-[#005BBB] dark:text-[#14B8FF] font-bold">{r.portalUrl}</code>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span>Permissions:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{r.permissionsCount} Policies</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span>Active Users:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{r.activeUsersCount.toLocaleString()} Users</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <Link
                href="/admin/permissions"
                className="text-[11px] font-bold text-[#005BBB] dark:text-[#14B8FF] hover:underline flex items-center gap-1"
              >
                <span>Edit Permissions</span>
                <ArrowRight className="w-3 h-3" />
              </Link>

              <button
                type="button"
                onClick={() => handleEditRole(r)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                title="Edit Role Meta"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* EDIT ROLE MODAL */}
      {selectedRole && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={`Edit Role: ${selectedRole.name}`}
          size="md"
        >
          <form onSubmit={handleSaveRole} className="space-y-4 pt-2">
            <Input
              label="Role Display Name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Role Description & Authority Scope
              </label>
              <textarea
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                rows={4}
                className="w-full text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-3">
              <Button variant="outline" size="sm" type="button" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
