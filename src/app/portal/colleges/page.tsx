"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { College } from "@/types";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Drawer } from "@/components/common/Drawer";
import { Modal } from "@/components/common/Modal";
import {
  Building2,
  PlusCircle,
  Search,
  Filter,
  MapPin,
  Mail,
  Phone,
  GraduationCap,
  ExternalLink,
  FileText,
  FileCheck,
  ChevronRight,
  UploadCloud,
  MessageSquare,
  Award,
} from "lucide-react";
import { toast } from "sonner";

export default function CollegesPage() {
  const { colleges, addCollege, updateCollege } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [districtFilter, setDistrictFilter] = useState("all");
  const [tierFilter, setTierFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Drawer for 360° College Profile
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);

  // Modal for Adding a new College
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCollegeForm, setNewCollegeForm] = useState({
    name: "",
    collegeCode: "",
    vtuCode: "",
    universityCode: "",
    aisheCode: "C-1450",
    type: "Autonomous" as College["type"],
    district: "Bengaluru Urban",
    state: "Karnataka",
    address: "",
    website: "https://",
    establishedYear: 1995,
    naacGrade: "A+" as College["naacGrade"],
    nbaStatus: "Accredited" as College["nbaStatus"],
    tier: "Tier-1" as College["tier"],
    studentStrength: 4000,
    eligibleStudentsCount: 500,
    branchesAvailable: ["CSE", "ISE", "AIML", "ECE"],
    trainingMode: "Hybrid" as College["trainingMode"],
    status: "Active" as College["status"],
    principal: {
      name: "",
      email: "",
      mobile: "+91 ",
    },
    placementOfficer: {
      name: "",
      designation: "Head - Training & Placement",
      department: "Placement Cell",
      mobile: "+91 ",
      whatsapp: "+91 ",
      email: "",
    },
    placementCoordinator: {
      name: "",
      mobile: "+91 ",
      email: "",
    },
    facultyCoordinators: [],
    drivesParticipated: 1,
    studentsPlaced: 40,
    notes: "Recently onboarded engineering college under GQT skilling initiative.",
  });

  const districts = Array.from(new Set(colleges.map((c) => c.district))).sort();

  const filteredColleges = colleges.filter((c) => {
    const q = searchQuery.toLowerCase();
    const collegeCode = (c.collegeCode || c.vtuCode || "").toLowerCase();
    const matchesSearch =
      c.name.toLowerCase().includes(q) ||
      collegeCode.includes(q) ||
      c.district.toLowerCase().includes(q) ||
      c.principal.name.toLowerCase().includes(q) ||
      c.placementOfficer.name.toLowerCase().includes(q);

    const matchesDistrict = districtFilter === "all" || c.district === districtFilter;
    const matchesTier = tierFilter === "all" || c.tier === tierFilter;
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;

    return matchesSearch && matchesDistrict && matchesTier && matchesStatus;
  });

  const handleCreateCollege = (e: React.FormEvent) => {
    e.preventDefault();
    const code = (newCollegeForm.collegeCode || newCollegeForm.vtuCode).trim();
    if (!newCollegeForm.name || !code) {
      toast.error("Please enter college name and college code");
      return;
    }

    addCollege({
      ...newCollegeForm,
      collegeCode: code,
      vtuCode: code,
      universityCode: code,
    });
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-white tracking-tight">
            Karnataka College Network & CRM
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Enterprise database of 100+ Karnataka engineering colleges, MoUs, and academic leadership.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#007BFF] to-[#005BBB] text-white font-bold text-xs shadow-md hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Onboard College</span>
        </button>
      </div>

      {/* Search & Advanced Filters */}
      <div className="gqt-card p-4 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by college name, college code (e.g. 1RV, 1BM), district, or placement officer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-[#0F172A] dark:text-white focus:ring-2 focus:ring-[#005BBB]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* District Filter */}
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-[#0F172A] dark:text-white focus:outline-none"
            >
              <option value="all">All Districts ({districts.length})</option>
              {districts.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            {/* Tier Filter */}
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-[#0F172A] dark:text-white focus:outline-none"
            >
              <option value="all">All Tiers</option>
              <option value="Tier-1">Tier-1</option>
              <option value="Tier-2">Tier-2</option>
              <option value="Tier-3">Tier-3</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-[#0F172A] dark:text-white focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
              <option value="MoU Signed">MoU Signed</option>
              <option value="In Discussion">In Discussion</option>
              <option value="Contacted">Contacted</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
          <span>Showing {filteredColleges.length} of {colleges.length} institutions</span>
          <span className="font-semibold text-[#005BBB]">100% Accredited College Network</span>
        </div>
      </div>

      {/* College Directory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredColleges.map((college) => (
          <div
            key={college.id}
            onClick={() => setSelectedCollege(college)}
            className="gqt-card p-5 bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 flex flex-col justify-between hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg cursor-pointer transition-all group"
          >
            <div>
              {/* Top Bar: College Code & Status */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-[#005BBB] dark:text-blue-400 font-mono font-bold text-xs border border-blue-200 dark:border-blue-900">
                    {college.collegeCode || college.vtuCode}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {college.tier} • {college.type}
                  </span>
                </div>
                <StatusBadge status={college.status} size="sm" />
              </div>

              {/* College Name */}
              <h3 className="text-base font-bold text-[#0F172A] dark:text-white group-hover:text-[#005BBB] transition-colors leading-snug">
                {college.name}
              </h3>

              <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{college.district}, {college.state}</span>
              </div>

              {/* Badges: NAAC, NBA, Student Strength */}
              <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 font-semibold">
                  NAAC {college.naacGrade}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 font-semibold">
                  {college.nbaStatus}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 font-semibold">
                  {college.studentStrength} Students
                </span>
              </div>

              {/* Placement Officer & Principal */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Placement Head:</span>
                  <span className="font-semibold text-[#0F172A] dark:text-white truncate max-w-[170px]">
                    {college.placementOfficer.name}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Principal:</span>
                  <span className="font-semibold text-slate-600 dark:text-slate-300 truncate max-w-[170px]">
                    {college.principal.name}
                  </span>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-[#005BBB] font-bold">
                {college.studentsPlaced} Placed in GQT
              </span>
              <span className="text-xs font-semibold text-slate-400 group-hover:text-[#005BBB] flex items-center gap-1">
                View 360° Profile <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* College 360° Profile Slide-over Drawer */}
      <Drawer
        isOpen={!!selectedCollege}
        onClose={() => setSelectedCollege(null)}
        title={selectedCollege?.name}
        subtitle={`College Code: ${selectedCollege?.collegeCode || selectedCollege?.vtuCode} • ${selectedCollege?.district} • Established ${selectedCollege?.establishedYear}`}
        width="xl"
      >
        {selectedCollege && (
          <div className="space-y-6">
            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900">
                <span className="text-lg font-extrabold text-[#005BBB] block">
                  {selectedCollege.studentStrength}
                </span>
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Total Strength</span>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900">
                <span className="text-lg font-extrabold text-emerald-600 block">
                  {selectedCollege.eligibleStudentsCount}
                </span>
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Eligible CSR Pool</span>
              </div>
              <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900">
                <span className="text-lg font-extrabold text-purple-600 block">
                  {selectedCollege.studentsPlaced}
                </span>
                <span className="text-[10px] text-slate-500 font-semibold uppercase">GQT CSR Offers</span>
              </div>
            </div>

            {/* Academic Leadership Contacts */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Academic Leadership & Coordination Contacts
              </h4>

              {/* Placement Officer */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-1">
                  <h5 className="font-bold text-sm text-[#0F172A] dark:text-white">
                    {selectedCollege.placementOfficer.name}
                  </h5>
                  <span className="text-[10px] font-bold text-[#005BBB] bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-full">
                    Placement Head
                  </span>
                </div>
                <p className="text-xs text-slate-500">{selectedCollege.placementOfficer.designation}</p>
                <div className="mt-2.5 flex flex-wrap gap-3 text-xs text-slate-600 dark:text-slate-300">
                  <a
                    href={`tel:${selectedCollege.placementOfficer.mobile}`}
                    className="flex items-center gap-1 hover:text-[#005BBB]"
                  >
                    <Phone className="w-3.5 h-3.5" /> {selectedCollege.placementOfficer.mobile}
                  </a>
                  <a
                    href={`mailto:${selectedCollege.placementOfficer.email}`}
                    className="flex items-center gap-1 hover:text-[#005BBB]"
                  >
                    <Mail className="w-3.5 h-3.5" /> {selectedCollege.placementOfficer.email}
                  </a>
                </div>
              </div>

              {/* Principal */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-1">
                  <h5 className="font-bold text-sm text-[#0F172A] dark:text-white">
                    {selectedCollege.principal.name}
                  </h5>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                    Principal
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" /> {selectedCollege.principal.mobile}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" /> {selectedCollege.principal.email}
                  </span>
                </div>
              </div>
            </div>

            {/* MoU & Formal Accords */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Institutional Accord & MoU Status
              </h4>
              <div className="flex items-center justify-between text-xs">
                <span>MoU Status:</span>
                <span className="font-bold text-emerald-600">
                  {selectedCollege.mouSignedDate ? `Signed on ${selectedCollege.mouSignedDate}` : "Under Discussion"}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span>NAAC Accreditation:</span>
                <span className="font-bold">{selectedCollege.naacGrade}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span>Campus Training Mode:</span>
                <span className="font-bold text-[#005BBB]">{selectedCollege.trainingMode}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <Link
                href={`/portal/colleges/${selectedCollege.id}`}
                className="flex-1 py-2.5 rounded-xl bg-[#005BBB] text-white text-xs font-bold text-center hover:bg-blue-700 transition-colors"
              >
                Open Full Institutional Dossier
              </Link>
              <Link
                href={`/portal/crm?college=${selectedCollege.id}`}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#005BBB]" /> Log Call
              </Link>
            </div>
          </div>
        )}
      </Drawer>

      {/* Onboard New College Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Onboard New Karnataka College"
        subtitle="Add a new autonomous or university-affiliated institution to GQT CSR network"
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateCollege} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                College Full Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Cambridge Institute of Technology"
                value={newCollegeForm.name}
                onChange={(e) => setNewCollegeForm({ ...newCollegeForm, name: e.target.value })}
                className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-[#0F172A] dark:text-white focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase mb-1">
                College Code
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 1CD"
                value={newCollegeForm.collegeCode || newCollegeForm.vtuCode}
                onChange={(e) => {
                  const val = e.target.value.toUpperCase();
                  setNewCollegeForm({ ...newCollegeForm, collegeCode: val, vtuCode: val, universityCode: val });
                }}
                className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-[#0F172A] dark:text-white focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase mb-1">
                District
              </label>
              <select
                value={newCollegeForm.district}
                onChange={(e) => setNewCollegeForm({ ...newCollegeForm, district: e.target.value })}
                className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-[#0F172A] dark:text-white focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
              >
                {districts.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase mb-1">
                Placement Head Name
              </label>
              <input
                type="text"
                placeholder="Dr. Placement Head"
                value={newCollegeForm.placementOfficer.name}
                onChange={(e) =>
                  setNewCollegeForm({
                    ...newCollegeForm,
                    placementOfficer: { ...newCollegeForm.placementOfficer, name: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-[#0F172A] dark:text-white focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase mb-1">
                Placement Head Mobile
              </label>
              <input
                type="text"
                placeholder="+91 98450 12345"
                value={newCollegeForm.placementOfficer.mobile}
                onChange={(e) =>
                  setNewCollegeForm({
                    ...newCollegeForm,
                    placementOfficer: { ...newCollegeForm.placementOfficer, mobile: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-[#0F172A] dark:text-white focus:ring-2 focus:ring-[#005BBB] focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-xl border text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-[#005BBB] text-white text-xs font-bold hover:bg-blue-700"
            >
              Onboard College
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
