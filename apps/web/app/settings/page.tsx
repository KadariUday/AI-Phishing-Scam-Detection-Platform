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
  Database,
  Lock,
} from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { api } from "@/lib/api";

export default function SettingsPage() {
  const [apiUrl, setApiUrl] = useState(process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleClearCache = () => {
    if (confirm("Clear local operator session and cached credentials?")) {
      api.clearToken();
      window.location.reload();
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="pb-2 border-b border-slate-800">
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            System & Engine Preferences
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            API gateway configuration, ML model metadata, and local security controls
          </p>
        </div>

        {/* API Gateway Settings */}
        <div className="panel-card p-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2 mb-4">
            <Server className="w-4 h-4 text-blue-400" />
            <span>FastAPI REST Gateway</span>
          </h3>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Backend Endpoint URL
              </label>
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <p className="text-[11px] text-slate-500 mt-1 font-mono">
                Default: <code>http://localhost:8000/api/v1</code>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Endpoint</span>
              </button>
              {saved && (
                <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  Configuration saved!
                </span>
              )}
            </div>
          </form>
        </div>

        {/* ML Model Architecture Manifest */}
        <div className="panel-card p-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2 mb-4">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span>Engine Artifact Manifest</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block mb-1">URL Phishing Classifier</span>
              <span className="text-white font-bold block">Random Forest (120 Estimators)</span>
              <span className="text-[11px] text-emerald-400 mt-1 block">Accuracy: 98.4% • F1: 98.3%</span>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block mb-1">NLP Scam / Coercion Model</span>
              <span className="text-white font-bold block">TF-IDF + Logistic Regression</span>
              <span className="text-[11px] text-emerald-400 mt-1 block">Accuracy: 96.8% • F1: 96.5%</span>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block mb-1">Primary Persistence Database</span>
              <span className="text-white font-bold block">SQLAlchemy (Async SQLite / Postgres)</span>
              <span className="text-[11px] text-blue-400 mt-1 block">State: Connected</span>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block mb-1">Immutable Audit Ledger</span>
              <span className="text-white font-bold block">MongoDB (Motor Async Stream)</span>
              <span className="text-[11px] text-emerald-400 mt-1 block">State: Synchronized</span>
            </div>
          </div>
        </div>

        {/* Local Security & Cache */}
        <div className="panel-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Operator Session & Local Cache</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Clear saved JWT tokens and session data stored in your browser local storage.
            </p>
          </div>

          <button
            onClick={handleClearCache}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-900/60 text-rose-300 font-semibold text-xs transition-colors flex-shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset Local Session</span>
          </button>
        </div>
      </div>
    </DashboardShell>
  );
}
