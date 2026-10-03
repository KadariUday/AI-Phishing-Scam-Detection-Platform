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
        {/* 1. Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-100">
              Forensic PDF Reports
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Generate and download formal audit reports for threat incidents and compliance records
            </p>
          </div>

          <button
            onClick={fetchScans}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Reports</span>
          </button>
        </div>

        {/* 2. Overview Banner */}
        <div className="glass-panel rounded-2xl p-6 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                Automated ReportLab Engine v4.1
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Every scanned threat payload is compiled into a standalone PDF containing technical feature tables and defensive countermeasures.
              </p>
            </div>
          </div>
        </div>

        {/* 3. Reports Ledger Table */}
        <div className="glass-panel rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-900/50 text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Vector</th>
                  <th className="py-3 px-4">Target Payload</th>
                  <th className="py-3 px-4">Risk Level</th>
                  <th className="py-3 px-4">Format</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4 text-right">Download PDF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-slate-500">
                      Loading available reports...
                    </td>
                  </tr>
                ) : scans.length > 0 ? (
                  scans.map((scan) => (
                    <tr key={scan.id} className="hover:bg-slate-900/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-semibold text-slate-300">
                          {scan.scan_type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 max-w-sm truncate text-slate-200">
                        {scan.target_text}
                      </td>
                      <td className="py-3.5 px-4">
                        <ThreatBadge level={scan.risk_level} />
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-red-950/40 text-red-400 border border-red-900/40 text-[10px] font-bold">
                          PDF Document
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                        {formatDateTime(scan.created_at)}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <a
                          href={api.getReportDownloadUrl(scan.id)}
                          target="_blank"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-semibold transition-all"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Export PDF</span>
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-slate-500">
                      No reports generated yet. Run a scan to create a report.
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
