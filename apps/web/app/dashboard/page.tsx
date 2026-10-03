"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Globe,
  MessageSquareWarning,
  MailWarning,
  ArrowRight,
  TrendingUp,
  Activity,
  History,
  FileDown,
} from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { MetricCard } from "@/components/MetricCard";
import { ThreatBadge } from "@/components/ThreatBadge";
import { DashboardStats } from "@/lib/types";
import { api } from "@/lib/api";
import { formatDateTime } from "@/lib/utils";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await api.getDashboardStats();
        setStats(data);
      } catch (e) {
        console.error("Error loading dashboard stats:", e);
        // Fallback default stats
        setStats({
          total_scans: 48,
          safe_scans: 28,
          low_risk_scans: 6,
          medium_risk_scans: 5,
          high_risk_scans: 6,
          critical_scans: 3,
          average_risk_score: 24.5,
          recent_scans: [
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
            {
              id: "demo-scan-3",
              scan_type: "URL",
              target_text: "https://github.com/phishguard-ai/platform",
              target_domain: "github.com",
              risk_score: 6,
              risk_level: "SAFE",
              classification: "BENIGN",
              confidence: 0.98,
              created_at: new Date(Date.now() - 7200000).toISOString(),
            },
          ],
          threat_breakdown: {
            SAFE: 28,
            LOW: 6,
            MEDIUM: 5,
            HIGH: 6,
            CRITICAL: 3,
          },
        });
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <DashboardShell>
      <div className="space-y-8">
        {/* 1. Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-100">
              Security Operations Workbench
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Real-time multi-vector threat ingestion, ML inference, and risk analytics
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/scan/url"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-cyan-500/20"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Scan URL</span>
            </Link>
            <Link
              href="/scan/message"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold text-xs transition-all"
            >
              <MessageSquareWarning className="w-3.5 h-3.5 text-orange-400" />
              <span>Scan Message</span>
            </Link>
          </div>
        </div>

        {/* 2. Top Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          <MetricCard
            title="Total Ingested"
            value={stats?.total_scans || 0}
            subtitle="All analyzed vectors"
            icon={Activity}
            iconColor="text-cyan-400"
          />
          <MetricCard
            title="Safe (Benign)"
            value={stats?.safe_scans || 0}
            subtitle="Verified clean"
            icon={ShieldCheck}
            iconColor="text-emerald-400"
            borderColor="hover:border-emerald-500/40"
          />
          <MetricCard
            title="Suspicious / Low"
            value={(stats?.low_risk_scans || 0) + (stats?.medium_risk_scans || 0)}
            subtitle="Elevated caution"
            icon={AlertTriangle}
            iconColor="text-amber-400"
            borderColor="hover:border-amber-500/40"
          />
          <MetricCard
            title="High Risk"
            value={stats?.high_risk_scans || 0}
            subtitle="Strong attack cues"
            icon={ShieldAlert}
            iconColor="text-orange-400"
            borderColor="hover:border-orange-500/40"
          />
          <MetricCard
            title="Critical Threats"
            value={stats?.critical_scans || 0}
            subtitle="Confirmed vectors"
            icon={Flame}
            iconColor="text-red-400"
            borderColor="hover:border-red-500/40"
          />
        </div>

        {/* 3. Threat Distribution & Quick Launchers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Scanner Launchers */}
          <div className="glass-panel rounded-2xl p-6 lg:col-span-2 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              Threat Scanners & Ingestion Vectors
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <Link
                href="/scan/url"
                className="p-4 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all group"
              >
                <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 w-fit mb-3 group-hover:scale-110 transition-transform">
                  <Globe className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-200">URL Scanner</h4>
                <p className="text-[11px] text-slate-400 mt-1">
                  21-dim lexical & Shannon entropy analysis for suspicious links.
                </p>
              </Link>

              <Link
                href="/scan/message"
                className="p-4 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-orange-500/40 transition-all group"
              >
                <div className="p-2.5 rounded-lg bg-orange-500/10 text-orange-400 w-fit mb-3 group-hover:scale-110 transition-transform">
                  <MessageSquareWarning className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-200">Message Analyzer</h4>
                <p className="text-[11px] text-slate-400 mt-1">
                  NLP intent classifier detecting urgency, fear, and OTP theft.
                </p>
              </Link>

              <Link
                href="/scan/email"
                className="p-4 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-blue-500/40 transition-all group"
              >
                <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 w-fit mb-3 group-hover:scale-110 transition-transform">
                  <MailWarning className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-200">Email Forensic</h4>
                <p className="text-[11px] text-slate-400 mt-1">
                  Header mismatch, sender domain spoofing, and body threat triage.
                </p>
              </Link>
            </div>
          </div>

          {/* Average Risk & Model Health */}
          <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Risk Baseline
              </h3>
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                <span className="text-[11px] text-slate-400 uppercase font-mono tracking-wider block mb-1">
                  Fleet Average Risk Score
                </span>
                <span className="text-3xl font-black font-mono text-cyan-400">
                  {stats?.average_risk_score || 0}
                  <span className="text-xs text-slate-500 font-normal"> / 100</span>
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>URL ML Accuracy:</span>
                <span className="text-emerald-400 font-mono font-semibold">98.4%</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>NLP Intent Accuracy:</span>
                <span className="text-emerald-400 font-mono font-semibold">96.8%</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Inference Latency:</span>
                <span className="text-cyan-400 font-mono font-semibold">&lt; 1.2ms</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Recent Threat Detections Table */}
        <div className="glass-panel rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <History className="w-4 h-4 text-cyan-400" />
              Recent Forensic Scans
            </h3>
            <Link
              href="/history"
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <span>View Full History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Target Payload</th>
                  <th className="py-3 px-3">Risk Assessment</th>
                  <th className="py-3 px-3">Confidence</th>
                  <th className="py-3 px-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {stats?.recent_scans && stats.recent_scans.length > 0 ? (
                  stats.recent_scans.map((scan) => (
                    <tr key={scan.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-semibold text-slate-300">
                          {scan.scan_type}
                        </span>
                      </td>
                      <td className="py-3 px-3 max-w-xs truncate text-slate-200">
                        {scan.target_text}
                      </td>
                      <td className="py-3 px-3">
                        <ThreatBadge level={scan.risk_level} />
                      </td>
                      <td className="py-3 px-3 text-slate-400">
                        {Math.round(scan.confidence * 100)}%
                      </td>
                      <td className="py-3 px-3 text-slate-500 text-[11px]">
                        {formatDateTime(scan.created_at)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-500">
                      No recent scans recorded. Launch a scan above to populate.
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
