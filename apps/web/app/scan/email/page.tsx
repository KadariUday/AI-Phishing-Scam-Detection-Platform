"use client";

import React, { useState } from "react";
import { MailWarning, Search, AlertCircle, RefreshCw, Send, User } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { ScanResultView } from "@/components/ScanResultView";
import { ScanResultData } from "@/lib/types";
import { api } from "@/lib/api";

const PRESET_EMAILS = [
  {
    label: "CEO / Payroll Spoof",
    sender: "executive-ceo@payroll-security-update.xyz",
    subject: "URGENT: Change in Direct Deposit Information Required Today",
    body: "Hi team, I am in an off-site conference today. Please update our executive direct deposit banking routing numbers immediately by clicking http://secure-portal.xyz/kyc",
    tag: "BEC / Spoof",
  },
  {
    label: "Netflix Subscription Suspension",
    sender: "support-billing@netflix-account-resolution.top",
    subject: "Payment Failed: Your subscription will be cancelled in 12 hours",
    body: "Dear Customer, we could not process your latest billing installment. Please update your debit or credit card number and CVV at http://netflix-billing-resolve.top to restore access.",
    tag: "Credential Theft",
  },
  {
    label: "Legitimate Corporate Newsletter",
    sender: "newsletter@fastapi.tiangolo.com",
    subject: "FastAPI Release Notes: What is new in version 0.110.0",
    body: "Here are the latest updates from the FastAPI repository, including performance improvements and dependency updates. Check the full docs at https://fastapi.tiangolo.com",
    tag: "Safe Baseline",
  },
];

export default function EmailScannerPage() {
  const [sender, setSender] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResultData | null>(null);

  const handleScan = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!body.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const data = await api.scanEmail(sender.trim(), subject.trim(), body.trim());
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to analyze email content.");
    } finally {
      setLoading(false);
    }
  };

  const handlePresetSelect = (p: typeof PRESET_EMAILS[0]) => {
    setSender(p.sender);
    setSubject(p.subject);
    setBody(p.body);
  };

  return (
    <DashboardShell>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <MailWarning className="w-4 h-4" />
            </span>
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
              Multi-Vector Email Forensic Engine
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Email & BEC Threat Analyzer
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Holistic header inspection, sender domain reputation, subject line psychological cues, and body link extraction.
          </p>
        </div>

        {/* Input Form Box */}
        <div className="panel-card p-6 sm:p-8">
          <form onSubmit={handleScan} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-1.5">
                  Sender Email / Display Header
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={sender}
                    onChange={(e) => setSender(e.target.value)}
                    placeholder="security-alert@service.com"
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-1.5">
                  Email Subject Line
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. URGENT: Action Required on Your Account"
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-1.5">
                Email Body Text & Embedded Hyperlinks <span className="text-rose-400">*</span>
              </label>
              <textarea
                required
                rows={5}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Paste the complete text or raw RFC 822 email content here..."
                className="w-full p-4 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Test Vectors:
                </span>
                <div className="flex flex-wrap gap-2">
                  {PRESET_EMAILS.map((preset, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handlePresetSelect(preset)}
                      className="px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-white transition-colors"
                    >
                      <span className="text-[10px] text-indigo-400 font-mono font-medium">[{preset.tag}]</span>{" "}
                      <span>{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !body.trim()}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing Email...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-3.5 h-3.5" />
                    <span>Analyze Email</span>
                  </>
                )}
              </button>
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
