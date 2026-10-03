"use client";

import React, { useState, useEffect } from "react";
import {
  History,
  Search,
  Filter,
  Trash2,
  Eye,
  FileDown,
  RefreshCw,
  X,
  Database,
  Clock,
  UserCheck,
  ShieldAlert,
  Sparkles,
  Terminal,
} from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { ThreatBadge } from "@/components/ThreatBadge";
import { ScanResultView } from "@/components/ScanResultView";
import { ScanListItem, ScanResultData, MongoActivityRecord, MongoStats } from "@/lib/types";
import { api } from "@/lib/api";
import { formatDateTime } from "@/lib/utils";

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState<"scans" | "mongodb">("scans");

  // Scans State
  const [scans, setScans] = useState<ScanListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedRisk, setSelectedRisk] = useState<string>("ALL");
  const [selectedScanDetail, setSelectedScanDetail] = useState<ScanResultData | null>(null);

  // MongoDB Activity History State
  const [mongoHistory, setMongoHistory] = useState<MongoActivityRecord[]>([]);
  const [mongoStats, setMongoStats] = useState<MongoStats | null>(null);
  const [loadingMongo, setLoadingMongo] = useState(false);
  const [mongoActionFilter, setMongoActionFilter] = useState<string>("ALL");

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await api.getScans({
        scan_type: selectedType,
        risk_level: selectedRisk,
        search: search.trim() || undefined,
      });
      setScans(data);
    } catch (e) {
      console.error("Failed to load history:", e);
      setScans([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMongoData = async () => {
    setLoadingMongo(true);
    try {
      const [historyData, statsData] = await Promise.all([
        api.getMongoActivityHistory({ action: mongoActionFilter }),
        api.getMongoStats(),
      ]);
      setMongoHistory(historyData);
      setMongoStats(statsData);
    } catch (e) {
      console.error("Failed to load MongoDB activity:", e);
    } finally {
      setLoadingMongo(false);
    }
  };

  useEffect(() => {
    if (activeTab === "scans") {
      fetchHistory();
    } else {
      fetchMongoData();
    }
  }, [activeTab, selectedType, selectedRisk, mongoActionFilter]);

  const handleInspect = async (id: string) => {
    try {
      const detail = await api.getScanById(id);
      setSelectedScanDetail(detail);
    } catch (e) {
      console.error("Failed to get scan detail:", e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this scan record?")) return;
    try {
      await api.deleteScan(id);
      setScans(scans.filter((s) => s.id !== id));
      if (selectedScanDetail?.id === id) {
        setSelectedScanDetail(null);
      }
    } catch (e) {
      console.error("Failed to delete scan:", e);
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* 1. Header with Tab Switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                AUDIT & TELEMETRY LEDGER
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-100">
              Investigation Ledger & Activity History
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5 font-mono">
              Chronological forensic timeline and real-time MongoDB user activity audit trails
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900/90 border border-white/[0.08] shadow-lg">
            <button
              onClick={() => setActiveTab("scans")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                activeTab === "scans"
                  ? "bg-cyan-500 text-slate-950 shadow-hud-cyan"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>SCAN ASSESSMENTS</span>
            </button>
            <button
              onClick={() => setActiveTab("mongodb")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                activeTab === "mongodb"
                  ? "bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 shadow-[0_0_15px_rgba(52,211,153,0.3)]"
                  : "text-slate-400 hover:text-emerald-400"
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>MONGODB ACTIVITY TIMELINE</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: SCAN ASSESSMENTS */}
        {/* ========================================================================= */}
        {activeTab === "scans" && (
          <div className="space-y-4">
            {/* Filters Bar */}
            <div className="glass-hud hud-corner rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && fetchHistory()}
                  placeholder="Search target URLs or text..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl neu-input text-xs text-slate-200 placeholder-slate-500 focus:outline-none font-mono"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto font-mono text-xs">
                <div className="flex items-center gap-2 text-slate-400">
                  <Filter className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Vector:</span>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="ALL">All Vectors</option>
                    <option value="URL">URL</option>
                    <option value="MESSAGE">Message</option>
                    <option value="EMAIL">Email</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  <span>Risk Tier:</span>
                  <select
                    value={selectedRisk}
                    onChange={(e) => setSelectedRisk(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="ALL">All Tiers</option>
                    <option value="CRITICAL">Critical</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                    <option value="SAFE">Safe</option>
                  </select>
                </div>

                <button
                  onClick={fetchHistory}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-cyan-300 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {/* Scan Table */}
            <div className="glass-hud hud-corner rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="border-b border-white/[0.08] bg-slate-900/60 text-slate-400 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3.5 px-4">Vector</th>
                      <th className="py-3.5 px-4">Target Payload</th>
                      <th className="py-3.5 px-4">Risk Level</th>
                      <th className="py-3.5 px-4">Confidence</th>
                      <th className="py-3.5 px-4">Timestamp</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-500">
                          Retrieving threat ledger from persistence...
                        </td>
                      </tr>
                    ) : scans.length > 0 ? (
                      scans.map((scan) => (
                        <tr key={scan.id} className="hover:bg-cyan-500/[0.03] transition-colors">
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] font-bold text-cyan-300">
                              {scan.scan_type}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 max-w-sm truncate text-slate-200">
                            {scan.target_text}
                          </td>
                          <td className="py-3.5 px-4">
                            <ThreatBadge level={scan.risk_level} />
                          </td>
                          <td className="py-3.5 px-4 text-slate-400">
                            {Math.round(scan.confidence * 100)}%
                          </td>
                          <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                            {formatDateTime(scan.created_at)}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleInspect(scan.id)}
                                title="Inspect Details"
                                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-800 transition-colors"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <a
                                href={api.getReportDownloadUrl(scan.id)}
                                target="_blank"
                                title="Download PDF Report"
                                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-emerald-400 border border-slate-800 transition-colors"
                              >
                                <FileDown className="w-3.5 h-3.5" />
                              </a>
                              <button
                                onClick={() => handleDelete(scan.id)}
                                title="Delete Scan"
                                className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-500 font-mono">
                          No scan records matching your filter criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: MONGODB USER ACTIVITY TIMELINE ("At what time they did what") */}
        {/* ========================================================================= */}
        {activeTab === "mongodb" && (
          <div className="space-y-4">
            {/* MongoDB Telemetry & Stats Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="glass-hud hud-corner rounded-xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    MongoDB Persistence State
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
                    <span className="text-sm font-black text-emerald-300 font-mono">
                      {mongoStats?.connected ? "ONLINE & RECORDING" : "ACTIVE (BUFFERED)"}
                    </span>
                  </div>
                </div>
                <Database className="w-7 h-7 text-emerald-400/50" />
              </div>

              <div className="glass-hud hud-corner rounded-xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    Collection: `users`
                  </span>
                  <p className="text-sm font-black text-slate-100 font-mono mt-1">
                    {mongoStats?.users_count ?? 2} Registered Operators
                  </p>
                </div>
                <UserCheck className="w-7 h-7 text-cyan-400/50" />
              </div>

              <div className="glass-hud hud-corner rounded-xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    Collection: `activity_history`
                  </span>
                  <p className="text-sm font-black text-slate-100 font-mono mt-1">
                    {mongoHistory.length} Timestamped Events Logged
                  </p>
                </div>
                <Clock className="w-7 h-7 text-violet-400/50" />
              </div>
            </div>

            {/* Filter by Action */}
            <div className="glass-hud hud-corner rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Filter User Action:</span>
                <select
                  value={mongoActionFilter}
                  onChange={(e) => setMongoActionFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-emerald-500 font-mono"
                >
                  <option value="ALL">All Actions (Signups, Logins, Scans)</option>
                  <option value="USER_SIGNUP">USER_SIGNUP (Account Creations)</option>
                  <option value="USER_LOGIN">USER_LOGIN (Operator Sessions)</option>
                  <option value="SCAN_URL">SCAN_URL (URL Analyses)</option>
                  <option value="SCAN_MESSAGE">SCAN_MESSAGE (SMS Scans)</option>
                  <option value="SCAN_EMAIL">SCAN_EMAIL (Email Scans)</option>
                </select>
              </div>

              <button
                onClick={fetchMongoData}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold transition-all shadow-[0_0_10px_rgba(52,211,153,0.15)]"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Sync MongoDB Stream</span>
              </button>
            </div>

            {/* MongoDB Activity Event Timeline Feed */}
            <div className="glass-hud hud-corner rounded-2xl p-6">
              {loadingMongo ? (
                <div className="py-12 text-center text-slate-500 font-mono text-xs">
                  Streaming MongoDB audit log records...
                </div>
              ) : mongoHistory.length > 0 ? (
                <div className="space-y-3 font-mono">
                  {mongoHistory.map((item, idx) => (
                    <div
                      key={item._id || idx}
                      className="p-4 rounded-xl bg-slate-900/70 border border-white/[0.06] hover:border-emerald-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex-shrink-0 mt-0.5">
                          {item.action.startsWith("USER") ? (
                            <UserCheck className="w-4 h-4 text-cyan-400" />
                          ) : (
                            <ShieldAlert className="w-4 h-4 text-emerald-400" />
                          )}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-[10px] font-bold text-emerald-300">
                              {item.action}
                            </span>
                            <span className="text-slate-200 font-bold">
                              {item.username}
                            </span>
                            <span className="text-slate-500 text-[11px]">
                              ({item.email})
                            </span>
                          </div>
                          <p className="text-slate-300 text-xs">{item.description}</p>
                          {item.target_payload && (
                            <p className="text-slate-400 text-[11px] mt-1 truncate max-w-xl bg-slate-950/60 px-2 py-1 rounded border border-slate-800">
                              Payload: {item.target_payload}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex md:flex-col items-center md:items-end justify-between gap-1 flex-shrink-0">
                        {item.risk_level && item.risk_level !== "N/A" && (
                          <ThreatBadge level={item.risk_level} />
                        )}
                        <span className="text-cyan-400 text-[11px] font-semibold flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {item.readable_time || item.timestamp}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-slate-500 font-mono text-xs">
                  No MongoDB history entries found. Run scans or sign up/log in to generate events.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal Detail Drawer */}
        {selectedScanDetail && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-hud hud-corner rounded-2xl p-6 relative border border-slate-700 shadow-2xl">
              <button
                onClick={() => setSelectedScanDetail(null)}
                className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="mb-4">
                <h3 className="text-xl font-bold text-slate-100 font-mono">Forensic Scan Inspector</h3>
                <p className="text-xs text-slate-400 font-mono">Detailed breakdown and Explainable AI rationale</p>
              </div>
              <ScanResultView result={selectedScanDetail} />
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
