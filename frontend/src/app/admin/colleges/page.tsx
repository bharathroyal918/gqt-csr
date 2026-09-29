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
  Building2,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  UserCheck,
  Briefcase,
  FileUp,
  PowerOff,
  Power,
  GraduationCap,
  MapPin,
  Mail,
  Phone,
  CheckCircle2,
  XCircle,
  Download
} from "lucide-react";
import { College } from "@/types";

export default function AdminCollegesPage() {
  const { colleges, updateCollege, addCollege, drives } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [districtFilter, setDistrictFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modals
  const [viewingCollege, setViewingCollege] = useState<College | null>(null);
  const [assignHrCollege, setAssignHrCollege] = useState<College | null>(null);
  const [assignDriveCollege, setAssignDriveCollege] = useState<College | null>(null);
  const [uploadMouCollege, setUploadMouCollege] = useState<College | null>(null);
  const [selectedHr, setSelectedHr] = useState("Hitha, Kusuma");
  const [selectedDrive, setSelectedDrive] = useState(drives[0]?.id || "");
  const [mouFile, setMouFile] = useState<File | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // New College State
  const [newCollegeData, setNewCollegeData] = useState({
    name: "",
    collegeCode: "",
    vtuCode: "",
    aisheCode: "",
    district: "",
    state: "",
    principalName: "",
    principalEmail: "",
    principalPhone: "",
    ptoName: "",
    ptoEmail: "",
    ptoPhone: "",
  });

  const districts = Array.from(new Set(colleges.map((c) => c.district))).filter(Boolean);

  const filteredColleges = colleges.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.collegeCode && c.collegeCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.vtuCode && c.vtuCode.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDistrict = districtFilter === "all" || c.district === districtFilter;
    const matchesStatus = statusFilter === "all" || c.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesDistrict && matchesStatus;
  });

  const handleToggleStatus = (college: College) => {
    const nextStatus = college.status === "Inactive" ? "Active" : "Inactive";
    updateCollege(college.id, { status: nextStatus });
    toast.success(`College status set to ${nextStatus}`);
  };

  const handleAssignHr = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignHrCollege) return;
    toast.success(`Assigned Lead HR "${selectedHr}" to ${assignHrCollege.name}`);
    setAssignHrCollege(null);
  };

  const handleAssignDrive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignDriveCollege) return;
    toast.success(`College enrolled in Drive ID: ${selectedDrive}`);
    setAssignDriveCollege(null);
  };

  const handleUploadMou = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadMouCollege) return;
    updateCollege(uploadMouCollege.id, { status: "MoU Signed" });
    toast.success(`Institutional MoU uploaded and verified for ${uploadMouCollege.name}`);
    setUploadMouCollege(null);
  };

  const handleCreateCollege = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollegeData.name) {
      toast.error("College name is required");
      return;
    }
    const newCol: College = {
      id: `col-${Date.now().toString().slice(-4)}`,
      name: newCollegeData.name,
      collegeCode: newCollegeData.collegeCode || "",
      vtuCode: newCollegeData.vtuCode || "",
      aisheCode: newCollegeData.aisheCode || "",
      type: "VTU Affiliated",
      district: newCollegeData.district,
      state: newCollegeData.state,
      address: `${newCollegeData.name}${newCollegeData.district ? `, ${newCollegeData.district}` : ""}`,
      website: "",
      establishedYear: 2005,
      naacGrade: "A",
      nbaStatus: "Accredited",
      tier: "Tier-2",
      studentStrength: 0,
      eligibleStudentsCount: 0,
      branchesAvailable: [],
      trainingMode: "Hybrid",
      status: "Active",
      principal: {
        name: newCollegeData.principalName || "",
        email: newCollegeData.principalEmail || "",
        mobile: newCollegeData.principalPhone || "",
      },
      placementOfficer: {
        name: newCollegeData.ptoName || "",
        designation: "Training & Placement Officer",
        department: "Placement Cell",
        email: newCollegeData.ptoEmail || "",
        mobile: newCollegeData.ptoPhone || "",
        whatsapp: newCollegeData.ptoPhone || "",
      },
      placementCoordinator: {
        name: newCollegeData.ptoName || "",
        mobile: newCollegeData.ptoPhone || "",
        email: newCollegeData.ptoEmail || "",
      },
      facultyCoordinators: [],
      drivesParticipated: 1,
      studentsPlaced: 0,
    };
    addCollege(newCol);
    setIsCreateOpen(false);
    toast.success(`College "${newCol.name}" added to master database`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900/40 via-blue-950/30 to-indigo-900/40 border border-blue-500/20 backdrop-blur-xl p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              Institutional Network
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            College Master Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage Karnataka engineering institutions, track VTU/AISHE credentials, sign MoUs, and assign regional HR coordinators.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-blue-500/25 gap-2"
          >
            <Plus className="w-4 h-4" />
            Add College
          </Button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border border-border/60 bg-card/60 backdrop-blur-md rounded-2xl">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground font-medium">Total Colleges</p>
            <p className="text-2xl font-bold text-foreground mt-1">{colleges.length}</p>
          </CardContent>
        </Card>
        <Card className="border border-border/60 bg-card/60 backdrop-blur-md rounded-2xl">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground font-medium">MoU Executed / Active</p>
            <p className="text-2xl font-bold text-emerald-500 mt-1">
              {colleges.filter((c) => c.status === "Active" || c.status === "MoU Signed" || c.status === "Onboarded").length}
            </p>
          </CardContent>
        </Card>
        <Card className="border border-border/60 bg-card/60 backdrop-blur-md rounded-2xl">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground font-medium">Districts Covered</p>
            <p className="text-2xl font-bold text-blue-400 mt-1">{districts.length} / 31</p>
          </CardContent>
        </Card>
        <Card className="border border-border/60 bg-card/60 backdrop-blur-md rounded-2xl">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground font-medium">Inactive / On Hold</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">
              {colleges.filter((c) => c.status === "Inactive" || c.status === "Contacted").length}
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
            placeholder="Search by college name, code, or VTU ID..."
            className="pl-10 h-10 bg-background/80"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="h-10 px-3 text-xs rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary outline-none"
          >
            <option value="all">All Districts</option>
            {districts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 text-xs rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="mou signed">MoU Signed</option>
            <option value="onboarded">Onboarded</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Colleges Master Table */}
      <Card className="border border-border/60 bg-card/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 border-b border-border/50 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              <tr>
                <th className="p-4 pl-6">College Details</th>
                <th className="p-4">VTU / AISHE</th>
                <th className="p-4">District</th>
                <th className="p-4">Principal Contact</th>
                <th className="p-4">Placement Officer</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Eligible Students</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-medium">
              {filteredColleges.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-muted-foreground">
                    No colleges match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredColleges.map((col) => (
                  <tr key={col.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="font-bold text-foreground">{col.name}</div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="font-mono text-primary font-semibold">{col.collegeCode || col.id}</span>
                        <span>•</span>
                        <span>{col.type}</span>
                      </div>
                    </td>
                    <td className="p-4 text-xs font-mono">
                      <div>VTU: <span className="text-foreground font-semibold">{col.vtuCode || "1VTU"}</span></div>
                      <div className="text-muted-foreground text-[11px]">AISHE: {col.aisheCode || "C-12345"}</div>
                    </td>
                    <td className="p-4 text-xs">
                      <div className="font-semibold text-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-rose-400" />
                        {col.district}
                      </div>
                      <div className="text-muted-foreground text-[11px]">{col.state}</div>
                    </td>
                    <td className="p-4 text-xs">
                      <div className="font-medium text-foreground">{col.principal?.name || "Dr. Principal"}</div>
                      <div className="text-muted-foreground text-[11px]">{col.principal?.mobile}</div>
                    </td>
                    <td className="p-4 text-xs">
                      <div className="font-medium text-foreground">{col.placementOfficer?.name || "Prof. PTO"}</div>
                      <div className="text-muted-foreground text-[11px]">{col.placementOfficer?.mobile}</div>
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-semibold border ${col.status === "Active" || col.status === "MoU Signed" || col.status === "Onboarded"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : col.status === "Inactive"
                            ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          }`}
                      >
                        {col.status}
                      </span>
                    </td>
                    <td className="p-4 text-center font-bold text-foreground">
                      {col.eligibleStudentsCount || col.studentStrength || 350}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setViewingCollege(col)}
                          title="View College Profile"
                          className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setAssignHrCollege(col)}
                          title="Assign HR Recruiter"
                          className="h-8 w-8 p-0 hover:bg-blue-500/10 hover:text-blue-400"
                        >
                          <UserCheck className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setAssignDriveCollege(col)}
                          title="Assign CSR Drive"
                          className="h-8 w-8 p-0 hover:bg-indigo-500/10 hover:text-indigo-400"
                        >
                          <Briefcase className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setUploadMouCollege(col)}
                          title="Upload Signed MoU"
                          className="h-8 w-8 p-0 hover:bg-emerald-500/10 hover:text-emerald-400"
                        >
                          <FileUp className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleToggleStatus(col)}
                          title={col.status === "Inactive" ? "Activate College" : "Disable College"}
                          className={`h-8 w-8 p-0 ${col.status === "Inactive"
                            ? "hover:bg-emerald-500/10 text-emerald-500"
                            : "hover:bg-amber-500/10 text-amber-500"
                            }`}
                        >
                          {col.status === "Inactive" ? <Power className="w-4 h-4" /> : <PowerOff className="w-4 h-4" />}
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

      {/* College View Modal */}
      {viewingCollege && (
        <Modal
          isOpen={!!viewingCollege}
          onClose={() => setViewingCollege(null)}
          title={`Institutional Master: ${viewingCollege.name}`}
        >
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3 p-4 bg-muted/40 rounded-2xl">
              <div>
                <p className="text-xs text-muted-foreground">College / VTU Code</p>
                <p className="text-xs font-bold text-foreground font-mono">{viewingCollege.collegeCode} / {viewingCollege.vtuCode}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">AISHE Code</p>
                <p className="text-xs font-bold text-foreground font-mono">{viewingCollege.aisheCode || "C-51921"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">District / State</p>
                <p className="text-xs font-semibold text-foreground">{viewingCollege.district}, {viewingCollege.state}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Accreditation</p>
                <p className="text-xs font-semibold text-foreground">NAAC {viewingCollege.naacGrade || "A+"} • {viewingCollege.nbaStatus || "NBA Accredited"}</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Principal</h4>
              <p className="text-sm font-semibold">{viewingCollege.principal?.name}</p>
              <p className="text-xs text-muted-foreground">{viewingCollege.principal?.email} • {viewingCollege.principal?.mobile}</p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Placement Officer (PTO)</h4>
              <p className="text-sm font-semibold">{viewingCollege.placementOfficer?.name} ({viewingCollege.placementOfficer?.designation})</p>
              <p className="text-xs text-muted-foreground">{viewingCollege.placementOfficer?.email} • {viewingCollege.placementOfficer?.mobile}</p>
            </div>

            <div className="flex justify-end pt-3">
              <Button onClick={() => setViewingCollege(null)}>Close</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Assign HR Modal */}
      {assignHrCollege && (
        <Modal
          isOpen={!!assignHrCollege}
          onClose={() => setAssignHrCollege(null)}
          title={`Assign Dedicated HR: ${assignHrCollege.name}`}
        >
          <form onSubmit={handleAssignHr} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">Select HR Executive</label>
              <select
                value={selectedHr}
                onChange={(e) => setSelectedHr(e.target.value)}
                className="w-full h-10 px-3 text-xs rounded-xl border border-border bg-background text-foreground"
              >
                <option value="Hitha, Kusuma">Hitha, Kusuma (Senior HR Recruiter)</option>
                <option value="Divya.H">Divya.H (Technical Recruiter)</option>
                <option value="Kiran">Kiran (CSR Program Lead)</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setAssignHrCollege(null)}>Cancel</Button>
              <Button type="submit" className="bg-primary text-white">Confirm Assignment</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Assign Drive Modal */}
      {assignDriveCollege && (
        <Modal
          isOpen={!!assignDriveCollege}
          onClose={() => setAssignDriveCollege(null)}
          title={`Enroll ${assignDriveCollege.name} in CSR Drive`}
        >
          <form onSubmit={handleAssignDrive} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">Active CSR Drive</label>
              <select
                value={selectedDrive}
                onChange={(e) => setSelectedDrive(e.target.value)}
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
              <Button type="button" variant="outline" onClick={() => setAssignDriveCollege(null)}>Cancel</Button>
              <Button type="submit" className="bg-primary text-white">Enroll College</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Upload MoU Modal */}
      {uploadMouCollege && (
        <Modal
          isOpen={!!uploadMouCollege}
          onClose={() => setUploadMouCollege(null)}
          title={`Upload Signed Institutional MoU: ${uploadMouCollege.name}`}
        >
          <form onSubmit={handleUploadMou} className="space-y-4 pt-2">
            <div className="border-2 border-dashed border-border p-6 rounded-2xl text-center space-y-2 hover:border-primary/50 transition-colors">
              <FileUp className="w-8 h-8 text-primary mx-auto" />
              <div className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">Click to select PDF</span> or drag signed document here
              </div>
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={(e) => setMouFile(e.target.files?.[0] || null)}
                className="text-xs text-muted-foreground mx-auto"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setUploadMouCollege(null)}>Cancel</Button>
              <Button type="submit" className="bg-emerald-600 text-white hover:bg-emerald-700">Upload & Verify MoU</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add College Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Add New Institution to CSR Network"
      >
        <form onSubmit={handleCreateCollege} className="space-y-3 pt-2">
          <div>
            <label className="text-xs font-semibold text-foreground">College Name *</label>
            <Input
              value={newCollegeData.name}
              onChange={(e) => setNewCollegeData({ ...newCollegeData, name: e.target.value })}
              placeholder="e.g. Dayananda Sagar College of Engineering"
              required
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs font-semibold text-foreground">College Code</label>
              <Input
                value={newCollegeData.collegeCode}
                onChange={(e) => setNewCollegeData({ ...newCollegeData, collegeCode: e.target.value })}
                placeholder="DSCE"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground">VTU Code</label>
              <Input
                value={newCollegeData.vtuCode}
                onChange={(e) => setNewCollegeData({ ...newCollegeData, vtuCode: e.target.value })}
                placeholder="1DS"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground">AISHE Code</label>
              <Input
                value={newCollegeData.aisheCode}
                onChange={(e) => setNewCollegeData({ ...newCollegeData, aisheCode: e.target.value })}
                placeholder="C-1342"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold text-foreground">District</label>
              <Input
                value={newCollegeData.district}
                onChange={(e) => setNewCollegeData({ ...newCollegeData, district: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground">State</label>
              <Input
                value={newCollegeData.state}
                onChange={(e) => setNewCollegeData({ ...newCollegeData, state: e.target.value })}
              />
            </div>
          </div>
          <div className="border-t pt-2 grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold text-foreground">Principal Name</label>
              <Input
                value={newCollegeData.principalName}
                onChange={(e) => setNewCollegeData({ ...newCollegeData, principalName: e.target.value })}
                placeholder="Dr. ..."
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground">Principal Mobile</label>
              <Input
                value={newCollegeData.principalPhone}
                onChange={(e) => setNewCollegeData({ ...newCollegeData, principalPhone: e.target.value })}
                placeholder="+91 ..."
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold text-foreground">PTO Name</label>
              <Input
                value={newCollegeData.ptoName}
                onChange={(e) => setNewCollegeData({ ...newCollegeData, ptoName: e.target.value })}
                placeholder="Prof. ..."
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground">PTO Mobile</label>
              <Input
                value={newCollegeData.ptoPhone}
                onChange={(e) => setNewCollegeData({ ...newCollegeData, ptoPhone: e.target.value })}
                placeholder="+91 ..."
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-3">
            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-primary text-white">Save Institution</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
