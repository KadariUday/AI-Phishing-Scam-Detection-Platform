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
        {/* Header with Tab Switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Investigation Ledger & Activity History
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Chronological forensic timeline and real-time MongoDB user activity audit trails
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-900 border border-slate-800">
            <button
              onClick={() => setActiveTab("scans")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                activeTab === "scans"
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Threat Assessments</span>
            </button>
            <button
              onClick={() => setActiveTab("mongodb")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                activeTab === "mongodb"
                  ? "bg-emerald-600 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>MongoDB Audit Stream</span>
            </button>
          </div>
        </div>

        {/* TAB 1: SCAN ASSESSMENTS */}
        {activeTab === "scans" && (
          <div className="space-y-4">
            {/* Filters Bar */}
            <div className="panel-card p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && fetchHistory()}
                  placeholder="Search target URLs or text..."
                  className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto text-xs">
                <div className="flex items-center gap-2 text-slate-400">
                  <Filter className="w-3.5 h-3.5 text-blue-400" />
                  <span>Vector:</span>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="px-2.5 py-1.5 rounded-md bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
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
                    className="px-2.5 py-1.5 rounded-md bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
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
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {/* Scan Table */}
            <div className="panel-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-800 bg-slate-950/40 text-slate-400 font-semibold uppercase text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Vector</th>
                      <th className="py-3 px-4">Target Payload</th>
                      <th className="py-3 px-4">Risk Level</th>
                      <th className="py-3 px-4">Confidence</th>
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400">
                          Retrieving threat ledger from persistence...
                        </td>
                      </tr>
                    ) : scans.length > 0 ? (
                      scans.map((scan) => (
                        <tr key={scan.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono font-bold text-blue-400">
                              {scan.scan_type}
                            </span>
                          </td>
                          <td className="py-3 px-4 max-w-sm truncate font-mono text-slate-200">
                            {scan.target_text}
                          </td>
                          <td className="py-3 px-4">
                            <ThreatBadge level={scan.risk_level} size="sm" />
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-300">
                            {Math.round(scan.confidence * 100)}%
                          </td>
                          <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                            {formatDateTime(scan.created_at)}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleInspect(scan.id)}
                                title="Inspect Details"
                                className="p-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <a
                                href={api.getReportDownloadUrl(scan.id)}
                                target="_blank"
                                title="Download PDF Report"
                                className="p-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-emerald-400 border border-slate-800 transition-colors"
                              >
                                <FileDown className="w-3.5 h-3.5" />
                              </a>
                              <button
                                onClick={() => handleDelete(scan.id)}
                                title="Delete Scan"
                                className="p-1.5 rounded-md bg-slate-900 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400">
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

        {/* TAB 2: MONGODB USER ACTIVITY TIMELINE */}
        {activeTab === "mongodb" && (
          <div className="space-y-4">
            {/* MongoDB Stats Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="panel-card p-4 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">
                    MongoDB Persistence
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-sm font-bold text-emerald-400 font-mono">
                      {mongoStats?.connected ? "CONNECTED & RECORDING" : "ACTIVE (BUFFERED)"}
                    </span>
                  </div>
                </div>
                <Database className="w-6 h-6 text-emerald-400/40" />
              </div>

              <div className="panel-card p-4 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">
                    Collection: `users`
                  </span>
                  <p className="text-sm font-bold text-white font-mono mt-1">
                    {mongoStats?.users_count ?? 2} Operators Registered
                  </p>
                </div>
                <UserCheck className="w-6 h-6 text-blue-400/40" />
              </div>

              <div className="panel-card p-4 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">
                    Collection: `activity_history`
                  </span>
                  <p className="text-sm font-bold text-white font-mono mt-1">
                    {mongoHistory.length} Timestamped Events Logged
                  </p>
                </div>
                <Clock className="w-6 h-6 text-indigo-400/40" />
              </div>
            </div>

            {/* Filter by Action */}
            <div className="panel-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Filter Operator Action:</span>
                <select
                  value={mongoActionFilter}
                  onChange={(e) => setMongoActionFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-md bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-emerald-500 font-mono"
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
                className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 border border-emerald-500/30 text-emerald-400 text-xs font-semibold transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Sync Stream</span>
              </button>
            </div>

            {/* MongoDB Activity Timeline Feed */}
            <div className="panel-card p-6">
              {loadingMongo ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  Streaming MongoDB audit log records...
                </div>
              ) : mongoHistory.length > 0 ? (
                <div className="space-y-3 font-mono">
                  {mongoHistory.map((item, idx) => (
                    <div
                      key={item._id || idx}
                      className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-md bg-slate-900 border border-slate-800 flex-shrink-0 mt-0.5">
                          {item.action.startsWith("USER") ? (
                            <UserCheck className="w-4 h-4 text-blue-400" />
                          ) : (
                            <ShieldAlert className="w-4 h-4 text-emerald-400" />
                          )}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-[10px] font-bold text-emerald-400">
                              {item.action}
                            </span>
                            <span className="text-slate-200 font-semibold">
                              {item.username}
                            </span>
                            <span className="text-slate-400 text-[11px]">
                              ({item.email})
                            </span>
                          </div>
                          <p className="text-slate-300 text-xs font-sans">{item.description}</p>
                          {item.target_payload && (
                            <p className="text-slate-400 text-[11px] mt-1 truncate max-w-xl bg-slate-900/60 px-2 py-1 rounded border border-slate-800">
                              Payload: {item.target_payload}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex md:flex-col items-center md:items-end justify-between gap-1 flex-shrink-0">
                        {item.risk_level && item.risk_level !== "N/A" && (
                          <ThreatBadge level={item.risk_level} size="sm" />
                        )}
                        <span className="text-blue-400 text-[11px] font-medium flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {item.readable_time || item.timestamp}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No MongoDB history entries found. Run scans or sign up/log in to generate events.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal Detail Drawer */}
        {selectedScanDetail && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 rounded-xl p-6 relative border border-slate-800 shadow-2xl">
              <button
                onClick={() => setSelectedScanDetail(null)}
                className="absolute top-5 right-5 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="mb-4">
                <h3 className="text-lg font-bold text-white">Forensic Scan Inspector</h3>
                <p className="text-xs text-slate-400">Detailed breakdown and Explainable AI rationale</p>
              </div>
              <ScanResultView result={selectedScanDetail} />
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
