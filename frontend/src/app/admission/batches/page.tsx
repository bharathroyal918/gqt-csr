"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Layers,
  Plus,
  ArrowLeft,
  Users,
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  Building2,
  Sparkles,
  Search,
  Filter,
  Eye,
  UserCheck
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Modal } from "@/components/common/Modal";
import { INITIAL_BATCHES, INITIAL_OFFER_LETTERS } from "@/lib/offer/offerData";
import { BatchRecord } from "@/types";
import { toast } from "sonner";

export default function AdmissionBatchesPage() {
  const [batches, setBatches] = useState<BatchRecord[]>(INITIAL_BATCHES);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<BatchRecord | null>(null);

  // Form states for new batch
  const [newCode, setNewCode] = useState("");
  const [newName, setNewName] = useState("");
  const [newCourse, setNewCourse] = useState("Java Full Stack + Agentic AI");
  const [newTrainer, setNewTrainer] = useState("");
  const [newStartDate, setNewStartDate] = useState("2026-07-01");
  const [newEndDate, setNewEndDate] = useState("2026-12-31");
  const [newCapacity, setNewCapacity] = useState("60");
  const [newMode, setNewMode] = useState<"Offline Campus" | "Virtual Live" | "Hybrid">("Hybrid");
  const [newLocation, setNewLocation] = useState("GQT Advanced Learning Center, Whitefield, Bengaluru");

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || !newName || !newTrainer) {
      toast.error("Please fill all required batch fields.");
      return;
    }

    const created: BatchRecord = {
      id: `bat-${Date.now()}`,
      batchCode: newCode,
      name: newName,
      course: newCourse,
      trainer: newTrainer,
      startDate: newStartDate,
      endDate: newEndDate,
      capacity: parseInt(newCapacity, 10) || 60,
      enrolledCount: 0,
      mode: newMode,
      location: newLocation,
      status: "Upcoming",
      studentIds: [],
    };

    setBatches((prev) => [created, ...prev]);
    toast.success("Training Batch Created Successfully!", {
      description: `Batch ${newCode} initialized with capacity of ${newCapacity} seats.`,
    });
    setIsCreateModalOpen(false);
    // Reset
    setNewCode("");
    setNewName("");
    setNewTrainer("");
  };

  const handleBulkAllocate = () => {
    toast.success("Bulk Allocation Executed!", {
      description: "12 unassigned accepted candidates assigned to Batch Alpha.",
    });
    setIsBulkModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/admission/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Admission Command Hub
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground flex items-center gap-2.5">
            <Layers className="w-7 h-7 text-[#005BBB]" />
            CSR Training Batch Allocation Engine
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Create cohort batches, monitor seat capacity across centers (Bengaluru, Mysuru, Hubballi, Online), and assign students.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsBulkModalOpen(true)}
            className="text-xs flex items-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5" />
            Bulk Allocate
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setNewCode(`GQT-2026-COHORT-${Math.floor(10 + Math.random() * 90)}`);
              setNewName("2026 Batch Gamma — Full Stack");
              setNewTrainer("Senior Tech Architect");
              setIsCreateModalOpen(true);
            }}
            className="flex items-center gap-1.5 text-xs"
          >
            <Plus className="w-4 h-4" />
            Create Batch
          </Button>
        </div>
      </div>

      {/* Batches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {batches.map((batch) => {
          const occupancy = Math.round((batch.enrolledCount / batch.capacity) * 100);
          const availableSeats = Math.max(0, batch.capacity - batch.enrolledCount);

          return (
            <Card key={batch.id} className="p-6 space-y-4 hover:border-[#005BBB] transition-all">
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-border">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-[#005BBB] bg-[#005BBB]/10 px-2 py-0.5 rounded">
                      {batch.batchCode}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        batch.status === "Full"
                          ? "bg-red-100 text-red-800"
                          : batch.status === "Active"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {batch.status}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-foreground">{batch.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{batch.course}</p>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-black text-foreground">{availableSeats}</span>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Seats Left</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Roster Capacity</span>
                  <span className="font-bold text-foreground">
                    {batch.enrolledCount} / {batch.capacity} Students ({occupancy}%)
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      occupancy >= 100
                        ? "bg-red-500"
                        : occupancy >= 75
                        ? "bg-amber-500"
                        : "bg-[#005BBB]"
                    }`}
                    style={{ width: `${Math.min(100, occupancy)}%` }}
                  />
                </div>
              </div>

              {/* Batch Metadata */}
              <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                <div className="p-2.5 rounded-xl border border-border bg-muted/20">
                  <span className="text-[10px] text-muted-foreground block">Trainer / Faculty</span>
                  <span className="font-semibold text-foreground truncate block">{batch.trainer}</span>
                </div>

                <div className="p-2.5 rounded-xl border border-border bg-muted/20">
                  <span className="text-[10px] text-muted-foreground block">Training Mode</span>
                  <span className="font-semibold text-foreground block">{batch.mode}</span>
                </div>

                <div className="p-2.5 rounded-xl border border-border bg-muted/20">
                  <span className="text-[10px] text-muted-foreground block">Start Date</span>
                  <span className="font-semibold text-foreground block">{batch.startDate}</span>
                </div>

                <div className="p-2.5 rounded-xl border border-border bg-muted/20">
                  <span className="text-[10px] text-muted-foreground block">Center Location</span>
                  <span className="font-semibold text-foreground truncate block">{batch.location}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-muted-foreground">
                  Enrolled Candidates: <span className="font-bold text-foreground">{batch.studentIds.length}</span>
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => setSelectedBatch(batch)}
                >
                  View Enrolled List
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Create Batch Modal */}
      {isCreateModalOpen && (
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create New Training Batch"
        >
          <form onSubmit={handleCreateBatch} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Batch Code</label>
                <Input
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="e.g. GQT-2026-JFS-BETA"
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Batch Name</label>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. 2026 Batch Beta — Java Cloud"
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Course Track</label>
                <Input
                  value={newCourse}
                  onChange={(e) => setNewCourse(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Lead Trainer</label>
                <Input
                  value={newTrainer}
                  onChange={(e) => setNewTrainer(e.target.value)}
                  placeholder="e.g. Arun Menon & Lead Architect"
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Start Date</label>
                <Input
                  type="date"
                  value={newStartDate}
                  onChange={(e) => setNewStartDate(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">End Date</label>
                <Input
                  type="date"
                  value={newEndDate}
                  onChange={(e) => setNewEndDate(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Seat Capacity</label>
                <Input
                  type="number"
                  value={newCapacity}
                  onChange={(e) => setNewCapacity(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Training Mode</label>
                <select
                  value={newMode}
                  onChange={(e) => setNewMode(e.target.value as any)}
                  className="w-full text-xs rounded-xl border border-border bg-background px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#005BBB]"
                >
                  <option value="Hybrid">Hybrid (Classroom + Labs)</option>
                  <option value="Offline Campus">Offline Campus</option>
                  <option value="Virtual Live">Virtual Live Online</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Training Center Location</label>
              <select
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                className="w-full text-xs rounded-xl border border-border bg-background px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-[#005BBB]"
              >
                <option value="GQT Advanced Learning Center, Whitefield, Bengaluru">
                  Bengaluru (Whitefield Learning Center)
                </option>
                <option value="GQT Mysuru Regional Center, Hebbal Industrial Area, Mysuru">
                  Mysuru Regional Center
                </option>
                <option value="GQT Hubballi Tech Hub, Vidyanagar, Hubballi">
                  Hubballi Tech Center
                </option>
                <option value="Online Virtual Classroom">Virtual Online</option>
                <option value="Hybrid (Regional Campus)">Hybrid</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" type="button" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Create Batch
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Bulk Allocation Modal */}
      {isBulkModalOpen && (
        <Modal
          isOpen={isBulkModalOpen}
          onClose={() => setIsBulkModalOpen(false)}
          title="Bulk Student Batch Allocation"
        >
          <div className="space-y-4 text-xs">
            <p className="text-muted-foreground">
              Automatically distribute unassigned accepted students into available batches based on course track and location proximity.
            </p>

            <div className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-1.5">
              <div className="flex justify-between">
                <span>Unallocated Candidates:</span>
                <span className="font-bold text-foreground">12 Students</span>
              </div>
              <div className="flex justify-between">
                <span>Target Batch:</span>
                <span className="font-bold text-[#005BBB]">2026 Batch Alpha — Java Cloud & AI</span>
              </div>
              <div className="flex justify-between">
                <span>Available Seats in Target:</span>
                <span className="font-bold text-emerald-600">18 Seats</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setIsBulkModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleBulkAllocate}>
                Execute Bulk Allocation
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* View Enrolled List Modal */}
      {selectedBatch && (
        <Modal
          isOpen={!!selectedBatch}
          onClose={() => setSelectedBatch(null)}
          title={`Enrolled Students — ${selectedBatch.name}`}
        >
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-muted/30 text-xs flex justify-between">
              <span>Batch Code: <strong className="font-mono">{selectedBatch.batchCode}</strong></span>
              <span>Capacity: <strong>{selectedBatch.enrolledCount} / {selectedBatch.capacity}</strong></span>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {INITIAL_OFFER_LETTERS.slice(0, 2).map((stu) => (
                <div key={stu.id} className="p-3 rounded-xl border border-border flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-foreground">{stu.studentName}</p>
                    <p className="text-[10px] text-muted-foreground">{stu.collegeName}</p>
                  </div>
                  <span className="font-mono text-[10px] font-bold text-[#005BBB]">{stu.offerNumber}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="primary" size="sm" onClick={() => setSelectedBatch(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
