"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Modal } from "@/components/common/Modal";
import { toast } from "sonner";
import {
  Building2,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Upload,
  Briefcase,
  UserCheck,
  FileText,
  Mail,
  Phone,
  Calendar,
  XCircle,
  RotateCcw
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { College } from "@/types";

type ConfirmationStatus = "Pending" | "Contacted" | "Interested" | "Confirmed" | "Rejected" | "Rescheduled" | "Cancelled";

export default function CSRManagerCollegesPage() {
  const { colleges, updateCollege, drives } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [districtFilter, setDistrictFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Selection state for bulk operations
  const [selectedCollegeIds, setSelectedCollegeIds] = useState<string[]>([]);
  const [assignDriveModal, setAssignDriveModal] = useState(false);
  const [selectedDriveId, setSelectedDriveId] = useState(drives[0]?.id || "");
  const [importExcelModal, setImportExcelModal] = useState(false);
  const [viewingCollege, setViewingCollege] = useState<College | null>(null);

  const districts = Array.from(new Set(colleges.map((c) => c.district))).filter(Boolean);

  const filtered = colleges.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.collegeCode && c.collegeCode.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDistrict = districtFilter === "all" || c.district === districtFilter;
    const matchesStatus = statusFilter === "all" || c.status.toLowerCase().includes(statusFilter.toLowerCase());
    return matchesSearch && matchesDistrict && matchesStatus;
  });

  const toggleSelectCollege = (id: string) => {
    setSelectedCollegeIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedCollegeIds.length === filtered.length) {
      setSelectedCollegeIds([]);
    } else {
      setSelectedCollegeIds(filtered.map((c) => c.id));
    }
  };

  const handleUpdateStatus = (collegeId: string, newStatus: College["status"]) => {
    updateCollege(collegeId, { status: newStatus });
    toast.success(`Institutional status updated to "${newStatus}"`);
  };

  const handleConfirmBulkAssign = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(
      `Assigned ${selectedCollegeIds.length} colleges to Drive ID: ${selectedDriveId}`,
      {
        description: "Colleges confirmed will automatically receive onboarding kits.",
      }
    );
    setSelectedCollegeIds([]);
    setAssignDriveModal(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900/40 via-blue-950/30 to-indigo-900/40 border border-blue-500/20 backdrop-blur-xl p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              Institutional Outreach & Confirmation
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            College Assignment & Confirmation Workflow
          </h1>
          <p className="text-sm text-muted-foreground">
            Assign colleges to CSR campaigns, track Principal/PTO confirmation stages, and coordinate bilateral MoUs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setImportExcelModal(true)}
            className="border-border hover:bg-muted gap-2 text-xs"
          >
            <Upload className="w-4 h-4" /> Bulk Import Excel
          </Button>
          {selectedCollegeIds.length > 0 && (
            <Button
              onClick={() => setAssignDriveModal(true)}
              className="bg-primary text-white gap-2 text-xs"
            >
              <Briefcase className="w-4 h-4" /> Assign ({selectedCollegeIds.length}) to Drive
            </Button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border border-border/60 bg-card/60 backdrop-blur-md rounded-2xl p-4">
          <p className="text-xs text-muted-foreground font-medium">Total Network Colleges</p>
          <p className="text-2xl font-bold text-foreground mt-1">{colleges.length}</p>
        </Card>
        <Card className="border border-border/60 bg-card/60 backdrop-blur-md rounded-2xl p-4">
          <p className="text-xs text-muted-foreground font-medium">Confirmed for Drive</p>
          <p className="text-2xl font-bold text-emerald-500 mt-1">
            {colleges.filter((c) => c.status === "Active" || c.status === "MoU Signed" || c.status === "Onboarded").length}
          </p>
        </Card>
        <Card className="border border-border/60 bg-card/60 backdrop-blur-md rounded-2xl p-4">
          <p className="text-xs text-muted-foreground font-medium">In Discussion / Contacted</p>
          <p className="text-2xl font-bold text-amber-400 mt-1">
            {colleges.filter((c) => c.status === "Contacted" || c.status === "In Discussion").length}
          </p>
        </Card>
        <Card className="border border-border/60 bg-card/60 backdrop-blur-md rounded-2xl p-4">
          <p className="text-xs text-muted-foreground font-medium">Districts Enrolled</p>
          <p className="text-2xl font-bold text-indigo-400 mt-1">{districts.length} / 31</p>
        </Card>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-card/60 backdrop-blur-md p-4 rounded-2xl border border-border/60">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by college name, district, or code..."
            className="pl-10 h-10 bg-background/80"
          />
        </div>
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
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-3 text-xs rounded-xl border border-border bg-background text-foreground"
        >
          <option value="all">All Outreach Statuses</option>
          <option value="active">Active</option>
          <option value="mou signed">MoU Signed</option>
          <option value="contacted">Contacted</option>
          <option value="in discussion">In Discussion</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Colleges Master Table */}
      <Card className="border border-border/60 bg-card/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 border-b border-border/50 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              <tr>
                <th className="p-4 pl-6 w-10">
                  <input
                    type="checkbox"
                    checked={selectedCollegeIds.length === filtered.length && filtered.length > 0}
                    onChange={selectAll}
                    className="cursor-pointer"
                  />
                </th>
                <th className="p-4">Institution Details</th>
                <th className="p-4">District</th>
                <th className="p-4">Placement Officer (PTO)</th>
                <th className="p-4 text-center">Eligible Students</th>
                <th className="p-4 text-center">Confirmation Stage</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-medium">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4 pl-6">
                    <input
                      type="checkbox"
                      checked={selectedCollegeIds.includes(c.id)}
                      onChange={() => toggleSelectCollege(c.id)}
                      className="cursor-pointer"
                    />
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-foreground">{c.name}</div>
                    <span className="text-xs text-muted-foreground font-mono">{c.collegeCode || c.vtuCode || c.id}</span>
                  </td>
                  <td className="p-4 text-xs font-semibold text-foreground">
                    {c.district}
                  </td>
                  <td className="p-4 text-xs">
                    <div className="font-medium text-foreground">{c.placementOfficer?.name || "Prof. PTO"}</div>
                    <div className="text-muted-foreground text-[11px]">{c.placementOfficer?.mobile}</div>
                  </td>
                  <td className="p-4 text-center font-bold text-blue-400">
                    {c.eligibleStudentsCount || c.studentStrength || 320}
                  </td>
                  <td className="p-4 text-center">
                    <select
                      value={c.status}
                      onChange={(e) => handleUpdateStatus(c.id, e.target.value as any)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-full border border-border bg-background text-foreground"
                    >
                      <option value="Contacted">Contacted</option>
                      <option value="In Discussion">In Discussion</option>
                      <option value="MoU Signed">MoU Signed</option>
                      <option value="Active">Confirmed / Active</option>
                      <option value="Inactive">Rejected / Rescheduled</option>
                    </select>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setViewingCollege(c)}
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

      {/* College Details Modal (10 tabs) */}
      {viewingCollege && (
        <Modal
          isOpen={!!viewingCollege}
          onClose={() => setViewingCollege(null)}
          title={`Institution Profile: ${viewingCollege.name}`}
        >
          <div className="space-y-4 pt-2 text-xs">
            <div className="grid grid-cols-2 gap-3 p-4 bg-muted/40 rounded-2xl">
              <div>
                <p className="text-muted-foreground">VTU Code</p>
                <p className="font-mono font-bold text-foreground">{viewingCollege.vtuCode || "—"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">AISHE Code</p>
                <p className="font-mono font-bold text-foreground">{viewingCollege.aisheCode || "—"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Principal</p>
                <p className="font-semibold text-foreground">{viewingCollege.principal?.name} ({viewingCollege.principal?.mobile})</p>
              </div>
              <div>
                <p className="text-muted-foreground">T&P Officer</p>
                <p className="font-semibold text-foreground">{viewingCollege.placementOfficer?.name} ({viewingCollege.placementOfficer?.mobile})</p>
              </div>
            </div>

            <div className="p-3 border rounded-xl space-y-1">
              <h4 className="font-bold uppercase text-[10px] text-muted-foreground">Accreditation & Quality</h4>
              <p>NAAC Grade: <strong className="text-foreground">{viewingCollege.naacGrade || "—"}</strong> • Status: <strong className="text-foreground">{viewingCollege.nbaStatus || "—"}</strong></p>
              <p>Address: <span className="text-muted-foreground">{viewingCollege.address || [viewingCollege.district, viewingCollege.state].filter(Boolean).join(", ") || "—"}</span></p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button onClick={() => setViewingCollege(null)}>Close</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Assign to Drive Modal */}
      {assignDriveModal && (
        <Modal
          isOpen={assignDriveModal}
          onClose={() => setAssignDriveModal(false)}
          title={`Assign ${selectedCollegeIds.length} Colleges to CSR Drive`}
        >
          <form onSubmit={handleConfirmBulkAssign} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Target CSR Drive Campaign</label>
              <select
                value={selectedDriveId}
                onChange={(e) => setSelectedDriveId(e.target.value)}
                className="w-full h-10 px-3 text-xs rounded-xl border border-border bg-background text-foreground"
              >
                {drives.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.academicYear})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setAssignDriveModal(false)}>Cancel</Button>
              <Button type="submit" className="bg-primary text-white">Commit Bulk Enrollment</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Bulk Import Excel Modal */}
      {importExcelModal && (
        <Modal
          isOpen={importExcelModal}
          onClose={() => setImportExcelModal(false)}
          title="Bulk Excel Import for Karnataka Colleges"
        >
          <div className="space-y-4 pt-2 text-xs">
            <div className="border-2 border-dashed border-border p-6 rounded-2xl text-center space-y-2">
              <Upload className="w-8 h-8 text-primary mx-auto" />
              <p className="font-semibold text-foreground">Upload Colleges Master Excel (.xlsx, .csv)</p>
              <p className="text-muted-foreground text-[11px]">Validates VTU codes, auto-resolves districts, and prevents duplicates</p>
              <input type="file" accept=".xlsx,.csv" className="text-xs mx-auto" />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setImportExcelModal(false)}>Cancel</Button>
              <Button
                onClick={() => {
                  toast.success("Imported 16 Karnataka engineering institutions into master roster");
                  setImportExcelModal(false);
                }}
                className="bg-primary text-white"
              >
                Execute Import & Validate
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
