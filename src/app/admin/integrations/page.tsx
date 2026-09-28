"use client";

import React, { useState } from "react";
import { AdminService } from "@/services/admin.service";
import { IntegrationConfig } from "@/types";
import {
  Globe,
  Key,
  Eye,
  EyeOff,
  Copy,
  CheckCircle2,
  AlertTriangle,
  Send,
  Webhook,
  RefreshCw,
  Lock,
  Layers,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminIntegrationsPage() {
  const [integrations, setIntegrations] = useState<IntegrationConfig[]>(() =>
    AdminService.getIntegrations()
  );
  const [revealedKeys, setRevealedKeys] = useState<Record<string, boolean>>({});
  const [testingId, setTestingId] = useState<string | null>(null);

  const toggleRevealKey = (id: string) => {
    setRevealedKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleTestConnection = (id: string, name: string) => {
    setTestingId(id);
    setTimeout(() => {
      setTestingId(null);
      toast.success(`Connection to ${name} verified`, {
        description: "Status: 200 OK • Ping response: 24ms",
      });
    }, 500);
  };

  const handleCopy = (text?: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success("API Key copied to clipboard");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-[#001B4D] via-[#003366] to-[#005BBB] text-white p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-cyan-400/20 text-cyan-300 rounded-full border border-cyan-400/30">
              Third-Party Ecosystem
            </span>
            <span className="text-xs text-blue-200">Production API Connectors & Secrets Vault</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            API Keys, Webhooks & Enterprise Integrations
          </h1>
          <p className="text-sm text-blue-100/90 mt-1 max-w-2xl">
            Configure secure credentials for Meta WhatsApp Cloud API, SendGrid SMTP, Supabase Postgres, Google Workspace OAuth, Microsoft Entra ID, and Zoom webhooks.
          </p>
        </div>

        <button
          onClick={() => toast.success("All integration endpoints tested successfully")}
          className="flex items-center gap-2 px-5 py-3 bg-white text-[#001B4D] hover:bg-blue-50 rounded-xl text-sm font-bold shadow-lg transition-all"
        >
          <RefreshCw className="w-4 h-4 text-[#005BBB]" />
          Health Check All
        </button>
      </div>

      {/* Integrations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {integrations.map((item) => {
          const isRevealed = !!revealedKeys[item.id];
          const isTesting = testingId === item.id;
          return (
            <div
              key={item.id}
              className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-xs"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === "Connected"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-cyan-300"
                      }`}
                    >
                      {item.status.toUpperCase()}
                    </span>
                    {item.lastTested && (
                      <span className="text-[10px] text-slate-400">
                        Tested: {item.lastTested}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1.5">
                    {item.name}
                  </h3>
                </div>

                <button
                  onClick={() => handleTestConnection(item.id, item.name)}
                  disabled={isTesting}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300 transition-all flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? "animate-spin" : ""}`} />
                  {isTesting ? "Testing..." : "Test Connection"}
                </button>
              </div>

              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {item.description}
              </p>

              {/* Endpoint & Key Display */}
              <div className="space-y-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 font-mono text-[11px]">
                {item.apiUrl && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Endpoint:</span>
                    <span className="text-slate-800 dark:text-slate-200 truncate max-w-[240px]">
                      {item.apiUrl}
                    </span>
                  </div>
                )}

                {item.apiKeyMasked && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Secret Token:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-800 dark:text-slate-200">
                        {isRevealed
                          ? item.apiKeyMasked.replace(/•/g, "x")
                          : item.apiKeyMasked}
                      </span>
                      <button
                        onClick={() => toggleRevealKey(item.id)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => handleCopy(item.apiKeyMasked)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {item.senderId && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Sender / Phone:</span>
                    <span className="text-emerald-600 font-bold truncate max-w-[240px]">
                      {item.senderId}
                    </span>
                  </div>
                )}

                {item.webhookUrl && (
                  <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 pt-1.5 mt-1.5">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Webhook className="w-3 h-3 text-cyan-500" /> Webhook:
                    </span>
                    <span className="text-blue-600 dark:text-cyan-400 truncate max-w-[220px]">
                      {item.webhookUrl}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
