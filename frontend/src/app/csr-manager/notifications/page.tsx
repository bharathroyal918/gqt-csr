"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Megaphone,
  Send,
  Plus,
  Filter,
  Search,
  Building2,
  Users,
  Award,
  FileText,
  Clock,
  ExternalLink,
  Trash2,
  CheckCheck,
  Calendar,
  MessageSquare,
  Mail,
  Smartphone
} from "lucide-react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { toast } from "sonner";

interface OperationalNotification {
  id: string;
  title: string;
  message: string;
  category: "Registration" | "College" | "Exam" | "Milestone" | "Interview" | "Offer";
  timestamp: string;
  isRead: boolean;
  priority: "High" | "Medium" | "Normal";
  driveName: string;
  link?: string;
}

interface DriveAnnouncement {
  id: string;
  title: string;
  content: string;
  audience: "All Students" | "Selected Colleges" | "Specific Branches" | "Specific Course";
  targetDetails: string;
  channels: ("Dashboard" | "WhatsApp" | "Email")[];
  scheduledDate: string;
  status: "Sent" | "Scheduled" | "Draft";
  reachCount: number;
}

const INITIAL_NOTIFICATIONS: OperationalNotification[] = [
  {
    id: "NOTIF-001",
    title: "Student Count Milestone Reached: 1,500 Registered",
    message: "Registration for 'CSR Flagship Campus Drive 2026' has surpassed 1,500 students across 6 affiliated engineering colleges.",
    category: "Milestone",
    timestamp: "10 mins ago",
    isRead: false,
    priority: "High",
    driveName: "CSR Flagship Campus Drive 2026",
    link: "/csr-manager/drives",
  },
  {
    id: "NOTIF-002",
    title: "College Confirmed MoU: National Institute of Engineering",
    message: "Principal Dr. Rohini signed the CSR Partnership MoU. 340 students from CS/IS streams have been unlocked for batch registration.",
    category: "College",
    timestamp: "45 mins ago",
    isRead: false,
    priority: "High",
    driveName: "Women in Tech Empowerment Drive",
    link: "/csr-manager/colleges",
  },
  {
    id: "NOTIF-003",
    title: "Proctored Exam Published & Deployed Live",
    message: "Agentic AI Java Full Stack assessment question set (60 MCQs + 2 Coding Challenges) is live on the student testing platform.",
    category: "Exam",
    timestamp: "2 hours ago",
    isRead: false,
    priority: "High",
    driveName: "CSR Flagship Campus Drive 2026",
  },
  {
    id: "NOTIF-004",
    title: "Batch 1 Interview Slots Allocated",
    message: "HR recruiter Priya Nair scheduled 24 technical interviews with Google Meet panels for qualifying candidates.",
    category: "Interview",
    timestamp: "4 hours ago",
    isRead: true,
    priority: "Normal",
    driveName: "CSR Flagship Campus Drive 2026",
  },
  {
    id: "NOTIF-005",
    title: "Offer Letters Issued: 42 Candidates",
    message: "Automated LOI package with DocuSign workflow released for selected candidates at RV College of Engineering.",
    category: "Offer",
    timestamp: "1 day ago",
    isRead: true,
    priority: "High",
    driveName: "CSR Flagship Campus Drive 2026",
  },
];

const INITIAL_ANNOUNCEMENTS: DriveAnnouncement[] = [
  {
    id: "ANN-101",
    title: "Mock Assessment Portal Open for Practice",
    content: "All registered candidates can now access the 30-minute mock coding test to calibrate webcam proctoring and system requirements.",
    audience: "All Students",
    targetDetails: "1,520 Candidates (All 6 Colleges)",
    channels: ["Dashboard", "WhatsApp", "Email"],
    scheduledDate: "2026-09-24 16:00",
    status: "Sent",
    reachCount: 1520,
  },
  {
    id: "ANN-102",
    title: "Webinar on Agentic AI Career Pathways with GQT CTO",
    content: "Exclusive live technical workshop with industry leads for 2026 graduating batch students of BMSCE & RVCE.",
    audience: "Selected Colleges",
    targetDetails: "RVCE, BMSCE CS/IT Final Year",
    channels: ["WhatsApp", "Dashboard"],
    scheduledDate: "2026-09-26 18:30",
    status: "Scheduled",
    reachCount: 840,
  },
];

