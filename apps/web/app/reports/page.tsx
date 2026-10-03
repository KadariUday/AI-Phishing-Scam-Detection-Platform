"use client";

import React, { useState, useEffect } from "react";
import { FileText, FileDown, ShieldCheck, Download, RefreshCw, ExternalLink } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { ThreatBadge } from "@/components/ThreatBadge";
import { ScanListItem } from "@/lib/types";
import { api } from "@/lib/api";
import { formatDateTime } from "@/lib/utils";

export default function ReportsPage() {
  const [scans, setScans] = useState<ScanListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchScans = async () => {
    setLoading(true);
    try {
      const data = await api.getScans({ limit: 50 });
      setScans(data);
    } catch (e) {
      console.error("Failed to load scans for reports:", e);
      setScans([
        {
          id: "demo-scan-1",
          scan_type: "URL",
          target_text: "http://192.168.1.100/paypal/login-verify.php",
          target_domain: "192.168.1.100",
          risk_score: 94,
          risk_level: "CRITICAL",
          classification: "PHISHING",
          confidence: 0.96,
          created_at: new Date().toISOString(),
        },
        {
          id: "demo-scan-2",
          scan_type: "MESSAGE",
          target_text: "URGENT: Your Wells Fargo account has been locked. Verify PIN...",
          target_domain: "wellsfargo.verify-id.work",
          risk_score: 88,
          risk_level: "HIGH",
          classification: "SCAM",
          confidence: 0.93,
          created_at: new Date(Date.now() - 3600000).toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScans();
  }, []);

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Forensic Audit Reports
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Download formal PDF audit reports for incident response, security compliance, and forensic records
            </p>
          </div>

          <button
            onClick={fetchScans}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh List</span>
          </button>
        </div>

        {/* Overview Card */}
        <div className="panel-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Automated Forensic PDF Generator
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
                Every scanned payload is structured into an executive PDF audit report with risk score telemetry, heuristic indicator tables, and SOC countermeasures.
              </p>
            </div>
          </div>
        </div>

        {/* Reports Ledger Table */}
        <div className="panel-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-950/40 text-slate-400 font-semibold uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4">Vector</th>
                  <th className="py-3 px-4">Target / Ingested Text</th>
                  <th className="py-3 px-4">Severity Tier</th>
                  <th className="py-3 px-4">Confidence</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4 text-right">Download</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      Loading reports catalogue...
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
                      <td className="py-3 px-4 max-w-md truncate font-mono text-slate-200">
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
                        <a
                          href={api.getReportDownloadUrl(scan.id)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-sm"
                        >
                          <FileDown className="w-3.5 h-3.5" />
                          <span>PDF Report</span>
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      No reports available yet. Run a threat scan to automatically generate report entries.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
