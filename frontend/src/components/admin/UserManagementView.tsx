"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { UserAccount, UserRole } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Modal } from "@/components/common/Modal";
import { Avatar } from "@/components/common/Avatar";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  MoreVertical,
  Shield,
  Building2,
  Mail,
  Phone,
  Lock,
  KeyRound,
  Trash2,
  CheckCircle,
  XCircle,
  Briefcase,
  Edit,
  Eye,
  RotateCcw,
  ShieldCheck,
  Upload,
  FileSpreadsheet,
  Download,
  AlertTriangle,
  MapPin,
  CheckSquare,
  Square,
  Sparkles,
  ExternalLink,
  Layers,
} from "lucide-react";
import { toast } from "sonner";

const AVAILABLE_ROLES: { id: UserRole; label: string; department: string }[] = [
  { id: "super_admin", label: "Super Admin", department: "Executive Directorate" },
  { id: "csr_manager", label: "CSR Manager", department: "CSR Outreach & Operations" },
  { id: "hr", label: "HR Executive", department: "Talent Acquisition" },
  { id: "placement_officer", label: "Placement Officer", department: "Institutional TPO" },
  { id: "faculty", label: "Faculty Coordinator", department: "Academic Coordination" },
  { id: "principal", label: "Principal", department: "Institutional Leadership" },
  { id: "admission_team", label: "Admission Team", department: "Enrollment & Counseling" },
  { id: "management", label: "Management", department: "Board & Analytics" },
  { id: "student", label: "Student", department: "Candidate Pool" },
  { id: "operations", label: "Operations", department: "Logistics & Drive Center" },
  { id: "support", label: "Support", department: "Helpdesk & User Services" },
];

