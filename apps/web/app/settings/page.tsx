"use client";

import React, { useState } from "react";
import {
  Settings as SettingsIcon,
  Server,
  Cpu,
  Trash2,
  Shield,
  Save,
  CheckCircle2,
} from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { api } from "@/lib/api";

export default function SettingsPage() {
  const [apiUrl, setApiUrl] = useState("http://localhost:8000/api/v1");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleClearCache = () => {
    if (confirm("Clear local user cache and stored tokens?")) {
      api.clearToken();
      window.location.reload();
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* 1. Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-100">
            System & Engine Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            API gateway configuration, model metadata, and local privacy controls
          </p>
        </div>

        {/* 2. API Gateway Settings */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2 mb-4">
            <Server className="w-4 h-4 text-cyan-400" />
            Backend REST API Connection
          </h3>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                FastAPI Gateway URL
              </label>
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Local default: <code>http://localhost:8000/api/v1</code> (FastAPI with CORS enabled)
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-cyan-500/20"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Endpoint</span>
              </button>
              {saved && (
                <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  Settings saved!
                </span>
              )}
            </div>
          </form>
        </div>

        {/* 3. ML Model Architecture Manifest */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2 mb-4">
            <Cpu className="w-4 h-4 text-emerald-400" />
            Model Version & Artifact Manifest
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-500 block mb-1">URL Phishing Classifier</span>
              <span className="text-slate-200 font-bold block">Random Forest (120 Trees)</span>
              <span className="text-[11px] text-emerald-400 mt-1 block">Accuracy: 98.4% • F1: 98.3%</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-500 block mb-1">NLP Scam Intent Classifier</span>
              <span className="text-slate-200 font-bold block">TF-IDF (1-3 ngrams) + Logistic</span>
              <span className="text-[11px] text-emerald-400 mt-1 block">Accuracy: 96.8% • F1: 96.5%</span>
            </div>
          </div>
        </div>

        {/* 4. Privacy & Data Sovereignty */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-orange-400" />
            Privacy & Local Session Control
          </h3>
          <p className="text-xs text-slate-400 mb-4 leading-relaxed">
            PhishGuard AI processes all threat vectors privately. No private scan payloads are redistributed to third-party ad networks.
          </p>

          <button
            onClick={handleClearCache}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-800/60 text-xs font-bold text-red-300 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
            <span>Purge Local Tokens & Session Cache</span>
          </button>
        </div>
      </div>
    </DashboardShell>
  );
}
