"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Clock,
  Users,
  Search,
  Filter,
  Calendar,
  Building2,
  RotateCcw,
  Archive,
  PhoneCall,
  AlertTriangle
} from "lucide-react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

interface NotAttendedStudent {
  id: string;
  studentId: string;
  name: string;
  photo: string;
  college: string;
  branch: string;
  roundMissed: "Online Assessment" | "Technical Interview Round 1" | "HR Round";
  missedDate: string;
  reason: string;
  contactPhone: string;
}

const INITIAL_NOT_ATTENDED: NotAttendedStudent[] = [
  {
    id: "STU-8826",
    studentId: "GQT-2026-STU-8826",
    name: "Vikram Rathi",
    photo: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=120",
    college: "BMS College of Engineering",
    branch: "Mechanical Engg",
    roundMissed: "Online Assessment",
    missedDate: "2026-09-24",
    reason: "Hospitalization due to viral fever. Medical certificate submitted to placement officer.",
    contactPhone: "+91 96112 33499",
  },
  {
    id: "STU-8838",
    studentId: "GQT-2026-STU-8838",
    name: "Harish Gowda",
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120",
    college: "RV College of Engineering",
    branch: "Civil Engg",
    roundMissed: "Technical Interview Round 1",
    missedDate: "2026-09-23",
    reason: "Severe power cut in hometown during assigned Google Meet time slot.",
    contactPhone: "+91 98450 44102",
  },
];

export default function HRNotAttendedPage() {
  const [students, setStudents] = useState<NotAttendedStudent[]>(INITIAL_NOT_ATTENDED);
  const [searchQuery, setSearchQuery] = useState("");
  const [rescheduleStudent, setRescheduleStudent] = useState<NotAttendedStudent | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState("2026-09-27");
  const [rescheduleTime, setRescheduleTime] = useState("02:00 PM");

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.reason.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConfirmReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (rescheduleStudent) {
      toast.success(
        `Rescheduled ${rescheduleStudent.roundMissed} for ${rescheduleStudent.name} on ${rescheduleDate} at ${rescheduleTime}. Dispatched WhatsApp pass!`
      );
      setStudents((prev) => prev.filter((s) => s.id !== rescheduleStudent.id));
      setRescheduleStudent(null);
    }
  };

  const handleArchive = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    toast.info("Candidate archived to absent records.");
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-gradient-to-r from-[#001B4D] via-[#003366] to-[#005BBB] text-white p-6 rounded-2xl shadow-xl border border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#14B8FF]/20 text-[#14B8FF] border border-[#14B8FF]/30">
              Absenteeism & Rescheduling
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Not Attended Candidates</h1>
          <p className="text-white/80 text-sm mt-1 max-w-2xl">
            Candidates who missed their scheduled online examination or technical interview rounds due to power, health, or college university lab clashes.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <Card className="p-4 bg-white border border-slate-200 shadow-sm rounded-xl">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Student Name, ID, Reason..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005BBB] text-slate-800"
          />
        </div>
      </Card>

      {/* Table */}
      <Card className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Candidate</th>
                <th className="py-3 px-3">College & Branch</th>
                <th className="py-3 px-3">Round Missed</th>
                <th className="py-3 px-3">Missed Date</th>
                <th className="py-3 px-3">Documented Reason</th>
                <th className="py-3 px-3">Contact Phone</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={item.photo}
                        alt={item.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <div className="font-bold text-slate-900">{item.name}</div>
                        <div className="text-[10px] font-mono text-slate-400">{item.studentId}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-3 text-slate-700">
                    <div className="font-semibold text-slate-800">{item.college}</div>
                    <div className="text-[10px] text-slate-500">{item.branch}</div>
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                      {item.roundMissed}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-slate-600 font-mono">
                    {item.missedDate}
                  </td>

                  <td className="py-3.5 px-3 text-slate-600 max-w-[240px] truncate" title={item.reason}>
                    {item.reason}
                  </td>

                  <td className="py-3.5 px-3 text-slate-700 font-mono">
                    {item.contactPhone}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="cyan"
                        size="sm"
                        className="text-xs h-7 px-2"
                        onClick={() => setRescheduleStudent(item)}
                      >
                        <RotateCcw className="w-3.5 h-3.5 mr-1" />
                        Reschedule Slot
                      </Button>
                      <button
                        onClick={() => handleArchive(item.id)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md"
                        title="Archive"
                      >
                        <Archive className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Reschedule Modal */}
      {rescheduleStudent && (
        <Modal
          isOpen={!!rescheduleStudent}
          onClose={() => setRescheduleStudent(null)}
          title={`Reschedule ${rescheduleStudent.roundMissed}`}
          subtitle={`Candidate: ${rescheduleStudent.name} (${rescheduleStudent.studentId}) • ${rescheduleStudent.college}`}
          size="md"
        >
          <form onSubmit={handleConfirmReschedule} className="space-y-4 text-xs">
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
              <span className="font-bold text-amber-900 block mb-0.5">Recorded Reason for Absence:</span>
              <p className="text-amber-800">{rescheduleStudent.reason}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">New Date *</label>
                <input
                  type="date"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">New Time Slot *</label>
                <input
                  type="text"
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
              <Button variant="outline" type="button" onClick={() => setRescheduleStudent(null)}>
                Cancel
              </Button>
              <Button variant="cyan" type="submit">
                Confirm & Re-dispatch Link
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
