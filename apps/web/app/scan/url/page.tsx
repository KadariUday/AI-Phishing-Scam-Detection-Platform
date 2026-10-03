"use client";

import React, { useState } from "react";
import { Globe, Search, Sparkles, AlertCircle, RefreshCw } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { ScanResultView } from "@/components/ScanResultView";
import { ScanResultData } from "@/lib/types";
import { api } from "@/lib/api";

const PRESET_URLS = [
  {
    label: "Bare IP Phishing",
    url: "http://192.168.1.1/paypal/login-verification.php?token=92841",
    tag: "High Threat",
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
      <div className="space-y-8 max-w-5xl mx-auto">
        {/* 1. Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Globe className="w-4 h-4" />
            </span>
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              Static Lexical & ML Classifier
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-100">
            Deep URL Threat Scanner
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Static 21-dimensional feature extraction, Shannon entropy profiling, and zero-day phishing detection without dynamic SSRF risk.
          </p>
        </div>

        {/* 2. Input Form Box */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl">
          <form onSubmit={handleScan} className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-2">
                Target URL
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/login or paste a suspicious link..."
                  className="w-full pl-4 pr-32 py-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors shadow-inner"
                />
                <button
                  type="submit"
                  disabled={loading || !url.trim()}
                  className="absolute right-2 px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-3.5 h-3.5" />
                      <span>Analyze URL</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Preset Buttons */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block mb-2">
                Quick Test Samples:
              </span>
              <div className="flex flex-wrap gap-2">
                {PRESET_URLS.map((item, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handlePresetSelect(item.url)}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-cyan-300 font-medium transition-colors flex items-center gap-2"
                  >
                    <span>{item.label}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                      {item.tag}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-3.5 rounded-xl bg-red-950/40 border border-red-800/60 flex items-center gap-2 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* 3. Scan Results View */}
        {result && <ScanResultView result={result} />}
      </div>
    </DashboardShell>
  );
}