export function UserManagementView() {
  const { users, colleges, drives } = useApp();

  const [userList, setUserList] = useState<UserAccount[]>(users);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Selection state for Bulk Operations
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkActionType, setBulkActionType] = useState<"excel" | "role" | "colleges" | "activate" | "deactivate" | "password">("excel");

  // Form states for Create User
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+91 ");
  const [role, setRole] = useState<UserRole>("hr");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [selectedCollegeId, setSelectedCollegeId] = useState("");
  const [selectedDriveId, setSelectedDriveId] = useState("");
  const [password, setPassword] = useState("GqtCsr@2026");
  const [sendInvite, setSendInvite] = useState(true);
  const [userStatus, setUserStatus] = useState<"active" | "inactive">("active");

  // Form state for Edit User
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editRole, setEditRole] = useState<UserRole>("hr");
  const [editDepartment, setEditDepartment] = useState("");
  const [editEmployeeId, setEditEmployeeId] = useState("");
  const [editStatus, setEditStatus] = useState<"active" | "inactive">("active");

  // Form state for Governance Assignment Modal
  const [assignRole, setAssignRole] = useState<UserRole>("hr");
  const [assignCollegeIds, setAssignCollegeIds] = useState<string[]>([]);
  const [assignDriveIds, setAssignDriveIds] = useState<string[]>([]);
  const [assignDistricts, setAssignDistricts] = useState<string[]>([]);

  // Bulk Import state
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importProgress, setImportProgress] = useState<number>(0);
  const [isImporting, setIsImporting] = useState(false);
  const [importReport, setImportReport] = useState<{ total: number; valid: number; errors: string[] } | null>(null);
  const [bulkSelectedRole, setBulkSelectedRole] = useState<UserRole>("student");
  const [bulkSelectedCollege, setBulkSelectedCollege] = useState<string>("");

  const generateTempPassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
    let temp = "Gqt@";
    for (let i = 0; i < 6; i++) {
      temp += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(temp);
    toast.info("Generated Temporary Password: " + temp);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) {
      toast.error("Full Name and Email are required");
      return;
    }

    const collegeObj = colleges.find((c) => c.id === selectedCollegeId);

    const newUser: UserAccount = {
      id: "usr-" + Date.now(),
      name: fullName,
      email,
      phone,
      role,
      avatar: "",
      department: department || "",
      employeeId: employeeId || "",
      collegeId: selectedCollegeId || undefined,
      collegeName: collegeObj?.name,
      assignedColleges: selectedCollegeId ? [selectedCollegeId] : [],
      assignedDrives: selectedDriveId ? [selectedDriveId] : [],
      status: userStatus,
      lastLogin: new Date().toISOString(),
      twoFactorEnabled: false,
    };

    setUserList([newUser, ...userList]);
    setIsCreateModalOpen(false);
    toast.success(`User ${fullName} provisioned successfully in Supabase Auth & Profiles`, {
      description: sendInvite ? `Invitation credentials sent to ${email}` : undefined,
    });

    // Reset Form
    setFullName("");
    setEmail("");
    setPhone("+91 ");
    setDepartment("");
    setDesignation("");
    setEmployeeId("");
  };

  const openEditModal = (u: UserAccount) => {
    setSelectedUser(u);
    setEditName(u.name);
    setEditEmail(u.email);
    setEditPhone(u.phone || "");
    setEditRole(u.role);
    setEditDepartment(u.department || "");
    setEditEmployeeId(u.employeeId || `GQT-${u.role.substring(0, 3).toUpperCase()}-101`);
    setEditStatus(u.status);
    setIsEditModalOpen(true);
  };

  const handleSaveEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    setUserList((prev) =>
      prev.map((item) =>
        item.id === selectedUser.id
          ? {
              ...item,
              name: editName,
              email: editEmail,
              phone: editPhone,
              role: editRole,
              department: editDepartment,
              employeeId: editEmployeeId,
              status: editStatus,
            }
          : item
      )
    );
    setIsEditModalOpen(false);
    toast.success(`Profile for ${editName} updated successfully`);
  };

  const openAssignModal = (u: UserAccount) => {
    setSelectedUser(u);
    setAssignRole(u.role);
    setAssignCollegeIds(u.assignedColleges || (u.collegeId ? [u.collegeId] : []));
    setAssignDriveIds(u.assignedDrives || []);
    setAssignDistricts(u.assignedDistricts || []);
    setIsAssignModalOpen(true);
  };

  const handleSaveAssignments = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    const collegeObj = colleges.find((c) => assignCollegeIds.includes(c.id));

    setUserList((prev) =>
      prev.map((item) =>
        item.id === selectedUser.id
          ? {
              ...item,
              role: assignRole,
              assignedColleges: assignCollegeIds,
              assignedDrives: assignDriveIds,
              assignedDistricts: assignDistricts,
              collegeName: collegeObj?.name || item.collegeName,
            }
          : item
      )
    );
    setIsAssignModalOpen(false);
    toast.success(`Access governance assigned for ${selectedUser.name}`);
  };

  const handleToggleStatus = (u: UserAccount) => {
    const nextStatus = u.status === "active" ? "inactive" : "active";
    setUserList((prev) =>
      prev.map((item) => (item.id === u.id ? { ...item, status: nextStatus } : item))
    );
    toast.success(`User ${u.name} is now ${nextStatus.toUpperCase()}`);
  };

  const handleResetPassword = (u: UserAccount) => {
    toast.success(`Password reset link dispatched via SMTP to ${u.email}`, {
      description: "Temporary secure token valid for 24 hours.",
    });
  };

  const handleDeleteUser = () => {
    if (!selectedUser) return;
    setUserList((prev) => prev.filter((item) => item.id !== selectedUser.id));
    setIsDeleteModalOpen(false);
    toast.success(`User ${selectedUser.name} deleted (Soft-delete logged in Audit Trail)`);
    setSelectedUser(null);
  };

  // Bulk selection toggles
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUserIds(filteredUsers.map((u) => u.id));
    } else {
      setSelectedUserIds([]);
    }
  };

  const handleToggleUserSelect = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  // Bulk Actions
  const handleBulkActivate = () => {
    setUserList((prev) =>
      prev.map((u) => (selectedUserIds.includes(u.id) ? { ...u, status: "active" } : u))
    );
    toast.success(`Bulk activated ${selectedUserIds.length} user accounts`);
    setSelectedUserIds([]);
    setIsBulkModalOpen(false);
  };

  const handleBulkDeactivate = () => {
    setUserList((prev) =>
      prev.map((u) => (selectedUserIds.includes(u.id) ? { ...u, status: "inactive" } : u))
    );
    toast.warning(`Bulk deactivated ${selectedUserIds.length} user accounts`);
    setSelectedUserIds([]);
    setIsBulkModalOpen(false);
  };

  const handleBulkResetPassword = () => {
    toast.success(`Dispatched temporary password reset triggers for ${selectedUserIds.length} users`);
    setSelectedUserIds([]);
    setIsBulkModalOpen(false);
  };

  const handleBulkAssignRole = () => {
    setUserList((prev) =>
      prev.map((u) => (selectedUserIds.includes(u.id) ? { ...u, role: bulkSelectedRole } : u))
    );
    toast.success(`Assigned role "${bulkSelectedRole}" to ${selectedUserIds.length} users`);
    setSelectedUserIds([]);
    setIsBulkModalOpen(false);
  };

  const handleBulkAssignCollege = () => {
    const colObj = colleges.find((c) => c.id === bulkSelectedCollege);
    setUserList((prev) =>
      prev.map((u) =>
        selectedUserIds.includes(u.id)
          ? {
              ...u,
              collegeId: bulkSelectedCollege,
              collegeName: colObj?.name,
              assignedColleges: [bulkSelectedCollege],
            }
          : u
      )
    );
    toast.success(`Assigned college "${colObj?.name || bulkSelectedCollege}" to ${selectedUserIds.length} users`);
    setSelectedUserIds([]);
    setIsBulkModalOpen(false);
  };

  const handleRunExcelImport = () => {
    if (!importFile) {
      toast.error("Please upload an Excel (.xlsx) or CSV file first.");
      return;
    }
    setIsImporting(true);
    setImportProgress(10);

    const timer = setInterval(() => {
      setImportProgress((old) => {
        if (old >= 95) {
          clearInterval(timer);
          setIsImporting(false);
          setImportReport({
            total: 24,
            valid: 22,
            errors: [
              "Row 7: 'harish.patil@' missing valid domain.",
              "Row 19: Duplicate entry found for mobile +91 9845011223.",
            ],
          });
          toast.success("Excel import processed: 22 users staged for creation!");
          return 100;
        }
        return old + 25;
      });
    }, 300);
  };

  const downloadSampleTemplate = () => {
    const csvContent =
      "data:text/csv;charset=utf-8,FullName,Email,Phone,Role,Department,CollegeCode,EmployeeID\n" +
      "Rahul Sharma,rahul.sharma@example.com,+91 9876543210,student,Computer Science,BMSCE,STU-1029\n" +
      "Dr. Ramesh K,dr.ramesh@bmsce.edu,+91 9448123456,principal,Administration,BMSCE,PRIN-001\n" +
      "Kavita Rao,kavita.rao@rvce.edu,+91 9900112233,placement_officer,Training & Placement,RVCE,TPO-042\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "GQT_Bulk_User_Import_Template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.info("Sample CSV template downloaded");
  };

  const filteredUsers = userList.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.department && u.department.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.employeeId && u.employeeId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    const matchesStatus = statusFilter === "all" || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const allSelected = filteredUsers.length > 0 && filteredUsers.every((u) => selectedUserIds.includes(u.id));

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-[#005BBB] dark:text-[#14B8FF] text-[10px] font-extrabold uppercase tracking-wider mb-1">
            Access Governance & Directory OS
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-[#005BBB] dark:text-[#14B8FF]" />
            <span>Master User Management</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage, provision, bulk-import, and assign institutional governance across all 11 enterprise platform roles.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setBulkActionType("excel");
              setIsBulkModalOpen(true);
            }}
            leftIcon={<Upload className="w-4 h-4 text-emerald-600" />}
          >
            Bulk Operations / Excel
          </Button>
          <Link href="/admin/roles">
            <Button variant="outline" size="sm" leftIcon={<Shield className="w-4 h-4" />}>
              Role Matrix
            </Button>
          </Link>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            leftIcon={<UserPlus className="w-4 h-4" />}
          >
            Create Enterprise User
          </Button>
        </div>
      </div>

      {/* Floating Bulk Action Bar if items selected */}
      {selectedUserIds.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-900 to-[#005BBB] text-white shadow-xl flex flex-wrap items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
              {selectedUserIds.length}
            </span>
            <span className="text-xs font-bold">
              {selectedUserIds.length} user{selectedUserIds.length > 1 ? "s" : ""} selected for bulk action
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setBulkActionType("role");
                setIsBulkModalOpen(true);
              }}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold backdrop-blur transition-all flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5" /> Assign Role
            </button>
            <button
              onClick={() => {
                setBulkActionType("colleges");
                setIsBulkModalOpen(true);
              }}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold backdrop-blur transition-all flex items-center gap-1.5"
            >
              <Building2 className="w-3.5 h-3.5" /> Assign College
            </button>
            <button
              onClick={handleBulkActivate}
              className="px-3 py-1.5 rounded-lg bg-emerald-500/80 hover:bg-emerald-500 text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <CheckCircle className="w-3.5 h-3.5" /> Activate
            </button>
            <button
              onClick={handleBulkDeactivate}
              className="px-3 py-1.5 rounded-lg bg-amber-500/80 hover:bg-amber-500 text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <XCircle className="w-3.5 h-3.5" /> Deactivate
            </button>
            <button
              onClick={handleBulkResetPassword}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <KeyRound className="w-3.5 h-3.5" /> Reset Passwords
            </button>
            <button
              onClick={() => setSelectedUserIds([])}
              className="px-2.5 py-1.5 rounded-lg text-xs text-white/70 hover:text-white"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Main Table Card */}
      <Card>
        {/* Filters and Search Toolbar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, employee ID, role..."
              className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
            >
              <option value="all">All Roles ({AVAILABLE_ROLES.length})</option>
              {AVAILABLE_ROLES.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3.5 w-10 text-center">
                    <button
                      type="button"
                      onClick={() => handleSelectAll(!allSelected)}
                      className="text-slate-400 hover:text-[#005BBB] transition-colors"
                      title={allSelected ? "Deselect all" : "Select all"}
                    >
                      {allSelected ? (
                        <CheckSquare className="w-4 h-4 text-[#005BBB]" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="p-3.5">User Profile & ID</th>
                  <th className="p-3.5">Platform Role</th>
                  <th className="p-3.5">Department / College</th>
                  <th className="p-3.5">Contact</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Last Login</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filteredUsers.map((u) => {
                  const isSelected = selectedUserIds.includes(u.id);
                  const roleMeta = AVAILABLE_ROLES.find((r) => r.id === u.role);

                  return (
                    <tr
                      key={`${u.id}-${u.role}`}
                      className={`hover:bg-slate-50/70 dark:hover:bg-slate-900/40 transition-colors ${
                        isSelected ? "bg-blue-50/40 dark:bg-blue-950/20" : ""
                      }`}
                    >
                      <td className="p-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleUserSelect(u.id)}
                          className="w-4 h-4 rounded border-slate-300 text-[#005BBB] focus:ring-[#005BBB]"
                        />
                      </td>

                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar name={u.name} src={u.avatar} size="sm" />
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                              <Link
                                href={`/admin/users/${u.id}`}
                                className="hover:text-[#005BBB] dark:hover:text-[#14B8FF] transition-colors"
                              >
                                {u.name}
                              </Link>
                              {u.role === "super_admin" && (
                                <ShieldCheck className="w-3.5 h-3.5 text-[#005BBB] dark:text-[#14B8FF]" />
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[11px] text-slate-500 font-mono">{u.email}</span>
                              {u.employeeId ? (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                                  {u.employeeId}
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-100 dark:bg-blue-950 text-[#005BBB] dark:text-[#14B8FF]">
                          {roleMeta?.label || u.role.replace("_", " ")}
                        </span>
                      </td>

                      <td className="p-3.5 font-medium text-slate-700 dark:text-slate-300">
                        <div>{u.department || "—"}</div>
                        {u.collegeName && (
                          <div className="text-[10px] text-slate-400 truncate max-w-[150px] flex items-center gap-1 mt-0.5">
                            <Building2 className="w-3 h-3 text-slate-400 flex-shrink-0" />
                            <span>{u.collegeName}</span>
                          </div>
                        )}
                      </td>

                      <td className="p-3.5 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                        {u.phone || "—"}
                      </td>

                      <td className="p-3.5">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(u)}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-all ${
                            u.status === "active"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                              : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                          }`}
                          title="Click to toggle status"
                        >
                          {u.status === "active" ? (
                            <>
                              <CheckCircle className="w-3 h-3 text-emerald-500" />
                              <span>Active</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 text-slate-400" />
                              <span>Inactive</span>
                            </>
                          )}
                        </button>
                      </td>

                      <td className="p-3.5 font-mono text-[11px] text-slate-400" suppressHydrationWarning>
                        {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }) : "—"}
                      </td>

                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/admin/users/${u.id}`}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-[#005BBB] hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Full Profile Inspection"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => openEditModal(u)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Edit User"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => openAssignModal(u)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/40"
                            title="Assign Role, Colleges, Drives & Districts"
                          >
                            <Layers className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleResetPassword(u)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Reset Password"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedUser(u);
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                            title="Soft Delete User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* CREATE USER MODAL */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Provision New Enterprise User"
        description="Creates an authenticated Supabase user profile with role-based routing authorization."
        size="lg"
      >
        <form onSubmit={handleCreateUser} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name *"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Priya Nair"
            />
            <Input
              label="Official Email *"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. priya.nair@globalquesttechnologies.com"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Mobile Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98450 00000"
            />
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Authority Role *
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
              >
                {AVAILABLE_ROLES.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label} ({r.department})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g. Talent Acquisition"
            />
            <Input
              label="Designation"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              placeholder="e.g. Senior Recruiter"
            />
            <Input
              label="Employee ID"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              placeholder="e.g. GQT-HR-048"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Assign Partner College (Optional)
              </label>
              <select
                value={selectedCollegeId}
                onChange={(e) => setSelectedCollegeId(e.target.value)}
                className="w-full text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-2.5 px-3"
              >
                <option value="">None / Corporate Level</option>
                {colleges.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.district})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Assign Active CSR Drive (Optional)
              </label>
              <select
                value={selectedDriveId}
                onChange={(e) => setSelectedDriveId(e.target.value)}
                className="w-full text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-2.5 px-3"
              >
                <option value="">None / All Assigned Drives</option>
                {drives.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.batch})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Password & Security */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Initial Security Password
              </label>
              <button
                type="button"
                onClick={generateTempPassword}
                className="text-[11px] font-bold text-[#005BBB] dark:text-[#14B8FF] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Generate Temp Password
              </button>
            </div>
            <Input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>

          {/* Toggles */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={sendInvite}
                onChange={(e) => setSendInvite(e.target.checked)}
                className="w-4 h-4 rounded text-[#005BBB]"
              />
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Send welcome invitation email with login credentials
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={userStatus === "active"}
                onChange={(e) => setUserStatus(e.target.checked ? "active" : "inactive")}
                className="w-4 h-4 rounded text-[#005BBB]"
              />
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Activate immediately
              </span>
            </label>
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Provision User Account
            </Button>
          </div>
        </form>
      </Modal>

      {/* EDIT USER MODAL */}
      {selectedUser && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={`Edit User: ${selectedUser.name}`}
          description="Update credentials, role metadata, and department designation."
          size="md"
        >
          <form onSubmit={handleSaveEditUser} className="space-y-4 pt-2">
            <Input
              label="Full Name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              required
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Email Address"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                required
              />
              <Input
                label="Mobile Phone"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Platform Role
                </label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as UserRole)}
                  className="w-full text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-2.5 px-3"
                >
                  {AVAILABLE_ROLES.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
              <Input
                label="Employee ID"
                value={editEmployeeId}
                onChange={(e) => setEditEmployeeId(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Department"
                value={editDepartment}
                onChange={(e) => setEditDepartment(e.target.value)}
              />
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Account Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as "active" | "inactive")}
                  className="w-full text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-2.5 px-3"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive / Suspended</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button variant="outline" size="sm" type="button" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Save Profile Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* ASSIGN GOVERNANCE MODAL (Role, Colleges, Districts, Drives) */}
      {selectedUser && (
        <Modal
          isOpen={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          title={`Assign Access Governance: ${selectedUser.name}`}
          description="Grant institutional permissions, partner colleges, geographic districts, and recruitment drives."
          size="lg"
        >
          <form onSubmit={handleSaveAssignments} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Assigned Platform Role
              </label>
              <select
                value={assignRole}
                onChange={(e) => setAssignRole(e.target.value as UserRole)}
                className="w-full text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-2.5 px-3"
              >
                {AVAILABLE_ROLES.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label} — {r.department}
                  </option>
                ))}
              </select>
            </div>

            {/* Colleges Multi-Select List */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Assigned Colleges ({assignCollegeIds.length} selected)
              </label>
              <div className="max-h-40 overflow-y-auto p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-1.5 text-xs">
                {colleges.map((c) => {
                  const isChecked = assignCollegeIds.includes(c.id);
                  return (
                    <label
                      key={c.id}
                      className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() =>
                          setAssignCollegeIds((prev) =>
                            isChecked ? prev.filter((id) => id !== c.id) : [...prev, c.id]
                          )
                        }
                        className="rounded text-[#005BBB]"
                      />
                      <span className="font-bold text-slate-800 dark:text-slate-200">{c.name}</span>
                      <span className="text-[10px] text-slate-400">({c.district})</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* CSR Drives Multi-Select */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Assigned CSR Drives ({assignDriveIds.length} selected)
              </label>
              <div className="max-h-32 overflow-y-auto p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-1.5 text-xs">
                {drives.map((d) => {
                  const isChecked = assignDriveIds.includes(d.id);
                  return (
                    <label
                      key={d.id}
                      className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() =>
                          setAssignDriveIds((prev) =>
                            isChecked ? prev.filter((id) => id !== d.id) : [...prev, d.id]
                          )
                        }
                        className="rounded text-[#005BBB]"
                      />
                      <span className="font-bold text-slate-800 dark:text-slate-200">{d.name}</span>
                      <span className="text-[10px] text-slate-400">({d.batch})</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button variant="outline" size="sm" type="button" onClick={() => setIsAssignModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Apply Governance Assignments
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* BULK OPERATIONS MODAL */}
      <Modal
        isOpen={isBulkModalOpen}
        onClose={() => {
          setIsBulkModalOpen(false);
          setImportReport(null);
          setImportFile(null);
        }}
        title="Enterprise Bulk User Operations"
        description="Execute mass creation via Excel, bulk role reassignment, batch college allocation, or bulk activations."
        size="lg"
      >
        <div className="space-y-4 pt-2">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
            {[
              { id: "excel", label: "Excel / CSV Import", icon: FileSpreadsheet },
              { id: "role", label: "Bulk Assign Role", icon: Shield },
              { id: "colleges", label: "Bulk Assign College", icon: Building2 },
              { id: "password", label: "Bulk Reset Password", icon: KeyRound },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setBulkActionType(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    bulkActionType === tab.id
                      ? "bg-[#005BBB] text-white shadow-sm"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* TAB 1: EXCEL / CSV IMPORT */}
          {bulkActionType === "excel" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-center hover:border-[#005BBB] transition-colors bg-slate-50/50 dark:bg-slate-900/40">
                <FileSpreadsheet className="w-10 h-10 text-[#005BBB] mx-auto mb-2" />
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Select Excel or CSV Spreadsheet
                </h4>
                <p className="text-[11px] text-slate-500 mb-3">
                  Supported columns: FullName, Email, Phone, Role, Department, CollegeCode, EmployeeID
                </p>
                <input
                  type="file"
                  id="excelFileInput"
                  accept=".csv,.xlsx,.xls"
                  onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
                <div className="flex justify-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => document.getElementById("excelFileInput")?.click()}
                  >
                    {importFile ? importFile.name : "Choose Spreadsheet"}
                  </Button>
                  <Button size="sm" variant="secondary" onClick={downloadSampleTemplate} leftIcon={<Download className="w-3.5 h-3.5" />}>
                    Download Sample Template
                  </Button>
                </div>
              </div>

              {/* Progress bar if importing */}
              {isImporting && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                    <span>Processing spreadsheet records...</span>
                    <span>{importProgress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-[#14B8FF] transition-all duration-300"
                      style={{ width: `${importProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Error and Success Report */}
              {importReport && (
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
                  <div className="flex items-center gap-2 text-emerald-600 font-bold">
                    <CheckCircle className="w-4 h-4" />
                    <span>
                      {importReport.valid} of {importReport.total} records validated successfully
                    </span>
                  </div>
                  {importReport.errors.length > 0 && (
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                      <span className="font-bold text-amber-600 flex items-center gap-1 mb-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> Validation Exceptions ({importReport.errors.length}):
                      </span>
                      <ul className="list-disc pl-4 space-y-1 text-slate-500 font-mono text-[10px]">
                        {importReport.errors.map((err, i) => (
                          <li key={i}>{err}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => setIsBulkModalOpen(false)}>
                  Close
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  disabled={!importFile || isImporting}
                  onClick={handleRunExcelImport}
                  leftIcon={<Upload className="w-4 h-4" />}
                >
                  {isImporting ? "Processing..." : "Execute Bulk Import"}
                </Button>
              </div>
            </div>
          )}

          {/* TAB 2: BULK ASSIGN ROLE */}
          {bulkActionType === "role" && (
            <div className="space-y-4 text-xs">
              <p className="text-slate-600 dark:text-slate-300">
                Reassign the authority role for <strong>{selectedUserIds.length}</strong> selected users:
              </p>
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                  Target Authority Role
                </label>
                <select
                  value={bulkSelectedRole}
                  onChange={(e) => setBulkSelectedRole(e.target.value as UserRole)}
                  className="w-full text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-2.5 px-3"
                >
                  {AVAILABLE_ROLES.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label} ({r.department})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => setIsBulkModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  disabled={selectedUserIds.length === 0}
                  onClick={handleBulkAssignRole}
                >
                  Apply Role Reassignment
                </Button>
              </div>
            </div>
          )}

          {/* TAB 3: BULK ASSIGN COLLEGE */}
          {bulkActionType === "colleges" && (
            <div className="space-y-4 text-xs">
              <p className="text-slate-600 dark:text-slate-300">
                Bulk allocate <strong>{selectedUserIds.length}</strong> selected users to a partner college:
              </p>
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                  Select Partner College
                </label>
                <select
                  value={bulkSelectedCollege}
                  onChange={(e) => setBulkSelectedCollege(e.target.value)}
                  className="w-full text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-2.5 px-3"
                >
                  <option value="">Select College...</option>
                  {colleges.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.district})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => setIsBulkModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  disabled={selectedUserIds.length === 0 || !bulkSelectedCollege}
                  onClick={handleBulkAssignCollege}
                >
                  Apply Bulk Allocation
                </Button>
              </div>
            </div>
          )}

          {/* TAB 4: BULK RESET PASSWORD */}
          {bulkActionType === "password" && (
            <div className="space-y-4 text-xs">
              <p className="text-slate-600 dark:text-slate-300">
                Send password reset links to all <strong>{selectedUserIds.length}</strong> selected users. Each user
                will receive an email with a 24-hour verification token.
              </p>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => setIsBulkModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  disabled={selectedUserIds.length === 0}
                  onClick={handleBulkResetPassword}
                  leftIcon={<KeyRound className="w-3.5 h-3.5" />}
                >
                  Dispatch Mass Reset Emails
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      {selectedUser && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Confirm Soft-Delete User"
          description={`Are you sure you want to deactivate and soft-delete ${selectedUser.name}? This will revoke login access across all portals.`}
          size="sm"
        >
          <div className="flex justify-end gap-2.5 pt-4">
            <Button variant="outline" size="sm" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleDeleteUser}>
              Confirm Delete
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
