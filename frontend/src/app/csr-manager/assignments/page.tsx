"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Search,
  Filter,
  Plus,
  Building2,
  PhoneCall,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Briefcase,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  Mail,
  Phone,
  ShieldCheck,
  Award,
  MoreVertical,
  X,
  Edit2,
  UserPlus
} from "lucide-react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

interface HRAssignment {
  id: string;
  name: string;
  empId: string;
  email: string;
  phone: string;
  driveId: string;
  driveName: string;
  primaryColleges: string[];
  backupColleges: string[];
  priority: "Critical" | "High" | "Medium" | "Normal";
  status: "Active" | "On Field" | "In Review";
  startDate: string;
  endDate: string;
  notes: string;
  metrics: {
    assignedColleges: number;
    pendingCalls: number;
    pendingFollowups: number;
    confirmedColleges: number;
    pendingInterviews: number;
    selectionPercentage: number;
    workloadPercentage: number;
  };
}

const INITIAL_ASSIGNMENTS: HRAssignment[] = [
  {
    id: "HRA-001",
    name: "Hitha",
    empId: "GQT-HR-101",
    email: "gqthr5@gmail.com",
    phone: "+91 98450 12891",
    driveId: "DRV-2026-001",
    driveName: "CSR Flagship Campus Drive 2026",
    primaryColleges: ["RV College of Engineering", "BMS College of Engineering", "Ramaiah Institute of Technology"],
    backupColleges: ["PES University"],
    priority: "Critical",
    status: "Active",
    startDate: "2026-09-01",
    endDate: "2026-11-15",
    notes: "Lead coordinator for Bengaluru tier-1 colleges. Focus on CS/IS branches.",
    metrics: {
      assignedColleges: 3,
      pendingCalls: 4,
      pendingFollowups: 2,
      confirmedColleges: 3,
      pendingInterviews: 18,
      selectionPercentage: 24,
      workloadPercentage: 88,
    },
  },
  {
    id: "HRA-002",
    name: "Kusuma",
    empId: "GQT-HR-104",
    email: "gqthr9@gmail.com",
    phone: "+91 97401 55219",
    driveId: "DRV-2026-001",
    driveName: "CSR Flagship Campus Drive 2026",
    primaryColleges: ["Dayananda Sagar College", "Sir M. Visvesvaraya Institute of Technology"],
    backupColleges: ["RV College of Engineering"],
    priority: "High",
    status: "On Field",
    startDate: "2026-09-05",
    endDate: "2026-11-20",
    notes: "On-campus MoUs and placement officer meetings scheduled this week.",
    metrics: {
      assignedColleges: 2,
      pendingCalls: 6,
      pendingFollowups: 5,
      confirmedColleges: 2,
      pendingInterviews: 12,
      selectionPercentage: 19,
      workloadPercentage: 74,
    },
  },
  {
    id: "HRA-003",
    name: "Rohan",
    empId: "GQT-HR-111",
    email: "gqthr9@gmail.com",
    phone: "+91 99160 44812",
    driveId: "DRV-2026-002",
    driveName: "Women in Tech Empowerment Drive",
    primaryColleges: ["National Institute of Engineering (NIE)", "Siddaganga Institute of Technology"],
    backupColleges: ["BMS College of Engineering"],
    priority: "High",
    status: "Active",
    startDate: "2026-09-10",
    endDate: "2026-11-30",
    notes: "Managing Mysore and Tumkur clusters. Coordinating online coding test setup.",
    metrics: {
      assignedColleges: 2,
      pendingCalls: 2,
      pendingFollowups: 3,
      confirmedColleges: 2,
      pendingInterviews: 26,
      selectionPercentage: 28,
      workloadPercentage: 82,
    },
  },
  {
    id: "HRA-004",
    name: "Rohith",
    empId: "GQT-HR-112",
    email: "gqthr5@gmail.com",
    phone: "+91 94812 77034",
    driveId: "DRV-2026-003",
    driveName: "Rural Talent Outreach Drive 2026",
    primaryColleges: ["KLE Technological University", "Bapuji Institute of Engineering"],
    backupColleges: ["Dayananda Sagar College"],
    priority: "Medium",
    status: "Active",
    startDate: "2026-09-12",
    endDate: "2026-12-05",
    notes: "Hubballi & Davanagere zones. Principal level briefing completed.",
    metrics: {
      assignedColleges: 2,
      pendingCalls: 8,
      pendingFollowups: 4,
      confirmedColleges: 1,
      pendingInterviews: 8,
      selectionPercentage: 15,
      workloadPercentage: 62,
    },
  },
];

