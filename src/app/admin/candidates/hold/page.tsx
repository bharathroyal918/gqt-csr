"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Modal } from "@/components/common/Modal";
import { toast } from "sonner";
import {
  Clock,
  Search,
  Calendar,
  Eye,
  AlertCircle,
  RotateCcw
} from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function AdminHoldCandidatesPage() {
  const { students, updateStudent } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [rescheduleStudent, setRescheduleStudent] = useState<any | null>(null);
  const [newInterviewDate, setNewInterviewDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split("T")[0]
  );

  const holdStudents = students.filter(
    (s) => s.status === "HR On Hold" || s.status === "HR Interview Scheduled"
  );

  const filtered = holdStudents.filter(
    (s) =>
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.usn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.collegeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleStudent) return;
    updateStudent(rescheduleStudent.id, { status: "HR Interview Scheduled" });
    toast.success(`Interview rescheduled for ${rescheduleStudent.fullName} on ${newInterviewDate}`);
    setRescheduleStudent(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-amber-950/40 via-blue-950/30 to-indigo-950/40 border border-amber-500/20 backdrop-blur-xl p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Pending Committee Review
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            On-Hold Candidates Queue
          </h1>
          <p className="text-sm text-muted-foreground">
            Review borderline candidates kept on hold for secondary assessment, re-interviews, or backlog verification.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search on-hold candidate by name, USN, college..."
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
                <th className="p-4">Hold Reason</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-medium">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    No candidates currently in hold queue.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="font-bold text-foreground">{s.fullName}</div>
                      <div className="text-xs text-muted-foreground font-mono">{s.usn}</div>
                    </td>
                    <td className="p-4 text-xs">
                      <div className="font-semibold text-foreground">{s.collegeName}</div>
                      <div className="text-muted-foreground">{s.branch}</div>
                    </td>
                    <td className="p-4 text-center text-xs font-bold text-foreground">
                      {s.examResult?.marksObtained || 35} / 50
                    </td>
                    <td className="p-4 text-xs text-muted-foreground max-w-xs truncate">
                      Borderline communication score in round 1; committee recommended re-evaluation.
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {s.status}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/admin/students/${s.id}`}>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setRescheduleStudent(s)}
                          title="Reschedule Interview"
                          className="h-8 w-8 p-0 hover:bg-blue-500/10 hover:text-blue-400"
                        >
                          <Calendar className="w-4 h-4" />
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

      {/* Reschedule Modal */}
      {rescheduleStudent && (
        <Modal
          isOpen={!!rescheduleStudent}
          onClose={() => setRescheduleStudent(null)}
          title={`Reschedule Evaluation: ${rescheduleStudent.fullName}`}
        >
          <form onSubmit={handleReschedule} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-foreground">New Interview Slot Date</label>
              <Input
                type="date"
                value={newInterviewDate}
                onChange={(e) => setNewInterviewDate(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setRescheduleStudent(null)}>Cancel</Button>
              <Button type="submit" className="bg-primary text-white">Confirm Reschedule</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
