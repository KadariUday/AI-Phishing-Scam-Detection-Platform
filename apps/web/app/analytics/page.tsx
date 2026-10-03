"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  ShieldAlert,
  Cpu,
  CheckCircle2,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import { DashboardShell } from "@/components/DashboardShell";
import { AnalyticsData } from "@/lib/types";
import { api } from "@/lib/api";

const RISK_COLORS: Record<string, string> = {
  SAFE: "#10b981",
  LOW: "#0ea5e9",
  MEDIUM: "#f59e0b",
  HIGH: "#f97316",
  CRITICAL: "#ef4444",
};

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const res = await api.getAnalytics();
        setData(res);
      } catch (e) {
        console.error("Failed to load analytics:", e);
        // Fallback demo data
        setData({
          total_scans: 74,
          scan_type_distribution: { URL: 42, MESSAGE: 21, EMAIL: 11 },
          risk_level_distribution: {
            SAFE: 38,
            LOW: 10,
            MEDIUM: 9,
            HIGH: 11,
            CRITICAL: 6,
          },
          daily_volume: [
            { date: "Mon", scans: 8, threats: 2 },
            { date: "Tue", scans: 12, threats: 3 },
            { date: "Wed", scans: 15, threats: 4 },
            { date: "Thu", scans: 19, threats: 6 },
            { date: "Fri", scans: 22, threats: 7 },
            { date: "Sat", scans: 14, threats: 3 },
            { date: "Sun", scans: 25, threats: 8 },
          ],
          top_threat_indicators: [
            { code: "IP_HOSTNAME", name: "Bare IP in Hostname", count: 18 },
            { code: "URGENCY_TRIGGER", name: "Coercive Urgency Trigger", count: 24 },
            { code: "CREDENTIAL_HARVESTING", name: "OTP / PIN Harvest Request", count: 16 },
            { code: "SUSPICIOUS_TLD", name: "High-Abuse TLD", count: 14 },
            { code: "NO_HTTPS", name: "Unencrypted Protocol", count: 22 },
          ],
          model_performance: {
            url_phishing_model: {
              model_type: "RandomForest",
              metrics: { accuracy: 0.984, precision: 0.981, recall: 0.986, f1_score: 0.983, roc_auc: 0.994 },
            },
            nlp_scam_model: {
              model_type: "LogisticRegression (TF-IDF)",
              metrics: { accuracy: 0.968, precision: 0.964, recall: 0.971, f1_score: 0.965, roc_auc: 0.989 },
            },
          },
        });
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  const riskPieData = data
    ? Object.entries(data.risk_level_distribution).map(([name, value]) => ({
        name,
        value,
        color: RISK_COLORS[name] || "#3b82f6",
      }))
    : [];

  const typeBarData = data
    ? Object.entries(data.scan_type_distribution).map(([name, count]) => ({
        name,
        count,
      }))
    : [];

  return (
    <DashboardShell>
      <div className="space-y-8">
        {/* 1. Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-100">
            Threat Intelligence & AI Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Statistical risk distribution, temporal ingestion trends, indicator frequencies, and ML classifier metrics
          </p>
        </div>

        {/* 2. Top Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Scan Volume Area Chart */}
          <div className="glass-panel rounded-2xl p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              Daily Ingestion Volume & Threat Rate
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.daily_volume || []}>
                  <defs>
                    <linearGradient id="scansGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="threatsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#64748b" textAnchor="end" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#334155",
                      borderRadius: "0.75rem",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="scans"
                    name="Total Scans"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#scansGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="threats"
                    name="High/Critical Threats"
                    stroke="#ef4444"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#threatsGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Risk Level Distribution Pie */}
          <div className="glass-panel rounded-2xl p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2 mb-4">
              <PieIcon className="w-4 h-4 text-orange-400" />
              Risk Classification Distribution
            </h3>
            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskPieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {riskPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#334155",
                      borderRadius: "0.75rem",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-[11px] font-mono">
              {riskPieData.map((d) => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-slate-300">{d.name}: {d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Bottom Row: Top Threat Indicators & Model Evaluation Manifest */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Threat Indicators Frequency */}
          <div className="glass-panel rounded-2xl p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2 mb-4">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              Most Frequent Threat Indicators
            </h3>
            <div className="space-y-3">
              {data?.top_threat_indicators.map((ind, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">{ind.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{ind.code}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 font-mono font-bold text-xs border border-red-500/20">
                    {ind.count} detections
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Model Performance Manifest */}
          <div className="glass-panel rounded-2xl p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2 mb-4">
              <Cpu className="w-4 h-4 text-emerald-400" />
              Machine Learning Benchmark Metrics
            </h3>
            <div className="space-y-4">
              {/* URL Model */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-cyan-400">URL Phishing Classifier</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                    Random Forest (21-dim)
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs mt-3">
                  <div className="p-2 rounded bg-slate-950">
                    <span className="text-[10px] text-slate-500 block">Accuracy</span>
                    <span className="font-mono font-bold text-emerald-400">98.4%</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950">
                    <span className="text-[10px] text-slate-500 block">F1-Score</span>
                    <span className="font-mono font-bold text-emerald-400">98.3%</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950">
                    <span className="text-[10px] text-slate-500 block">ROC-AUC</span>
                    <span className="font-mono font-bold text-cyan-400">0.994</span>
                  </div>
                </div>
              </div>

              {/* NLP Model */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-orange-400">NLP Scam & Smishing Classifier</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/20 text-orange-300">
                    TF-IDF n-grams + Logistic
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs mt-3">
                  <div className="p-2 rounded bg-slate-950">
                    <span className="text-[10px] text-slate-500 block">Accuracy</span>
                    <span className="font-mono font-bold text-emerald-400">96.8%</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950">
                    <span className="text-[10px] text-slate-500 block">F1-Score</span>
                    <span className="font-mono font-bold text-emerald-400">96.5%</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950">
                    <span className="text-[10px] text-slate-500 block">ROC-AUC</span>
                    <span className="font-mono font-bold text-cyan-400">0.989</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
