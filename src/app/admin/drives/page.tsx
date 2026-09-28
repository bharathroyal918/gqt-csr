"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Modal } from "@/components/common/Modal";
import { toast } from "sonner";
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Archive,
  Copy,
  Trash2,
  Calendar,
  Building2,
  Users,
  CheckCircle2,
  Clock,
  Download,
  AlertCircle
} from "lucide-react";
import { CSRDrive } from "@/types";

export default function AdminDrivesPage() {
  const { drives, addDrive, updateDrive } = useApp();
  const [driveList, setDriveList] = useState<CSRDrive[]>(drives);

  React.useEffect(() => {
    setDriveList(drives);
  }, [drives]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");

  // Modals state
  const [viewingDrive, setViewingDrive] = useState<CSRDrive | null>(null);
  const [editingDrive, setEditingDrive] = useState<CSRDrive | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteConfirmDrive, setDeleteConfirmDrive] = useState<CSRDrive | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    academicYear: "2024-2025",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
    targetCollegesCount: 15,
    status: "Upcoming",
  });

  const allDrives = drives.length > 0 ? drives : driveList;

  const filteredDrives = allDrives.filter((d) => {
    const dName = d.name || (d as any).title || "";
    const matchesSearch =
      dName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || d.status.toLowerCase().includes(statusFilter.toLowerCase());
    const matchesYear = yearFilter === "all" || (d.academicYear && d.academicYear === yearFilter);
    return matchesSearch && matchesStatus && matchesYear;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      toast.error("Drive title is required");
      return;
    }
    const newDrive: CSRDrive = {
      id: `drv-${Date.now().toString().slice(-4)}`,
      driveCode: `GQT-DRV-${Date.now().toString().slice(-4)}`,
      name: formData.title,
      academicYear: formData.academicYear,
      category: "CSR Flagship",
      mode: "Offline Campus",
      status: (formData.status as any) || "Draft",
      description: "Statewide Karnataka CSR Campus Drive",
      location: "Bengaluru, Karnataka",
      venue: "Main Campus Auditorium",
      district: "Bengaluru Urban",
      state: "Karnataka",
      courses: ["Full Stack Java", "Python AI"],
      batch: "2025",
      eligibleDepartments: ["CSE", "ISE", "ECE"],
      graduationTypes: ["BE", "B.Tech"],
      semesterEligibility: [7, 8],
      backlogAllowed: true,
      maxBacklogs: 2,
      minPercentage: 60,
      minCgpa: 6.5,
      schedule: {
        regStart: formData.startDate,
        regEnd: formData.endDate,
        examDate: formData.endDate,
        examTime: "10:00 AM",
        interviewDate: formData.endDate,
        offerDate: formData.endDate,
        joiningDate: "2025-07-15",
      },
      assignments: {
        hrLeadId: "usr-hr-01",
        hrLeadName: "Hitha, Kusuma",
        panelMembers: ["Hitha, Kusuma", "Divya.H"],
        trainer: "Tech Training Team",
        placementManager: "Kiran",
        questionBankId: "QB-J01",
        offerLetterTemplateId: "tpl-em-03",
      },
      automation: {
        registrationLink: `https://csr.gqt.in/register/drv-${Date.now()}`,
        qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=GQT",
        whatsappGroupEnabled: true,
        reminderEnabled: true,
        autoInterviewScheduling: true,
        autoOfferLetter: false,
      },
      metrics: {
        collegesCount: formData.targetCollegesCount,
        registeredStudents: 0,
        examAttended: 0,
        qualifiedStudents: 0,
        interviewSelected: 0,
        offerLettersSent: 0,
        acceptedOffers: 0,
      },
    };
    addDrive(newDrive);
    setDriveList([newDrive, ...driveList]);
    setIsCreateOpen(false);
    setFormData({
      title: "",
      academicYear: "2024-2025",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
      targetCollegesCount: 15,
      status: "Upcoming",
    });
    toast.success("CSR Drive initialized successfully in Supabase");
  };

  const handleClone = (drive: CSRDrive) => {
    const cloned: CSRDrive = {
      ...drive,
      id: `drv-${Date.now().toString().slice(-4)}`,
      name: `${drive.name} (Clone)`,
      status: "Draft",
      metrics: {
        ...drive.metrics,
        registeredStudents: 0,
        examAttended: 0,
        qualifiedStudents: 0,
        interviewSelected: 0,
        offerLettersSent: 0,
        acceptedOffers: 0,
      },
    };
    addDrive(cloned);
    setDriveList([cloned, ...driveList]);
    toast.success(`Drive cloned as "${cloned.name}"`);
  };

  const handleArchive = (drive: CSRDrive) => {
    updateDrive(drive.id, { status: "Completed" });
    toast.info(`Drive "${drive.name}" archived`);
  };

  const handleDelete = () => {
    if (deleteConfirmDrive) {
      setDriveList((prev) => prev.filter((d) => d.id !== deleteConfirmDrive.id));
      toast.success(`Drive "${deleteConfirmDrive.name}" removed from view`);
      setDeleteConfirmDrive(null);
    }
  };

  // KPIs
  const totalDrives = allDrives.length;
  const activeDrives = allDrives.filter((d) => d.status.toLowerCase().includes("in progress") || d.status.toLowerCase().includes("open") || d.status.toLowerCase().includes("active")).length;
  const upcomingDrives = allDrives.filter((d) => d.status.toLowerCase().includes("upcoming") || d.status.toLowerCase().includes("draft") || d.status.toLowerCase().includes("scheduled")).length;
  const completedDrives = allDrives.filter((d) => d.status.toLowerCase().includes("completed")).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900/40 via-blue-950/30 to-indigo-900/40 border border-blue-500/20 backdrop-blur-xl p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5" />
              Corporate CSR Campaigns
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            CSR Drive Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Orchestrate statewide campus hiring campaigns, track institutional participation, and monitor multi-phase recruitment funnels.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-blue-500/25 gap-2"
          >
            <Plus className="w-4 h-4" />
            Create CSR Drive
          </Button>
        </div>
      </div>

      {/* Top Stat Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border border-border/60 bg-card/60 backdrop-blur-md rounded-2xl">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground font-medium">Total CSR Drives</p>
            <p className="text-2xl font-bold text-foreground mt-1">{totalDrives}</p>
          </CardContent>
        </Card>
        <Card className="border border-border/60 bg-card/60 backdrop-blur-md rounded-2xl">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground font-medium">Active Drives</p>
            <p className="text-2xl font-bold text-emerald-500 mt-1">{activeDrives}</p>
          </CardContent>
        </Card>
        <Card className="border border-border/60 bg-card/60 backdrop-blur-md rounded-2xl">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground font-medium">Upcoming / Draft</p>
            <p className="text-2xl font-bold text-blue-400 mt-1">{upcomingDrives}</p>
          </CardContent>
        </Card>
        <Card className="border border-border/60 bg-card/60 backdrop-blur-md rounded-2xl">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground font-medium">Completed</p>
            <p className="text-2xl font-bold text-purple-400 mt-1">{completedDrives}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-card/60 backdrop-blur-md p-4 rounded-2xl border border-border/60">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search drives by name or ID..."
            className="pl-10 h-10 bg-background/80"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 text-xs rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="in progress">In Progress / Active</option>
            <option value="upcoming">Upcoming</option>
            <option value="draft">Draft</option>
            <option value="completed">Completed</option>
          </select>
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="h-10 px-3 text-xs rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary outline-none"
          >
            <option value="all">All Academic Years</option>
            <option value="2024-2025">2024-2025</option>
            <option value="2023-2024">2023-2024</option>
          </select>
        </div>
      </div>

      {/* Table Card */}
      <Card className="border border-border/60 bg-card/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 border-b border-border/50 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              <tr>
                <th className="p-4 pl-6">Drive ID & Name</th>
                <th className="p-4">Academic Year</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Colleges</th>
                <th className="p-4 text-center">Registered</th>
                <th className="p-4 text-center">Qualified</th>
                <th className="p-4 text-center">Selected</th>
                <th className="p-4">Schedule</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-medium">
              {filteredDrives.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-muted-foreground">
                    No CSR drives found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredDrives.map((d) => (
                  <tr key={d.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="font-bold text-foreground flex items-center gap-2">
                        {d.name || (d as any).title}
                      </div>
                      <span className="text-xs text-muted-foreground font-mono">{d.driveCode || d.id}</span>
                    </td>
                    <td className="p-4 text-xs font-mono">{d.academicYear || "—"}</td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-semibold border ${
                          d.status.toLowerCase().includes("progress") || d.status.toLowerCase().includes("open")
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : d.status.toLowerCase().includes("upcoming")
                            ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                            : d.status.toLowerCase().includes("completed")
                            ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                            : "bg-muted text-muted-foreground border-border"
                        }`}
                      >
                        {d.status}
                      </span>
                    </td>
                    <td className="p-4 text-center font-semibold text-foreground">
                      {d.metrics?.collegesCount || 10}
                    </td>
                    <td className="p-4 text-center font-semibold text-blue-400">
                      {d.metrics?.registeredStudents || 0}
                    </td>
                    <td className="p-4 text-center font-semibold text-indigo-400">
                      {d.metrics?.qualifiedStudents || 0}
                    </td>
                    <td className="p-4 text-center font-semibold text-emerald-400">
                      {d.metrics?.interviewSelected || 0}
                    </td>
                    <td className="p-4 text-xs text-muted-foreground">
                      <div>{d.schedule?.regStart ? new Date(d.schedule.regStart).toLocaleDateString() : "Active"}</div>
                      <div className="text-[10px]">to {d.schedule?.regEnd ? new Date(d.schedule.regEnd).toLocaleDateString() : "Ongoing"}</div>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setViewingDrive(d)}
                          title="View Details"
                          className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleClone(d)}
                          title="Clone Drive"
                          className="h-8 w-8 p-0 hover:bg-emerald-500/10 hover:text-emerald-400"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleArchive(d)}
                          title="Archive Drive"
                          className="h-8 w-8 p-0 hover:bg-purple-500/10 hover:text-purple-400"
                        >
                          <Archive className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeleteConfirmDrive(d)}
                          title="Delete Drive"
                          className="h-8 w-8 p-0 hover:bg-rose-500/10 hover:text-rose-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create Drive Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Initialize New CSR Campus Drive"
      >
        <form onSubmit={handleCreate} className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-semibold text-foreground">Drive Title *</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Karnataka State CSR Drive 2025 Phase-1"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-foreground">Academic Year</label>
              <select
                value={formData.academicYear}
                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                className="w-full h-10 px-3 text-xs rounded-xl border border-border bg-background text-foreground"
              >
                <option value="2024-2025">2024-2025</option>
                <option value="2025-2026">2025-2026</option>
                <option value="2023-2024">2023-2024</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground">Initial Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full h-10 px-3 text-xs rounded-xl border border-border bg-background text-foreground"
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Registration Open">Registration Open</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-foreground">Start Date</label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground">End Date</label>
              <Input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-foreground">Target Colleges Quota</label>
            <Input
              type="number"
              value={formData.targetCollegesCount}
              onChange={(e) => setFormData({ ...formData, targetCollegesCount: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div className="flex justify-end gap-3 pt-3">
            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary text-white">
              Launch Campaign
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Drive Modal */}
      {viewingDrive && (
        <Modal
          isOpen={!!viewingDrive}
          onClose={() => setViewingDrive(null)}
          title={`CSR Drive Overview: ${viewingDrive.name}`}
        >
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3 p-3 bg-muted/40 rounded-xl">
              <div>
                <p className="text-xs text-muted-foreground">Drive Code</p>
                <p className="font-mono text-xs font-semibold text-foreground">{viewingDrive.driveCode || viewingDrive.id}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <p className="text-xs font-semibold text-emerald-400">{viewingDrive.status}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Academic Year</p>
                <p className="text-xs font-semibold text-foreground">{viewingDrive.academicYear || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Lead Recruiter</p>
                <p className="text-xs font-semibold text-primary">{viewingDrive.assignments?.hrLeadName || "Unassigned"}</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-3 bg-card border rounded-xl">
                <p className="text-[10px] text-muted-foreground">Colleges</p>
                <p className="text-base font-bold">{viewingDrive.metrics?.collegesCount || 10}</p>
              </div>
              <div className="p-3 bg-card border rounded-xl">
                <p className="text-[10px] text-muted-foreground">Registered</p>
                <p className="text-base font-bold text-blue-400">{viewingDrive.metrics?.registeredStudents || 0}</p>
              </div>
              <div className="p-3 bg-card border rounded-xl">
                <p className="text-[10px] text-muted-foreground">Qualified</p>
                <p className="text-base font-bold text-indigo-400">{viewingDrive.metrics?.qualifiedStudents || 0}</p>
              </div>
              <div className="p-3 bg-card border rounded-xl">
                <p className="text-[10px] text-muted-foreground">Selected</p>
                <p className="text-base font-bold text-emerald-400">{viewingDrive.metrics?.interviewSelected || 0}</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={() => setViewingDrive(null)}>Close</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmDrive && (
        <Modal
          isOpen={!!deleteConfirmDrive}
          onClose={() => setDeleteConfirmDrive(null)}
          title="Confirm Removal"
        >
          <div className="space-y-4 pt-2">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to remove CSR Drive <strong className="text-foreground">{deleteConfirmDrive.name}</strong> ({deleteConfirmDrive.id})?
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setDeleteConfirmDrive(null)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete} className="bg-rose-600 hover:bg-rose-700 text-white">
                Confirm Delete
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
