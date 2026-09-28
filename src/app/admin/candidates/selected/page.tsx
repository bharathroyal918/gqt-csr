"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Modal } from "@/components/common/Modal";
import { toast } from "sonner";
import {
  CheckCircle2,
  Search,
  Filter,
  Download,
  Mail,
  Award,
  Building2,
  GraduationCap,
  Eye,
  Send,
  Sparkles
} from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function AdminSelectedCandidatesPage() {
  const { students, updateStudent } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [collegeFilter, setCollegeFilter] = useState("all");
  const [districtFilter, setDistrictFilter] = useState("all");
  const [generateOfferStudent, setGenerateOfferStudent] = useState<any | null>(null);

  // Filter students who are Selected or Offer sent/accepted
  const selectedStudents = students.filter(
    (s) =>
      s.status === "HR Selected" ||
      s.status === "Offer Sent" ||
      s.status === "Offer Accepted"
  );

  const colleges = Array.from(new Set(selectedStudents.map((s) => s.collegeName))).filter(Boolean);
  const districts = Array.from(new Set(selectedStudents.map((s) => s.district))).filter(Boolean);

  const filtered = selectedStudents.filter((s) => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.usn.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCollege = collegeFilter === "all" || s.collegeName === collegeFilter;
    const matchesDistrict = districtFilter === "all" || s.district === districtFilter;
    return matchesSearch && matchesCollege && matchesDistrict;
  });

  const handleExport = () => {
    const csv = "ID,Name,USN,College,Branch,District,Status,Score\n" +
      filtered.map(s => `"${s.studentId}","${s.fullName}","${s.usn}","${s.collegeName}","${s.branch}","${s.district}","${s.status}",${s.examResult?.marksObtained || 45}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `GQT_Selected_Candidates_${Date.now()}.csv`;
    a.click();
    toast.success("Selected candidates list exported");
  };

  const handleSendNotification = (student: any) => {
    toast.success(`Selection congratulatory dispatch queued for ${student.fullName}`);
  };

  const handleConfirmOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!generateOfferStudent) return;
    updateStudent(generateOfferStudent.id, { status: "Offer Sent" });
    toast.success(`Corporate LOI & Offer Letter issued to ${generateOfferStudent.fullName}`);
    setGenerateOfferStudent(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-emerald-950/40 via-blue-950/30 to-indigo-950/40 border border-emerald-500/20 backdrop-blur-xl p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Shortlisted Talent
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Selected Candidates Master View
          </h1>
          <p className="text-sm text-muted-foreground">
            Dedicated registry of candidates who cleared technical testing and HR evaluations. Release offer letters and bulk dispatch onboarding invites.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={handleExport} variant="outline" className="border-border hover:bg-muted gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border border-border/60 bg-card/60 backdrop-blur-md rounded-2xl">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground font-medium">Total Selected</p>
            <p className="text-2xl font-bold text-emerald-500 mt-1">{selectedStudents.length}</p>
          </CardContent>
        </Card>
        <Card className="border border-border/60 bg-card/60 backdrop-blur-md rounded-2xl">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground font-medium">Offers Released</p>
            <p className="text-2xl font-bold text-blue-400 mt-1">
              {selectedStudents.filter((s) => s.status.includes("Offer")).length}
            </p>
          </CardContent>
        </Card>
        <Card className="border border-border/60 bg-card/60 backdrop-blur-md rounded-2xl">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground font-medium">Offers Accepted</p>
            <p className="text-2xl font-bold text-purple-400 mt-1">
              {selectedStudents.filter((s) => s.status === "Offer Accepted").length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-card/60 backdrop-blur-md p-4 rounded-2xl border border-border/60">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by student name or USN..."
            className="pl-10 h-10 bg-background/80"
          />
        </div>
        <select
          value={collegeFilter}
          onChange={(e) => setCollegeFilter(e.target.value)}
          className="h-10 px-3 text-xs rounded-xl border border-border bg-background text-foreground"
        >
          <option value="all">All Colleges</option>
          {colleges.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={districtFilter}
          onChange={(e) => setDistrictFilter(e.target.value)}
          className="h-10 px-3 text-xs rounded-xl border border-border bg-background text-foreground"
        >
          <option value="all">All Districts</option>
          {districts.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <Card className="border border-border/60 bg-card/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 border-b border-border/50 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              <tr>
                <th className="p-4 pl-6">Candidate</th>
                <th className="p-4">College & District</th>
                <th className="p-4">Branch & CGPA</th>
                <th className="p-4 text-center">Exam Score</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-medium">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="font-bold text-foreground">{s.fullName}</div>
                    <div className="text-xs text-muted-foreground font-mono">{s.usn}</div>
                  </td>
                  <td className="p-4 text-xs">
                    <div className="font-semibold text-foreground">{s.collegeName}</div>
                    <div className="text-muted-foreground">{s.district}</div>
                  </td>
                  <td className="p-4 text-xs">
                    <div className="text-primary font-medium">{s.branch}</div>
                    <div className="text-muted-foreground">{s.cgpa || 8.2} CGPA ({s.percentage}%)</div>
                  </td>
                  <td className="p-4 text-center font-bold text-foreground">
                    {s.examResult?.marksObtained || 44} / 50
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
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
                        onClick={() => handleSendNotification(s)}
                        title="Send WhatsApp Alert"
                        className="h-8 w-8 p-0 hover:bg-blue-500/10 hover:text-blue-400"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setGenerateOfferStudent(s)}
                        title="Issue Offer Letter"
                        className="h-8 w-8 p-0 hover:bg-emerald-500/10 hover:text-emerald-400"
                      >
                        <Award className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Offer Modal */}
      {generateOfferStudent && (
        <Modal
          isOpen={!!generateOfferStudent}
          onClose={() => setGenerateOfferStudent(null)}
          title={`Generate Offer Letter: ${generateOfferStudent.fullName}`}
        >
          <form onSubmit={handleConfirmOffer} className="space-y-4 pt-2">
            <div className="p-4 bg-muted/40 rounded-2xl space-y-2 text-xs">
              <p><strong className="text-foreground">Candidate USN:</strong> {generateOfferStudent.usn}</p>
              <p><strong className="text-foreground">College:</strong> {generateOfferStudent.collegeName}</p>
              <p><strong className="text-foreground">Role:</strong> Associate Software Engineer Trainee</p>
              <p><strong className="text-foreground">Base Package:</strong> ₹4,50,000 PA</p>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setGenerateOfferStudent(null)}>Cancel</Button>
              <Button type="submit" className="bg-emerald-600 text-white hover:bg-emerald-700">Release Offer</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
