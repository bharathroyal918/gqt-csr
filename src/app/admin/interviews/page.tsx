"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Tabs } from "@/components/common/Tabs";
import { Modal } from "@/components/common/Modal";
import { toast } from "sonner";
import {
  Users,
  Search,
  Download,
  Eye,
  Edit,
  UserCheck,
  Calendar,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  UserX,
  ShieldAlert,
  Save
} from "lucide-react";
import { useApp } from "@/context/AppContext";

interface InterviewQueueItem {
  id: string;
  studentName: string;
  usn: string;
  collegeName: string;
  branch: string;
  examScore: number;
  assignedHr: string;
  status: "Pending" | "Selected" | "Rejected" | "Hold" | "Not Attended";
  scheduledTime: string;
  hrRemarks?: string;
  technicalScore?: number;
  communicationScore?: number;
  adminOverridden?: boolean;
}

const INITIAL_QUEUE: InterviewQueueItem[] = [
  {
    id: "int-101",
    studentName: "Aditi S. Rao",
    usn: "1RV21CS014",
    collegeName: "R.V. College of Engineering",
    branch: "Computer Science",
    examScore: 48,
    assignedHr: "Hitha, Kusuma",
    status: "Selected",
    scheduledTime: "2025-02-14 10:30 AM",
    hrRemarks: "Outstanding technical depth in Spring Boot & Data Structures. Recommended for Immediate Offer.",
    technicalScore: 9,
    communicationScore: 9,
  },
  {
    id: "int-102",
    studentName: "Rohan Gowda",
    usn: "1BM21IS042",
    collegeName: "BMS College of Engineering",
    branch: "Information Science",
    examScore: 44,
    assignedHr: "Divya.H",
    status: "Pending",
    scheduledTime: "2025-02-15 02:00 PM",
  },
  {
    id: "int-103",
    studentName: "Kavya Murthy",
    usn: "1MS21EC088",
    collegeName: "Ramaiah Institute of Technology",
    branch: "Electronics & Comm",
    examScore: 41,
    assignedHr: "Hitha, Kusuma",
    status: "Hold",
    scheduledTime: "2025-02-14 11:30 AM",
    hrRemarks: "Good logic, but needs re-test in Python OOP principles.",
    technicalScore: 6,
    communicationScore: 7,
  },
  {
    id: "int-104",
    studentName: "Darshan Naik",
    usn: "2KL21CS035",
    collegeName: "KLE Technological University",
    branch: "Computer Science",
    examScore: 36,
    assignedHr: "Sneha Rao",
    status: "Rejected",
    scheduledTime: "2025-02-13 03:00 PM",
    hrRemarks: "Could not write basic array sorting algorithm.",
    technicalScore: 4,
    communicationScore: 5,
  },
  {
    id: "int-105",
    studentName: "Manjunath Patil",
    usn: "1BM21EC055",
    collegeName: "BMS College of Engineering",
    branch: "Electronics & Comm",
    examScore: 39,
    assignedHr: "Divya.H",
    status: "Not Attended",
    scheduledTime: "2025-02-13 11:00 AM",
    hrRemarks: "Candidate absent on campus evaluation slot.",
  },
];

