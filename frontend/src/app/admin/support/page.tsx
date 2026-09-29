"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Modal } from "@/components/common/Modal";
import { toast } from "sonner";
import {
  HelpCircle,
  Search,
  MessageSquare,
  CheckCircle2,
  Clock,
  AlertTriangle,
  UserCheck,
  Send,
  Eye,
  Building2,
  GraduationCap
} from "lucide-react";
import { useApp } from "@/context/AppContext";

interface SupportTicketItem {
  id: string;
  raisedBy: string;
  userType: "Student" | "HR" | "PTO" | "Faculty";
  subject: string;
  message: string;
  priority: "High" | "Medium" | "Low";
  status: "Open" | "In Progress" | "Resolved";
  assignedTo: string;
  createdAt: string;
  replies: { author: string; text: string; time: string }[];
}

const INITIAL_TICKETS: SupportTicketItem[] = [
  {
    id: "TCK-881",
    raisedBy: "Praveen Patil (1BM21CS099)",
    userType: "Student",
    subject: "Webcam permission denied during test calibration",
    message: "When starting the test environment on Chrome, the browser did not request webcam permissions.",
    priority: "High",
    status: "Open",
    assignedTo: "Kiran",
    createdAt: "2025-02-14 10:15 AM",
    replies: [
      { author: "Kiran (Support)", text: "Please reset site permissions in chrome://settings/content/camera.", time: "10:25 AM" },
    ],
  },
  {
    id: "TCK-882",
    raisedBy: "Prof. Chandrasekhar",
    userType: "PTO",
    subject: "Need bulk hall ticket export for Department of ISE",
    message: "Could you enable bulk PDF dispatch for the 60 registered ISE candidates?",
    priority: "Medium",
    status: "In Progress",
    assignedTo: "Divya.H",
    createdAt: "2025-02-13 04:30 PM",
    replies: [],
  },
  {
    id: "TCK-883",
    raisedBy: "Dr. Suma Swamy",
    userType: "Faculty",
    subject: "Discrepancy in USN mapping for 2 candidate profiles",
    message: "Two candidates had incorrect branch codes mapped on registration.",
    priority: "Low",
    status: "Resolved",
    assignedTo: "Super Admin",
    createdAt: "2025-02-12 02:00 PM",
    replies: [
      { author: "Super Admin", text: "USNs corrected in master database and profile synced.", time: "03:15 PM" },
    ],
  },
];

