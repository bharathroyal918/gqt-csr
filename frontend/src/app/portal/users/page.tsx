"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { UserAccount, UserRole } from "@/types";
import { Modal } from "@/components/common/Modal";
import {
  Users,
  PlusCircle,
  Search,
  Shield,
  KeyRound,
  CheckCircle2,
  Lock,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";

export default function UsersPage() {
  const { users, addUser } = useApp();

  const [userList, setUserList] = useState<UserAccount[]>(users);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  React.useEffect(() => {
    setUserList(users);
  }, [users]);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "+91 ",
    role: "hr_recruiter" as UserRole,
    department: "Talent Acquisition",
  });

  const filteredUsers = userList.filter((u) => {
    const q = searchQuery.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.includes(q);
  });

  const toggleUserStatus = (id: string) => {
    setUserList((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: u.status === "active" ? "inactive" : "active" } : u))
    );
    toast.success("User status updated");
  };

  const handleResetPassword = (name: string) => {
    toast.success(`Temporary reset password link dispatched to ${name}`);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;

    addUser({
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      department: newUser.department,
      status: "active",
      lastLogin: "Never",
      twoFactorEnabled: false,
    });

    setIsAddModalOpen(false);
    setNewUser({ name: "", email: "", phone: "+91 ", role: "hr_recruiter", department: "Talent Acquisition" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-white tracking-tight">
            User Management & Permissions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage authorized staff credentials, 9 role personas, and two-factor authentication rules.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#007BFF] to-[#005BBB] text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Staff Account</span>
        </button>
      </div>

      {/* Permissions Matrix Overview Card */}
      <div className="gqt-card p-6 bg-white dark:bg-[#111C3A] border space-y-4">
        <h3 className="font-bold text-base text-[#0F172A] dark:text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#005BBB]" />
          Role Permissions Matrix
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border">
            <span className="font-extrabold text-[#005BBB] block">Super Admin</span>
            <span className="text-slate-400 text-[10px]">Unrestricted read, write, and export across 20+ modules</span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border">
            <span className="font-extrabold text-cyan-600 block">CSR Manager</span>
            <span className="text-slate-400 text-[10px]">Manage drives, colleges, follow-ups, and reports</span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border">
            <span className="font-extrabold text-purple-600 block">HR Recruiter</span>
            <span className="text-slate-400 text-[10px]">Interview scoring, Kanban pipeline, and offer generation</span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border">
            <span className="font-extrabold text-emerald-600 block">PTO / Placement</span>
            <span className="text-slate-400 text-[10px]">College candidate roster, hall tickets, campus calendar</span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border">
            <span className="font-extrabold text-teal-600 block">Student</span>
            <span className="text-slate-400 text-[10px]">Assessment taking, scorecard review, offer acceptance</span>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="gqt-card p-6 bg-white dark:bg-[#111C3A] border">
        <div className="flex items-center justify-between mb-4">
          <div className="relative w-72">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
            />
          </div>
          <span className="text-xs text-slate-400 font-bold">{filteredUsers.length} Staff Users</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900 text-slate-400 uppercase font-bold text-[10px]">
              <tr>
                <th className="p-3">User</th>
                <th className="p-3">Role</th>
                <th className="p-3">Department</th>
                <th className="p-3">Status</th>
                <th className="p-3">Last Login</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="p-3">
                    <div className="flex items-center gap-2.5">
                      {u.avatar && u.avatar.trim() !== "" ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[#005BBB] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                          {u.name?.charAt(0) || "U"}
                        </div>
                      )}
                      <div>
                        <span className="font-bold text-[#0F172A] dark:text-white block">{u.name}</span>
                        <span className="text-[11px] text-slate-400">{u.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 font-bold text-[#005BBB] dark:text-blue-400">
                    {u.role.replace("_", " ").toUpperCase()}
                  </td>
                  <td className="p-3 text-slate-500">
                    {u.department || "General"}
                  </td>
                  <td className="p-3">
                    <span
                      onClick={() => toggleUserStatus(u.id)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer ${
                        u.status === "active"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                          : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400"
                      }`}
                    >
                      {u.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-slate-400">
                    {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : "Never"}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleResetPassword(u.name)}
                      className="text-xs text-[#005BBB] dark:text-blue-400 font-bold hover:underline"
                    >
                      Reset Password
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create New User Account"
        subtitle="Onboard team members or placement officers with role-based permissions"
        maxWidth="md"
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Full Name</label>
            <input
              type="text"
              required
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Email</label>
            <input
              type="email"
              required
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">Assign Role</label>
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value as UserRole })}
              className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#005BBB]"
            >
              <option value="super_admin" className="bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white">Super Admin</option>
              <option value="csr_manager" className="bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white">CSR Manager</option>
              <option value="hr_recruiter" className="bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white">HR Recruiter</option>
              <option value="pto" className="bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white">Placement Training Officer (PTO)</option>
              <option value="principal" className="bg-white dark:bg-slate-900 text-[#0F172A] dark:text-white">Principal</option>
            </select>
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
              Create Account
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
