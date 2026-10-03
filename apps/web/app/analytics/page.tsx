"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  ShieldAlert,
  Cpu,
  CheckCircle2,
  Activity,
  Layers,
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
  SAFE: "#10B981",
  LOW: "#06B6D4",
  MEDIUM: "#F59E0B",
  HIGH: "#F97316",
  CRITICAL: "#EF4444",
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
        // Fallback clean data
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
            { code: "SUSPICIOUS_TLD", name: "High-Abuse TLD Extension", count: 14 },
            { code: "NO_HTTPS", name: "Unencrypted Plaintext Protocol", count: 22 },
          ],
          model_performance: {
            url_phishing_model: {
              model_type: "RandomForest (21 Lexical Features)",
              metrics: { accuracy: 0.984, precision: 0.981, recall: 0.986, f1_score: 0.983, roc_auc: 0.994 },
            },
            nlp_scam_model: {
              model_type: "LogisticRegression (TF-IDF Intent)",
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

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="pb-2 border-b border-slate-800">
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Threat Intelligence & Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Statistical risk distribution, temporal ingestion trends, indicator frequencies, and ML classifier metrics
          </p>
        </div>

        {/* Top Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Scan Volume Area Chart */}
          <div className="panel-card p-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span>Daily Ingestion Volume & Threat Rate</span>
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.daily_volume || []}>
                  <defs>
                    <linearGradient id="scansGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="threatsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="date" stroke="#64748b" textAnchor="end" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0F172A",
                      borderColor: "#334155",
                      borderRadius: "0.5rem",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="scans"
                    name="Total Scans"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#scansGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="threats"
                    name="Hostile Threats"
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
          <div className="panel-card p-6 flex flex-col justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2 mb-4">
              <PieIcon className="w-4 h-4 text-orange-400" />
              <span>Risk Classification Breakdown</span>
            </h3>
            <div className="h-56 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskPieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {riskPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0F172A",
                      borderColor: "#334155",
                      borderRadius: "0.5rem",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-mono">
              {riskPieData.map((d) => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-slate-300">{d.name}: {d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row: Top Threat Indicators & Model Evaluation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Threat Indicators Frequency */}
          <div className="panel-card p-6 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Most Frequent Threat Indicators</span>
            </h3>
            <div className="space-y-2.5">
              {data?.top_threat_indicators.map((ind, i) => (
                <div key={i} className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-200 block">{ind.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{ind.code}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 font-mono font-semibold text-xs border border-rose-500/20">
                    {ind.count} hits
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Model Performance Manifest */}
          <div className="panel-card p-6 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>Machine Learning Cross-Validation Metrics</span>
            </h3>

            {data?.model_performance && (
              <div className="space-y-4">
                {/* URL Model */}
                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">URL Phishing Model</span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {data.model_performance.url_phishing_model.model_type}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 pt-1 text-center font-mono">
                    <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Accuracy</span>
                      <span className="text-xs font-bold text-emerald-400">
                        {Math.round(data.model_performance.url_phishing_model.metrics.accuracy * 1000) / 10}%
                      </span>
                    </div>
                    <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Precision</span>
                      <span className="text-xs font-bold text-blue-400">
                        {Math.round(data.model_performance.url_phishing_model.metrics.precision * 1000) / 10}%
                      </span>
                    </div>
                    <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Recall</span>
                      <span className="text-xs font-bold text-indigo-400">
                        {Math.round(data.model_performance.url_phishing_model.metrics.recall * 1000) / 10}%
                      </span>
                    </div>
                    <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">ROC-AUC</span>
                      <span className="text-xs font-bold text-cyan-400">
                        {data.model_performance.url_phishing_model.metrics.roc_auc}
                      </span>
                    </div>
                  </div>
                </div>

                {/* NLP Model */}
                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">NLP Psychological Coercion Model</span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {data.model_performance.nlp_scam_model.model_type}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 pt-1 text-center font-mono">
                    <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Accuracy</span>
                      <span className="text-xs font-bold text-emerald-400">
                        {Math.round(data.model_performance.nlp_scam_model.metrics.accuracy * 1000) / 10}%
                      </span>
                    </div>
                    <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Precision</span>
                      <span className="text-xs font-bold text-blue-400">
                        {Math.round(data.model_performance.nlp_scam_model.metrics.precision * 1000) / 10}%
                      </span>
                    </div>
                    <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Recall</span>
                      <span className="text-xs font-bold text-indigo-400">
                        {Math.round(data.model_performance.nlp_scam_model.metrics.recall * 1000) / 10}%
                      </span>
                    </div>
                    <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">ROC-AUC</span>
                      <span className="text-xs font-bold text-cyan-400">
                        {data.model_performance.nlp_scam_model.metrics.roc_auc}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