export default function AdminSupportCenterPage() {
  const [tickets, setTickets] = useState<SupportTicketItem[]>(INITIAL_TICKETS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTicket, setActiveTicket] = useState<SupportTicketItem | null>(null);
  const [replyText, setReplyText] = useState("");

  const filtered = tickets.filter((t) => {
    const matchesSearch =
      t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.raisedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || t.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicket || !replyText) return;
    const newReply = { author: "Super Admin", text: replyText, time: "Just now" };
    setTickets((prev) =>
      prev.map((t) =>
        t.id === activeTicket.id
          ? { ...t, status: "In Progress", replies: [...t.replies, newReply] }
          : t
      )
    );
    toast.success("Reply transmitted to user");
    setActiveTicket({ ...activeTicket, replies: [...activeTicket.replies, newReply], status: "In Progress" });
    setReplyText("");
  };

  const handleCloseTicket = (id: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "Resolved" } : t))
    );
    toast.success("Support ticket marked as Resolved");
    if (activeTicket?.id === id) {
      setActiveTicket({ ...activeTicket, status: "Resolved" });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900/40 via-blue-950/30 to-indigo-900/40 border border-blue-500/20 backdrop-blur-xl p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5" />
              Unified Helpdesk Resolution
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Support Center & Inquiries
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage inquiries, technical support tickets, and exam issues raised by students, college placement officers, and faculty coordinators.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border border-border/60 bg-card/60 backdrop-blur-md rounded-2xl">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground font-medium">Total Inquiries</p>
            <p className="text-2xl font-bold text-foreground mt-1">{tickets.length}</p>
          </CardContent>
        </Card>
        <Card className="border border-border/60 bg-card/60 backdrop-blur-md rounded-2xl">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground font-medium">Open & Urgent</p>
            <p className="text-2xl font-bold text-rose-500 mt-1">
              {tickets.filter((t) => t.status === "Open").length}
            </p>
          </CardContent>
        </Card>
        <Card className="border border-border/60 bg-card/60 backdrop-blur-md rounded-2xl">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground font-medium">Under Investigation</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">
              {tickets.filter((t) => t.status === "In Progress").length}
            </p>
          </CardContent>
        </Card>
        <Card className="border border-border/60 bg-card/60 backdrop-blur-md rounded-2xl">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground font-medium">Resolved</p>
            <p className="text-2xl font-bold text-emerald-500 mt-1">
              {tickets.filter((t) => t.status === "Resolved").length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-card/60 backdrop-blur-md p-4 rounded-2xl border border-border/60">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ticket ID, user, or topic..."
            className="pl-10 h-10 bg-background/80"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-3 text-xs rounded-xl border border-border bg-background text-foreground"
        >
          <option value="all">All Ticket Statuses</option>
          <option value="open">Open</option>
          <option value="in progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {/* Tickets Table */}
      <Card className="border border-border/60 bg-card/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 border-b border-border/50 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              <tr>
                <th className="p-4 pl-6">Ticket ID & Subject</th>
                <th className="p-4">Raised By</th>
                <th className="p-4">User Type</th>
                <th className="p-4 text-center">Priority</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4">Assigned Specialist</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-medium">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="font-bold text-foreground">{t.subject}</div>
                    <span className="font-mono text-[11px] text-muted-foreground">{t.id} • {t.createdAt}</span>
                  </td>
                  <td className="p-4 text-xs font-semibold text-foreground">
                    {t.raisedBy}
                  </td>
                  <td className="p-4 text-xs">
                    <span className="bg-muted px-2 py-0.5 rounded-full border text-[11px]">
                      {t.userType}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        t.priority === "High"
                          ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                          : t.priority === "Medium"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                      }`}
                    >
                      {t.priority}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-semibold border ${
                        t.status === "Resolved"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : t.status === "In Progress"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="p-4 text-xs font-semibold text-primary">
                    {t.assignedTo}
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setActiveTicket(t)}
                      className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Ticket Details & Chat Modal */}
      {activeTicket && (
        <Modal
          isOpen={!!activeTicket}
          onClose={() => setActiveTicket(null)}
          title={`Support Ticket: ${activeTicket.id}`}
        >
          <div className="space-y-4 pt-2 text-xs">
            <div className="p-4 bg-muted/40 rounded-2xl space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-foreground text-sm">{activeTicket.subject}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold">
                  {activeTicket.status}
                </span>
              </div>
              <p className="text-muted-foreground">{activeTicket.raisedBy} ({activeTicket.userType}) • {activeTicket.createdAt}</p>
              <p className="pt-2 text-foreground font-medium leading-relaxed">{activeTicket.message}</p>
            </div>

            {/* Conversation Log */}
            <div className="space-y-2 max-h-48 overflow-y-auto p-2 border border-border rounded-xl">
              <p className="text-[10px] uppercase font-bold text-muted-foreground">Correspondence Thread</p>
              {activeTicket.replies.map((r, i) => (
                <div key={i} className="p-2.5 bg-card border rounded-lg space-y-1">
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <strong className="text-primary">{r.author}</strong>
                    <span>{r.time}</span>
                  </div>
                  <p className="text-foreground">{r.text}</p>
                </div>
              ))}
            </div>

            {/* Reply Form */}
            <form onSubmit={handleSendReply} className="space-y-2">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type resolution message or instructions..."
                rows={3}
                className="w-full p-2.5 rounded-xl border border-border bg-background text-foreground text-xs"
                required
              />
              <div className="flex justify-between items-center pt-1">
                {activeTicket.status !== "Resolved" && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleCloseTicket(activeTicket.id)}
                    className="text-xs text-emerald-500 hover:text-emerald-400"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Mark Resolved
                  </Button>
                )}
                <div className="flex gap-2 ml-auto">
                  <Button type="button" variant="outline" onClick={() => setActiveTicket(null)}>Close</Button>
                  <Button type="submit" className="bg-primary text-white gap-1">
                    <Send className="w-3.5 h-3.5" /> Dispatch Reply
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
}
