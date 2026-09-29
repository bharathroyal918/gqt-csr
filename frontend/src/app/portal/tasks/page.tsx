"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { TaskItem } from "@/types";
import { Modal } from "@/components/common/Modal";
import {
  CheckSquare,
  PlusCircle,
  Clock,
  User,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

export default function TasksPage() {
  const { tasks, addTask, updateTaskStatus, users, currentUser } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: currentUser.name || users[0]?.name || "Admin",
    priority: "High" as TaskItem["priority"],
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
    status: "Todo" as TaskItem["status"],
  });

  const columns: { title: string; status: TaskItem["status"] }[] = [
    { title: "To Do", status: "Todo" },
    { title: "In Progress", status: "In Progress" },
    { title: "In Review", status: "Review" },
    { title: "Completed", status: "Done" },
  ];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title) return;
    addTask(newTask);
    setIsAddModalOpen(false);
    setNewTask({ ...newTask, title: "", description: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-white tracking-tight">
            Team Task & Milestone Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track operational milestones, question bank updates, student lab readiness, and digital offer dispatch tasks.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#007BFF] to-[#005BBB] text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Task</span>
        </button>
      </div>

      {/* Kanban Board for Tasks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.status);

          return (
            <div
              key={col.status}
              className="p-4 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 flex flex-col min-h-[450px]"
            >
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800">
                <h3 className="font-bold text-xs text-[#0F172A] dark:text-white uppercase tracking-wider">
                  {col.title}
                </h3>
                <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 text-[10px] font-bold flex items-center justify-center">
                  {colTasks.length}
                </span>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto">
                {colTasks.map((t) => (
                  <div
                    key={t.id}
                    className="p-4 rounded-2xl bg-white dark:bg-[#111C3A] border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-xs text-[#0F172A] dark:text-white leading-tight">
                        {t.title}
                      </h4>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          t.priority === "Urgent"
                            ? "bg-rose-50 text-rose-600"
                            : t.priority === "High"
                            ? "bg-amber-50 text-amber-600"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {t.priority}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {t.description}
                    </p>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-[#005BBB]" /> {t.assignedTo ? t.assignedTo.split(" ")[0] : "Assigned"}
                      </span>
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-slate-400" /> {t.dueDate}
                      </span>
                    </div>

                    {col.status !== "Done" && (
                      <button
                        onClick={() => updateTaskStatus(t.id, "Done")}
                        className="w-full py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                      >
                        Mark Done
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Task Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Assign Team Task"
        subtitle="Create operational task for CSR drive logistics"
        maxWidth="md"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Task Title</label>
            <input
              type="text"
              required
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Description</label>
            <textarea
              rows={3}
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Assignee</label>
              <select
                value={newTask.assignedTo}
                onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.name} className="bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white">
                    {u.name} ({u.role.replace("_", " ")})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Priority</label>
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as TaskItem["priority"] })}
                className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
              >
                <option value="Urgent" className="bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white">Urgent</option>
                <option value="High" className="bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white">High</option>
                <option value="Medium" className="bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white">Medium</option>
                <option value="Low" className="bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white">Low</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-[#005BBB] text-white text-xs font-bold hover:bg-blue-700 transition-colors"
            >
              Assign Task
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