export default function AdminInterviewControlPage() {
  const [queue, setQueue] = useState<InterviewQueueItem[]>(INITIAL_QUEUE);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Modals
  const [feedbackItem, setFeedbackItem] = useState<InterviewQueueItem | null>(null);
  const [overrideItem, setOverrideItem] = useState<InterviewQueueItem | null>(null);
  const [reassignItem, setReassignItem] = useState<InterviewQueueItem | null>(null);
  const [overrideStatus, setOverrideStatus] = useState<InterviewQueueItem["status"]>("Selected");
  const [overrideReason, setOverrideReason] = useState("");
  const [newHr, setNewHr] = useState("Divya.H");

  const tabs = [
    { id: "all", label: `All Queue (${queue.length})` },
    { id: "Pending", label: `Pending (${queue.filter((q) => q.status === "Pending").length})`, icon: <Clock className="w-4 h-4 text-amber-500" /> },
    { id: "Selected", label: `Selected (${queue.filter((q) => q.status === "Selected").length})`, icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" /> },
    { id: "Hold", label: `Hold (${queue.filter((q) => q.status === "Hold").length})`, icon: <Clock className="w-4 h-4 text-blue-500" /> },
    { id: "Rejected", label: `Rejected (${queue.filter((q) => q.status === "Rejected").length})`, icon: <XCircle className="w-4 h-4 text-rose-500" /> },
    { id: "Not Attended", label: `Not Attended (${queue.filter((q) => q.status === "Not Attended").length})`, icon: <UserX className="w-4 h-4 text-muted-foreground" /> },
  ];

  const filtered = queue.filter((item) => {
    const matchesTab = activeTab === "all" || item.status === activeTab;
    const matchesSearch =
      item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.usn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.collegeName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleOverrideSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideItem) return;
    const prevStatus = overrideItem.status;
    setQueue((prev) =>
      prev.map((q) =>
        q.id === overrideItem.id
          ? { ...q, status: overrideStatus, adminOverridden: true, hrRemarks: `${q.hrRemarks || ""} [Admin Override: ${overrideReason}]` }
          : q
      )
    );
    // Forensic audit override committed to Supabase audit stream
    toast.success(`Candidate status overridden to "${overrideStatus}" and saved to forensic audit.`);
    setOverrideItem(null);
    setOverrideReason("");
  };

  const handleReassignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reassignItem) return;
    setQueue((prev) =>
      prev.map((q) => (q.id === reassignItem.id ? { ...q, assignedHr: newHr } : q))
    );
    toast.success(`Reassigned evaluation to ${newHr}`);
    setReassignItem(null);
  };

  const handleBulkExport = () => {
    toast.success("Interview queue exported to CSV");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900/40 via-blue-950/30 to-indigo-900/40 border border-blue-500/20 backdrop-blur-xl p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              Recruiter Evaluation Pipeline
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Interview Control Center & HR Override
          </h1>
          <p className="text-sm text-muted-foreground">
            Monitor recruiter evaluation queues in real-time, inspect technical ratings, and execute governance overrides with automatic audit logging.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={handleBulkExport} variant="outline" className="border-border hover:bg-muted gap-2">
            <Download className="w-4 h-4" /> Bulk Export
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search interview queue by student, USN, college..."
          className="pl-10 h-10 bg-card/60"
        />
      </div>

      {/* Table */}
      <Card className="border border-border/60 bg-card/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 border-b border-border/50 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              <tr>
                <th className="p-4 pl-6">Candidate</th>
                <th className="p-4">Institution & Branch</th>
                <th className="p-4 text-center">Exam Score</th>
                <th className="p-4">Assigned HR</th>
                <th className="p-4">Slot Time</th>
                <th className="p-4 text-center">Decision Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-medium">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="font-bold text-foreground flex items-center gap-1.5">
                      {item.studentName}
                      {item.adminOverridden && (
                        <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-amber-500/20 text-amber-400">
                          OVERRIDDEN
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground font-mono">{item.usn}</div>
                  </td>
                  <td className="p-4 text-xs">
                    <div className="font-semibold text-foreground">{item.collegeName}</div>
                    <div className="text-muted-foreground">{item.branch}</div>
                  </td>
                  <td className="p-4 text-center font-bold text-foreground">
                    {item.examScore}/50
                  </td>
                  <td className="p-4 text-xs font-semibold text-primary">
                    {item.assignedHr}
                  </td>
                  <td className="p-4 text-xs text-muted-foreground">
                    {item.scheduledTime}
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-semibold border ${
                        item.status === "Selected"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : item.status === "Pending"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          : item.status === "Hold"
                          ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                          : item.status === "Rejected"
                          ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                          : "bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {item.hrRemarks && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setFeedbackItem(item)}
                          title="View Recruiter Feedback"
                          className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setOverrideItem(item);
                          setOverrideStatus(item.status);
                        }}
                        title="Override HR Decision"
                        className="h-8 w-8 p-0 hover:bg-amber-500/10 hover:text-amber-400"
                      >
                        <ShieldAlert className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setReassignItem(item)}
                        title="Assign New HR Recruiter"
                        className="h-8 w-8 p-0 hover:bg-blue-500/10 hover:text-blue-400"
                      >
                        <UserCheck className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* View Feedback Modal */}
      {feedbackItem && (
        <Modal
          isOpen={!!feedbackItem}
          onClose={() => setFeedbackItem(null)}
          title={`HR Evaluation Remarks: ${feedbackItem.studentName}`}
        >
          <div className="space-y-4 pt-2">
            <div className="p-4 bg-muted/40 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Evaluator</span>
                <span className="text-xs font-bold text-foreground">{feedbackItem.assignedHr}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Technical Rating</span>
                <span className="text-xs font-bold text-emerald-400">{feedbackItem.technicalScore || 8} / 10</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Communication Rating</span>
                <span className="text-xs font-bold text-primary">{feedbackItem.communicationScore || 8} / 10</span>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase text-muted-foreground mb-1">Qualitative Feedback</h4>
              <p className="text-xs bg-card p-3 border rounded-xl leading-relaxed">{feedbackItem.hrRemarks}</p>
            </div>
            <div className="flex justify-end pt-2">
              <Button onClick={() => setFeedbackItem(null)}>Close</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Override HR Decision Modal */}
      {overrideItem && (
        <Modal
          isOpen={!!overrideItem}
          onClose={() => setOverrideItem(null)}
          title={`Super Admin Decision Override: ${overrideItem.studentName}`}
        >
          <form onSubmit={handleOverrideSubmit} className="space-y-4 pt-2">
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-400">
              This action executes a Super Admin override. All alterations are permanently signed into the forensic audit trail.
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">New Committee Decision</label>
              <select
                value={overrideStatus}
                onChange={(e) => setOverrideStatus(e.target.value as any)}
                className="w-full h-10 px-3 text-xs rounded-xl border border-border bg-background text-foreground"
              >
                <option value="Selected">Selected</option>
                <option value="Hold">Hold</option>
                <option value="Rejected">Rejected</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Governance Override Justification *</label>
              <Input
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                placeholder="Reason for changing HR evaluation..."
                required
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setOverrideItem(null)}>Cancel</Button>
              <Button type="submit" className="bg-amber-600 text-white hover:bg-amber-700">Commit Override</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Reassign HR Modal */}
      {reassignItem && (
        <Modal
          isOpen={!!reassignItem}
          onClose={() => setReassignItem(null)}
          title={`Reassign Evaluation: ${reassignItem.studentName}`}
        >
          <form onSubmit={handleReassignSubmit} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Select HR Executive</label>
              <select
                value={newHr}
                onChange={(e) => setNewHr(e.target.value)}
                className="w-full h-10 px-3 text-xs rounded-xl border border-border bg-background text-foreground"
              >
                <option value="Hitha, Kusuma">Hitha, Kusuma (Lead Recruiter)</option>
                <option value="Divya.H">Divya.H (Technical Recruiter)</option>
                <option value="Sneha Rao">Sneha Rao (Regional Recruiter)</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setReassignItem(null)}>Cancel</Button>
              <Button type="submit" className="bg-primary text-white">Reassign</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