export default function CSRAssignmentsPage() {
  const { drives, colleges } = useApp();
  const [assignments, setAssignments] = useState<HRAssignment[]>(INITIAL_ASSIGNMENTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Assign Modal
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedHRForDetail, setSelectedHRForDetail] = useState<HRAssignment | null>(null);

  // New Assignment Form State
  const [newHRName, setNewHRName] = useState("");
  const [newEmpId, setNewEmpId] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newDrive, setNewDrive] = useState("CSR Flagship Campus Drive 2026");
  const [newColleges, setNewColleges] = useState<string[]>([]);
  const [newBackupColleges, setNewBackupColleges] = useState<string[]>([]);
  const [newPriority, setNewPriority] = useState<"Critical" | "High" | "Medium" | "Normal">("High");
  const [newStartDate, setNewStartDate] = useState("2026-09-25");
  const [newEndDate, setNewEndDate] = useState("2026-11-30");
  const [newNotes, setNewNotes] = useState("");

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHRName || !newEmpId || newColleges.length === 0) {
      toast.error("Please fill in HR Name, Employee ID and select at least one primary college.");
      return;
    }

    const newAssignment: HRAssignment = {
      id: `HRA-${Date.now().toString().slice(-4)}`,
      name: newHRName,
      empId: newEmpId,
      email: newEmail || `${newHRName.toLowerCase().replace(/\s+/g, ".")}@gqt.co.in`,
      phone: newPhone || "+91 98000 00000",
      driveId: "DRV-2026-NEW",
      driveName: newDrive,
      primaryColleges: newColleges,
      backupColleges: newBackupColleges,
      priority: newPriority,
      status: "Active",
      startDate: newStartDate,
      endDate: newEndDate,
      notes: newNotes || "Assigned for campus drive outreach & evaluation.",
      metrics: {
        assignedColleges: newColleges.length,
        pendingCalls: 5,
        pendingFollowups: 3,
        confirmedColleges: 1,
        pendingInterviews: 10,
        selectionPercentage: 20,
        workloadPercentage: 65,
      },
    };

    setAssignments([newAssignment, ...assignments]);
    setIsAssignModalOpen(false);
    toast.success(`HR Recruiter ${newHRName} assigned to ${newColleges.length} colleges successfully!`);

    // Reset
    setNewHRName("");
    setNewEmpId("");
    setNewEmail("");
    setNewPhone("");
    setNewColleges([]);
    setNewBackupColleges([]);
    setNewNotes("");
  };

  // KPI Calculations
  const totalAssignedColleges = assignments.reduce((acc, h) => acc + h.metrics.assignedColleges, 0);
  const totalPendingCalls = assignments.reduce((acc, h) => acc + h.metrics.pendingCalls, 0);
  const totalPendingFollowups = assignments.reduce((acc, h) => acc + h.metrics.pendingFollowups, 0);
  const totalConfirmedColleges = assignments.reduce((acc, h) => acc + h.metrics.confirmedColleges, 0);
  const totalPendingInterviews = assignments.reduce((acc, h) => acc + h.metrics.pendingInterviews, 0);
  const avgSelection = Math.round(
    assignments.reduce((acc, h) => acc + h.metrics.selectionPercentage, 0) / (assignments.length || 1)
  );
  const avgWorkload = Math.round(
    assignments.reduce((acc, h) => acc + h.metrics.workloadPercentage, 0) / (assignments.length || 1)
  );

  const filteredAssignments = assignments.filter((hr) => {
    const matchesSearch =
      hr.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hr.empId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hr.driveName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hr.primaryColleges.some((c) => c.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesPriority = priorityFilter === "all" || hr.priority.toLowerCase() === priorityFilter.toLowerCase();
    const matchesStatus = statusFilter === "all" || hr.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesPriority && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-gradient-to-r from-[#001B4D] via-[#003366] to-[#005BBB] text-white p-6 rounded-2xl shadow-xl border border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#14B8FF]/20 text-[#14B8FF] border border-[#14B8FF]/30">
              Operations Resource Management
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">HR Assignment & Recruiter Workload</h1>
          <p className="text-white/80 text-sm mt-1 max-w-2xl">
            Distribute campus outreach, placement officer follow-ups, and technical interview panels across certified Global Quest HR executives.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="cyan"
            className="flex items-center gap-2 shadow-lg hover:shadow-[#14B8FF]/30"
            onClick={() => setIsAssignModalOpen(true)}
          >
            <UserPlus className="w-4 h-4" />
            Assign HR to Drive
          </Button>
        </div>
      </div>

      {/* Workload Dashboard KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <Card className="p-3.5 bg-white border border-slate-200 shadow-sm rounded-xl">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Assigned Colleges</span>
            <Building2 className="w-4 h-4 text-[#005BBB]" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{totalAssignedColleges}</p>
          <span className="text-[10px] text-emerald-600 font-medium">Across active drives</span>
        </Card>

        <Card className="p-3.5 bg-white border border-slate-200 shadow-sm rounded-xl">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Pending Calls</span>
            <PhoneCall className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-amber-600">{totalPendingCalls}</p>
          <span className="text-[10px] text-amber-600 font-medium">Today&apos;s queue</span>
        </Card>

        <Card className="p-3.5 bg-white border border-slate-200 shadow-sm rounded-xl">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Follow-Ups</span>
            <CalendarCheck className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-indigo-600">{totalPendingFollowups}</p>
          <span className="text-[10px] text-indigo-600 font-medium">Scheduled</span>
        </Card>

        <Card className="p-3.5 bg-white border border-slate-200 shadow-sm rounded-xl">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Confirmed Colleges</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-600">{totalConfirmedColleges}</p>
          <span className="text-[10px] text-emerald-600 font-medium">MoU locked</span>
        </Card>

        <Card className="p-3.5 bg-white border border-slate-200 shadow-sm rounded-xl">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Pending Interviews</span>
            <Clock className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-bold text-rose-600">{totalPendingInterviews}</p>
          <span className="text-[10px] text-rose-600 font-medium">Calibrated slots</span>
        </Card>

        <Card className="p-3.5 bg-white border border-slate-200 shadow-sm rounded-xl">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Avg Selection %</span>
            <Award className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-purple-600">{avgSelection}%</p>
          <span className="text-[10px] text-purple-600 font-medium">Evaluation yield</span>
        </Card>

        <Card className="p-3.5 bg-white border border-slate-200 shadow-sm rounded-xl">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">Avg Workload</span>
            <TrendingUp className="w-4 h-4 text-[#005BBB]" />
          </div>
          <p className="text-2xl font-bold text-[#005BBB]">{avgWorkload}%</p>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
            <div className="bg-[#005BBB] h-1.5 rounded-full" style={{ width: `${avgWorkload}%` }} />
          </div>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 bg-white border border-slate-200 shadow-sm rounded-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by HR Name, Emp ID, Drive, or College..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005BBB] focus:border-transparent text-slate-800"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="text-xs font-medium border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#005BBB] text-slate-700 bg-white"
              >
                <option value="all">All Priorities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="normal">Normal</option>
              </select>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs font-medium border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#005BBB] text-slate-700 bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="on field">On Field</option>
              <option value="in review">In Review</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Recruiter Roster List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredAssignments.map((hr) => (
          <Card
            key={hr.id}
            className="p-5 bg-white border border-slate-200 hover:border-[#005BBB]/40 transition-all shadow-sm rounded-xl"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#001B4D] to-[#005BBB] text-white flex items-center justify-center font-bold text-lg shadow-md shrink-0">
                  {hr.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900 text-base">{hr.name}</h3>
                    <span className="text-xs text-slate-500 font-mono">({hr.empId})</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${hr.priority === "Critical"
                        ? "bg-rose-100 text-rose-700 border border-rose-200"
                        : hr.priority === "High"
                          ? "bg-amber-100 text-amber-700 border border-amber-200"
                          : "bg-blue-100 text-blue-700 border border-blue-200"
                        }`}
                    >
                      {hr.priority}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3 text-slate-400" />
                      {hr.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {hr.phone}
                    </span>
                  </div>
                </div>
              </div>

              <span
                className={`text-xs px-2.5 py-1 rounded-full font-medium ${hr.status === "Active"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : hr.status === "On Field"
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "bg-slate-100 text-slate-700"
                  }`}
              >
                {hr.status}
              </span>
            </div>

            {/* Campaign info */}
            <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="text-xs text-slate-500 font-medium">Assigned Campaign:</div>
              <div className="text-sm font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                <Briefcase className="w-3.5 h-3.5 text-[#005BBB]" />
                {hr.driveName}
              </div>
            </div>

            {/* Colleges tags */}
            <div className="mt-3 space-y-1.5">
              <div className="text-xs font-semibold text-slate-600 flex items-center justify-between">
                <span>Primary Assigned Colleges ({hr.primaryColleges.length})</span>
                <span className="text-[11px] text-slate-400 font-normal">
                  {hr.startDate} to {hr.endDate}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {hr.primaryColleges.map((c, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 px-2.5 py-1 rounded-md border border-slate-200"
                  >
                    <Building2 className="w-3 h-3 text-[#005BBB]" />
                    {c}
                  </span>
                ))}
              </div>

              {hr.backupColleges.length > 0 && (
                <div className="pt-1">
                  <span className="text-[11px] font-medium text-slate-500">Backup HR Coverage for: </span>
                  {hr.backupColleges.map((bc, idx) => (
                    <span key={idx} className="text-xs text-amber-700 font-medium ml-1">
                      {bc}
                      {idx < hr.backupColleges.length - 1 ? "," : ""}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Metrics breakdown */}
            <div className="grid grid-cols-4 gap-2 mt-4 pt-3 border-t border-slate-100 text-center">
              <div className="p-1.5 rounded-lg bg-slate-50">
                <div className="text-[11px] text-slate-500">Pending Calls</div>
                <div className="text-sm font-bold text-amber-600">{hr.metrics.pendingCalls}</div>
              </div>
              <div className="p-1.5 rounded-lg bg-slate-50">
                <div className="text-[11px] text-slate-500">Follow-Ups</div>
                <div className="text-sm font-bold text-indigo-600">{hr.metrics.pendingFollowups}</div>
              </div>
              <div className="p-1.5 rounded-lg bg-slate-50">
                <div className="text-[11px] text-slate-500">Confirmed</div>
                <div className="text-sm font-bold text-emerald-600">{hr.metrics.confirmedColleges}</div>
              </div>
              <div className="p-1.5 rounded-lg bg-slate-50">
                <div className="text-[11px] text-slate-500">Interviews</div>
                <div className="text-sm font-bold text-rose-600">{hr.metrics.pendingInterviews}</div>
              </div>
            </div>

            {/* Workload Progress Bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-slate-600">Workload Capacity</span>
                <span className="font-bold text-slate-900">{hr.metrics.workloadPercentage}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${hr.metrics.workloadPercentage > 85
                    ? "bg-rose-500"
                    : hr.metrics.workloadPercentage > 70
                      ? "bg-amber-500"
                      : "bg-[#005BBB]"
                    }`}
                  style={{ width: `${hr.metrics.workloadPercentage}%` }}
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedHRForDetail(hr)}
                className="text-xs font-semibold text-[#005BBB] hover:text-[#001B4D] flex items-center gap-1"
              >
                View Full Dossier & Notes
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs py-1 px-2.5 h-auto"
                  onClick={() => toast.info(`Logged follow-up call reminder for ${hr.name}.`)}
                >
                  <PhoneCall className="w-3 h-3 mr-1" />
                  Call Log
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="text-xs py-1 px-2.5 h-auto"
                  onClick={() => {
                    toast.success(`Opened workload rebalancer for ${hr.name}.`);
                  }}
                >
                  <Edit2 className="w-3 h-3 mr-1" />
                  Rebalance
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* HR Detail Dossier Modal */}
      {selectedHRForDetail && (
        <Modal
          isOpen={!!selectedHRForDetail}
          onClose={() => setSelectedHRForDetail(null)}
          title={`HR Executive Profile — ${selectedHRForDetail.name}`}
          subtitle={`Employee Code: ${selectedHRForDetail.empId} • ${selectedHRForDetail.status}`}
          size="lg"
        >
          <div className="space-y-4 text-slate-800">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Operational Notes</h4>
              <p className="text-sm text-slate-700 italic">&ldquo;{selectedHRForDetail.notes}&rdquo;</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-500">Contact Number:</span>
                <p className="font-semibold text-slate-800 mt-0.5">{selectedHRForDetail.phone}</p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-500">Official Email:</span>
                <p className="font-semibold text-slate-800 mt-0.5">{selectedHRForDetail.email}</p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-500">Drive Timeline:</span>
                <p className="font-semibold text-slate-800 mt-0.5">
                  {selectedHRForDetail.startDate} → {selectedHRForDetail.endDate}
                </p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-500">Current Workload:</span>
                <p className="font-semibold text-slate-800 mt-0.5">{selectedHRForDetail.metrics.workloadPercentage}% Capacity</p>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Primary Assigned Institutions
              </h4>
              <ul className="space-y-1.5">
                {selectedHRForDetail.primaryColleges.map((c, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-200"
                  >
                    <span className="font-semibold text-slate-800 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-[#005BBB]" />
                      {c}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                      Confirmed & Active
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <Button variant="outline" onClick={() => setSelectedHRForDetail(null)}>
                Close Dossier
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  toast.success(`Dossier exported to PDF for ${selectedHRForDetail.name}`);
                  setSelectedHRForDetail(null);
                }}
              >
                Export Workload Sheet
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Assign HR to Drive Modal */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title="Assign HR Recruiter to CSR Drive"
        subtitle="Allocate operational responsibilities, primary campus outreach, and interview panels."
        size="lg"
      >
        <form onSubmit={handleCreateAssignment} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">HR Executive Name *</label>
              <input
                type="text"
                placeholder="e.g. Meenakshi Sundaram"
                value={newHRName}
                onChange={(e) => setNewHRName(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Employee ID *</label>
              <input
                type="text"
                placeholder="e.g. GQT-HR-125"
                value={newEmpId}
                onChange={(e) => setNewEmpId(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="hr.recruiter@gqt.co.in"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone</label>
              <input
                type="text"
                placeholder="+91 98765 43210"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Assign to CSR Drive *</label>
            <select
              value={newDrive}
              onChange={(e) => setNewDrive(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none bg-white"
            >
              {drives.map((d: any) => (
                <option key={d.id} value={d.name}>
                  {d.name} ({d.driveCode})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Primary Assigned Colleges * (Hold Ctrl for multiple)
            </label>
            <select
              multiple
              value={newColleges}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, (option) => option.value);
                setNewColleges(selected);
              }}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none h-28 bg-white"
            >
              {colleges.map((col: any) => (
                <option key={col.id} value={col.name}>
                  {col.name} ({col.district})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 mt-1">
              Selected: {newColleges.length} colleges allocated to this HR.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Assignment Priority</label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as any)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none bg-white"
              >
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Normal">Normal</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Start Date</label>
              <input
                type="date"
                value={newStartDate}
                onChange={(e) => setNewStartDate(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">End Date</label>
              <input
                type="date"
                value={newEndDate}
                onChange={(e) => setNewEndDate(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Operational Instructions & Notes</label>
            <textarea
              rows={3}
              placeholder="e.g. Prioritize calling the placement officer for signed MoU before Friday..."
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
            <Button variant="outline" type="button" onClick={() => setIsAssignModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="cyan" type="submit">
              Confirm HR Assignment
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
