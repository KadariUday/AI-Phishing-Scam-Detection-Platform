"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  FileDown,
  Brain,
  Lock,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Copy,
  Check,
  Terminal,
  Cpu,
  Layers,
  Sparkles,
  Share2,
} from "lucide-react";
import { ScanResultData } from "@/lib/types";
import { RiskGauge } from "./RiskGauge";
import { ThreatBadge } from "./ThreatBadge";
import { ThreatIndicatorCard } from "./ThreatIndicatorCard";
import { api } from "@/lib/api";
import { formatDateTime, cn } from "@/lib/utils";

interface ScanResultViewProps {
  result: ScanResultData;
}

export const ScanResultView: React.FC<ScanResultViewProps> = ({ result }) => {
  const [showFeatures, setShowFeatures] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDownloadPdf = async () => {
    setIsExporting(true);
    try {
      const downloadUrl = api.getReportDownloadUrl(result.id);
      window.open(downloadUrl, "_blank");
    } catch (e) {
      console.error("PDF export failed:", e);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyTarget = () => {
    navigator.clipboard.writeText(result.target_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* 1. Executive Triage Summary Header */}
      <div className="panel-card p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <RiskGauge score={result.risk_score} level={result.risk_level} size={140} />
            
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <ThreatBadge level={result.risk_level} size="lg" />
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  Confidence: {Math.round(result.confidence * 100)}%
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Type: {result.scan_type}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {result.classification === "PHISHING" && "Malicious Phishing Attack Identified"}
                {result.classification === "SCAM" && "Fraudulent / Scam Coercion Detected"}
                {result.classification === "SUSPICIOUS" && "Suspicious Anomalies Requiring Caution"}
                {result.classification === "BENIGN" && "No Malicious Threat Detected (Verified Benign)"}
              </h2>

              <p className="text-xs text-slate-400 font-mono">
                Scan Ref: <span className="text-slate-300">{result.id.slice(0, 18)}...</span> &bull; {formatDateTime(result.created_at)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <FileDown className="w-4 h-4" />
              <span>{isExporting ? "Generating PDF..." : "Download Forensic Report"}</span>
            </button>
          </div>
        </div>

        {/* Target Ingested Content Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-blue-400" />
              Analyzed Payload
            </span>
            <button
              onClick={handleCopyTarget}
              className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied to clipboard" : "Copy Payload"}</span>
            </button>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 break-all select-all">
            {result.target_text}
          </div>
        </div>
      </div>

      {/* 2. Detected Threat Indicators Grid */}
      <div className="panel-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-orange-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">
              Threat Indicators ({result.threat_indicators.length})
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Heuristic & Statistical Rules</span>
        </div>

        {result.threat_indicators.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {result.threat_indicators.map((ind, i) => (
              <ThreatIndicatorCard key={i} indicator={ind} />
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-lg bg-emerald-950/20 border border-emerald-900/30 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <p className="text-xs text-emerald-300">
              No known threat signatures or structural anomalies were detected. The payload aligns with benign operational baselines.
            </p>
          </div>
        )}
      </div>

      {/* 3. Explainable AI (XAI) Rationale */}
      <div className="panel-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">
              Explainable AI (XAI) Attribution
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Factor Contribution</span>
        </div>

        <div className="space-y-2.5">
          {result.explanations.map((exp, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/70 border border-slate-800 text-xs text-slate-300 leading-relaxed"
            >
              <span className="w-5 h-5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono font-bold text-[11px] flex items-center justify-center flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span>{exp}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Defensive Action Recommendations */}
      <div className="panel-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">
              Defensive Playbook & Mitigation
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">SOC Response Actions</span>
        </div>

        <div className="space-y-2.5">
          {result.recommendations.map((rec, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 rounded-lg bg-emerald-950/15 border border-emerald-900/25 text-xs text-slate-200 leading-relaxed"
            >
              <span className="w-5 h-5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                ✓
              </span>
              <span>{rec}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Technical Feature Vector Matrix */}
      {result.features && (
        <div className="panel-card p-6">
          <button
            onClick={() => setShowFeatures(!showFeatures)}
            className="w-full flex items-center justify-between text-left text-xs font-bold text-slate-300 hover:text-white transition-colors"
          >
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-400" />
              <span>Extracted Technical Feature Matrix ({Object.keys(result.features).length} Dimensions)</span>
            </div>
            {showFeatures ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showFeatures && (
            <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {Object.entries(result.features).map(([key, val]) => (
                <div key={key} className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[11px] text-slate-400 font-mono block truncate">
                    {key}
                  </span>
                  <span className="text-xs font-mono font-bold text-blue-400 mt-1 block">
                    {typeof val === "boolean" ? (val ? "TRUE" : "FALSE") : String(val)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
