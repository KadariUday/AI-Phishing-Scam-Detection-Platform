"use client";

import React, { useState } from "react";
import { Globe, Search, AlertCircle, RefreshCw, Sparkles, CheckCircle2 } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { ScanResultView } from "@/components/ScanResultView";
import { ScanResultData } from "@/lib/types";
import { api } from "@/lib/api";

const PRESET_URLS = [
  {
    label: "Bare IP Phishing",
    url: "http://192.168.1.1/paypal/login-verification.php?token=92841",
    tag: "High Risk",
  },
  {
    label: "Punycode Homograph",
    url: "http://xn--pypal-4ve.com/signin/account-check",
    tag: "Homograph",
  },
  {
    label: "Suspicious TLD + Subdomains",
    url: "http://appleid.verify-security.account-update.xyz/login.php",
    tag: "Abuse TLD",
  },
  {
    label: "Legitimate Corporate Domain",
    url: "https://www.microsoft.com/en-us/security/business",
    tag: "Safe Baseline",
  },
];

export default function URLScannerPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResultData | null>(null);

  const handleScan = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const data = await api.scanUrl(url.trim());
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to analyze URL. Please check formatting.");
    } finally {
      setLoading(false);
    }
  };

  const handlePresetSelect = (presetUrl: string) => {
    setUrl(presetUrl);
  };

  return (
    <DashboardShell>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Globe className="w-4 h-4" />
            </span>
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
              Static Lexical & ML Classifier
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            URL Threat Inspection
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Static 21-dimensional feature extraction, Shannon entropy profiling, and zero-day phishing detection.
          </p>
        </div>

        {/* Input Form Box */}
        <div className="panel-card p-6 sm:p-8">
          <form onSubmit={handleScan} className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-2">
                Target URL or Domain
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/login or paste a suspicious link..."
                  className="w-full pl-4 pr-32 py-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
                <button
                  type="submit"
                  disabled={loading || !url.trim()}
                  className="absolute right-2 px-4 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-3.5 h-3.5" />
                      <span>Inspect URL</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Presets */}
            <div className="pt-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Quick Test Vectors:
              </span>
              <div className="flex flex-wrap gap-2">
                {PRESET_URLS.map((preset, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handlePresetSelect(preset.url)}
                    className="px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <span className="text-[10px] text-blue-400 font-mono font-medium">[{preset.tag}]</span>
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-3.5 rounded-lg bg-rose-950/20 border border-rose-900/30 flex items-center gap-2.5 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Scan Result Component */}
        {result && (
          <div className="pt-2">
            <ScanResultView result={result} />
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