export default function CSRNotificationsPage() {
  const [activeTab, setActiveTab] = useState<"notifications" | "announcements">("notifications");
  const [notifications, setNotifications] = useState<OperationalNotification[]>(INITIAL_NOTIFICATIONS);
  const [announcements, setAnnouncements] = useState<DriveAnnouncement[]>(INITIAL_ANNOUNCEMENTS);

  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Create Announcement Modal
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [newAnnTitle, setNewAnnTitle] = useState("");
  const [newAnnContent, setNewAnnContent] = useState("");
  const [newAnnAudience, setNewAnnAudience] = useState<DriveAnnouncement["audience"]>("All Students");
  const [newAnnTargets, setNewAnnTargets] = useState("All participating colleges");
  const [newAnnChannels, setNewAnnChannels] = useState<("Dashboard" | "WhatsApp" | "Email")[]>([
    "Dashboard",
    "WhatsApp",
  ]);
  const [newAnnDate, setNewAnnDate] = useState("2026-09-25 10:00");

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    toast.success("All operational notifications marked as read.");
  };

  const handleToggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    );
  };

  const handleClearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast.info("Notification dismissed.");
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnTitle || !newAnnContent) {
      toast.error("Please provide title and announcement message.");
      return;
    }

    const created: DriveAnnouncement = {
      id: `ANN-${Date.now().toString().slice(-3)}`,
      title: newAnnTitle,
      content: newAnnContent,
      audience: newAnnAudience,
      targetDetails: newAnnTargets,
      channels: newAnnChannels,
      scheduledDate: newAnnDate,
      status: "Scheduled",
      reachCount: 1200,
    };

    setAnnouncements([created, ...announcements]);
    setIsAnnouncementModalOpen(false);
    toast.success(`Announcement '${newAnnTitle}' scheduled for dispatch via ${newAnnChannels.join(", ")}!`);

    // Reset
    setNewAnnTitle("");
    setNewAnnContent("");
  };

  const filteredNotifications = notifications.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.driveName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || n.category.toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-gradient-to-r from-[#001B4D] via-[#003366] to-[#005BBB] text-white p-6 rounded-2xl shadow-xl border border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#14B8FF]/20 text-[#14B8FF] border border-[#14B8FF]/30">
              Live Operations Feed
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">CSR Notifications & Broadcast Center</h1>
          <p className="text-white/80 text-sm mt-1 max-w-2xl">
            Real-time milestone alerts for college confirmations, exam launches, student volumes, and omnichannel student announcements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="cyan"
            className="flex items-center gap-2 shadow-lg"
            onClick={() => setIsAnnouncementModalOpen(true)}
          >
            <Megaphone className="w-4 h-4" />
            Create Drive Announcement
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveTab("notifications")}
            className={`pb-3 text-sm font-semibold flex items-center gap-2 relative transition-colors ${
              activeTab === "notifications"
                ? "text-[#005BBB] border-b-2 border-[#005BBB]"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Bell className="w-4 h-4" />
            Real-Time Notifications
            {unreadCount > 0 && (
              <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {unreadCount} new
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("announcements")}
            className={`pb-3 text-sm font-semibold flex items-center gap-2 relative transition-colors ${
              activeTab === "announcements"
                ? "text-[#005BBB] border-b-2 border-[#005BBB]"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Megaphone className="w-4 h-4" />
            Drive Announcements ({announcements.length})
          </button>
        </div>

        {activeTab === "notifications" && unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="text-xs font-semibold text-[#005BBB] hover:text-[#001B4D] flex items-center gap-1 mb-2"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all as read
          </button>
        )}
      </div>

      {activeTab === "notifications" ? (
        <div className="space-y-4">
          {/* Filters */}
          <Card className="p-4 bg-white border border-slate-200 shadow-sm rounded-xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005BBB] text-slate-800"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="text-xs font-medium border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#005BBB] text-slate-700 bg-white"
              >
                <option value="all">All Notification Types</option>
                <option value="milestone">Milestones</option>
                <option value="college">College MoUs</option>
                <option value="exam">Online Exam</option>
                <option value="interview">Interviews</option>
                <option value="offer">Offer Letters</option>
              </select>
            </div>
          </Card>

          {/* Notifications Feed */}
          <div className="space-y-3">
            {filteredNotifications.map((notif) => (
              <Card
                key={notif.id}
                className={`p-4 transition-all shadow-sm rounded-xl border ${
                  notif.isRead
                    ? "bg-white border-slate-200"
                    : "bg-blue-50/40 border-[#005BBB]/30 shadow-sm"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        notif.category === "Milestone"
                          ? "bg-amber-100 text-amber-600"
                          : notif.category === "College"
                          ? "bg-emerald-100 text-emerald-600"
                          : notif.category === "Exam"
                          ? "bg-purple-100 text-purple-600"
                          : notif.category === "Interview"
                          ? "bg-sky-100 text-sky-600"
                          : "bg-indigo-100 text-indigo-600"
                      }`}
                    >
                      {notif.category === "Milestone" && <Award className="w-5 h-5" />}
                      {notif.category === "College" && <Building2 className="w-5 h-5" />}
                      {notif.category === "Exam" && <FileText className="w-5 h-5" />}
                      {notif.category === "Interview" && <Users className="w-5 h-5" />}
                      {notif.category === "Offer" && <CheckCircle2 className="w-5 h-5" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          {notif.category}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs text-slate-500">{notif.timestamp}</span>
                        {!notif.isRead && (
                          <span className="w-2 h-2 rounded-full bg-[#005BBB]" />
                        )}
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 mt-0.5">{notif.title}</h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notif.message}</p>

                      <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                        <span className="text-[#005BBB]">Campaign: {notif.driveName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleToggleRead(notif.id)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100"
                      title={notif.isRead ? "Mark as unread" : "Mark as read"}
                    >
                      <CheckCircle2
                        className={`w-4 h-4 ${notif.isRead ? "text-emerald-500" : "text-slate-400"}`}
                      />
                    </button>
                    <button
                      onClick={() => handleClearNotification(notif.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50"
                      title="Dismiss notification"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        /* Announcements View */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {announcements.map((ann) => (
              <Card key={ann.id} className="p-5 bg-white border border-slate-200 shadow-sm rounded-xl">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-lg bg-[#005BBB]/10 text-[#005BBB]">
                      <Megaphone className="w-4 h-4" />
                    </span>
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 font-bold">{ann.id}</span>
                      <h3 className="font-bold text-slate-900 text-sm">{ann.title}</h3>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      ann.status === "Sent"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {ann.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-3 leading-relaxed">{ann.content}</p>

                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 text-[11px]">Target Audience:</span>
                    <p className="font-semibold text-slate-800">{ann.targetDetails}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px]">Channels:</span>
                    <p className="font-semibold text-indigo-700">{ann.channels.join(", ")}</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span className="flex items-center gap-1 font-medium text-slate-700">
                    <Users className="w-3.5 h-3.5 text-[#005BBB]" />
                    Total Reach: {ann.reachCount.toLocaleString()} Students
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {ann.scheduledDate}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Create Announcement Modal */}
      <Modal
        isOpen={isAnnouncementModalOpen}
        onClose={() => setIsAnnouncementModalOpen(false)}
        title="Broadcast Drive Announcement"
        subtitle="Disseminate urgent exam schedules, webinar links, or reminders directly to student devices."
        size="lg"
      >
        <form onSubmit={handleCreateAnnouncement} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Announcement Title *</label>
            <input
              type="text"
              placeholder="e.g. Mandatory System Check Before Tomorrow's Exam"
              value={newAnnTitle}
              onChange={(e) => setNewAnnTitle(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Audience</label>
              <select
                value={newAnnAudience}
                onChange={(e) => setNewAnnAudience(e.target.value as any)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none bg-white"
              >
                <option value="All Students">All Registered Students</option>
                <option value="Selected Colleges">Selected Colleges</option>
                <option value="Specific Branches">Specific Engineering Branches</option>
                <option value="Specific Course">Specific Enrolled Course</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Detail / Filter</label>
              <input
                type="text"
                placeholder="e.g. RVCE, BMSCE — CSE / ISE"
                value={newAnnTargets}
                onChange={(e) => setNewAnnTargets(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Broadcast Channels</label>
              <div className="flex items-center gap-3 pt-2 text-xs">
                {(["Dashboard", "WhatsApp", "Email"] as const).map((channel) => (
                  <label key={channel} className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newAnnChannels.includes(channel)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewAnnChannels([...newAnnChannels, channel]);
                        } else {
                          setNewAnnChannels(newAnnChannels.filter((c) => c !== channel));
                        }
                      }}
                      className="rounded text-[#005BBB] focus:ring-[#005BBB]"
                    />
                    <span className="font-medium text-slate-700">{channel}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Schedule Date & Time</label>
              <input
                type="datetime-local"
                value={newAnnDate}
                onChange={(e) => setNewAnnDate(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Announcement Message *</label>
            <textarea
              rows={4}
              placeholder="Enter clear, concise broadcast text..."
              value={newAnnContent}
              onChange={(e) => setNewAnnContent(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
            <Button variant="outline" type="button" onClick={() => setIsAnnouncementModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="cyan" type="submit">
              Schedule Broadcast
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
