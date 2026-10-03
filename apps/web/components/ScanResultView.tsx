"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  FileDown,
  BrainCircuit,
  Lock,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Info,
  CheckCircle2,
  Copy,
  Check,
  Terminal,
  Cpu,
  Radio,
} from "lucide-react";
import { ScanResultData } from "@/lib/types";
import { RiskGauge } from "./RiskGauge";
import { ThreatBadge } from "./ThreatBadge";
import { ThreatIndicatorCard } from "./ThreatIndicatorCard";
import { api } from "@/lib/api";
import { formatDateTime, getRiskColor, cn } from "@/lib/utils";

interface ScanResultViewProps {
  result: ScanResultData;
}

export const ScanResultView: React.FC<ScanResultViewProps> = ({ result }) => {
  const [showFeatures, setShowFeatures] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const riskColors = getRiskColor(result.risk_level);

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
      {/* 1. Hero Assessment Header with HUD Corner Brackets & Laser Scanner */}
      <div
        className={cn(
          "glass-hud hud-corner rounded-2xl p-6 sm:p-8 relative overflow-hidden border",
          riskColors.border,
          riskColors.glow
        )}
      >
        {/* Laser scan line subtle animation */}
        <div className="laser-scan-line animate-scan-laser" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <RiskGauge score={result.risk_score} level={result.risk_level} size={135} />
            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mb-2">
                <ThreatBadge level={result.risk_level} />
                <span className="text-[11px] text-cyan-300 font-mono px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30">
                  STATISTICAL CONFIDENCE: {Math.round(result.confidence * 100)}%
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  VECTOR :: {result.scan_type}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight">
                {result.classification === "PHISHING" && "Phishing & Credential Threat Detected"}
                {result.classification === "SCAM" && "Scam & Coercive Intent Detected"}
                {result.classification === "SUSPICIOUS" && "Suspicious Behavioral Anomaly Detected"}
                {result.classification === "BENIGN" && "Clean / Benign Verification Confirmed"}
              </h2>

              <p className="text-xs text-slate-400 mt-1.5 font-mono">
                SCAN ID: <span className="text-slate-200">{result.id.slice(0, 16)}...</span> • ANALYZED AT {formatDateTime(result.created_at)}
              </p>
            </div>
          </div>

          <button
            onClick={handleDownloadPdf}
            disabled={isExporting}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-cyan-500/10 hover:from-cyan-500/30 hover:to-blue-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold tracking-wide transition-all shadow-hud-cyan"
          >
            <FileDown className="w-4 h-4 text-cyan-400" />
            {isExporting ? "Generating PDF..." : "Export Forensic PDF"}
          </button>
        </div>

        {/* Target Payload Snippet with Copy Button */}
        <div className="mt-6 pt-5 border-t border-white/[0.08] relative z-10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              INGESTED TARGET PAYLOAD ({result.scan_type})
            </span>
            <button
              onClick={handleCopyTarget}
              className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? "Copied!" : "Copy Payload"}</span>
            </button>
          </div>

          <div className="p-3.5 rounded-xl neu-input font-mono text-xs text-slate-200 break-all select-all flex items-center justify-between">
            <span>{result.target_text}</span>
          </div>
        </div>
      </div>

      {/* 2. Threat Indicators Grid */}
      <div className="glass-hud hud-corner rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-200 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-orange-400" />
            DETECTED THREAT INDICATORS ({result.threat_indicators.length})
          </h3>
          <span className="text-[10px] font-mono text-slate-500">HEURISTIC // RULE_MATCH</span>
        </div>

        {result.threat_indicators.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {result.threat_indicators.map((ind, i) => (
              <ThreatIndicatorCard key={i} indicator={ind} />
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/40 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <p className="text-xs text-emerald-300 font-mono">
              No prominent hostile indicators detected. Input adheres to nominal security baseline.
            </p>
          </div>
        )}
      </div>

      {/* 3. Explainable AI (XAI) Rationale */}
      <div className="glass-hud hud-corner rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-200 flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-cyan-400" />
            EXPLAINABLE AI (XAI) FACTOR ATTRIBUTION
          </h3>
          <span className="text-[10px] font-mono text-slate-500">REASONING ENGINE</span>
        </div>

        <ul className="space-y-3">
          {result.explanations.map((exp, i) => (
            <li key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-white/[0.04] text-xs text-slate-200 leading-relaxed">
              <span className="text-cyan-400 font-mono font-bold">[{i + 1}]</span>
              <span>{exp}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 4. Actionable Defensive Countermeasures */}
      <div className="glass-hud hud-corner rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-200 flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            DEFENSIVE MITIGATION PLAYBOOK
          </h3>
          <span className="text-[10px] font-mono text-slate-500">RECOMMENDED ACTIONS</span>
        </div>

        <ul className="space-y-3">
          {result.recommendations.map((rec, i) => (
            <li key={i} className="flex items-start gap-3 p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/30 text-xs text-slate-200 leading-relaxed">
              <span className="text-emerald-400 font-mono font-bold">✓</span>
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 5. Raw Technical Feature Inspector */}
      {result.features && (
        <div className="glass-hud hud-corner rounded-2xl p-6">
          <button
            onClick={() => setShowFeatures(!showFeatures)}
            className="w-full flex items-center justify-between text-left text-xs font-mono font-bold text-slate-300 uppercase tracking-widest hover:text-cyan-300 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>TECHNICAL FEATURE EXTRACTION MATRIX ({Object.keys(result.features).length} DIMENSIONS)</span>
            </div>
            {showFeatures ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showFeatures && (
            <div className="mt-5 pt-4 border-t border-white/[0.08] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {Object.entries(result.features).map(([key, val]) => (
                <div key={key} className="p-3 rounded-xl neu-input">
                  <span className="text-[10px] text-slate-400 font-mono block truncate">
                    {key}
                  </span>
                  <span className="text-xs font-black font-mono text-cyan-300 mt-1 block">
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
