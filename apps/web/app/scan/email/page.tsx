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
    tag: "Credential Harvesting",
  },
  {
    label: "Legitimate Corporate Newsletter",
    sender: "newsletter@fastapi.tiangolo.com",
    subject: "FastAPI Release Notes: What is new in version 0.110.0",
    body: "Here are the latest updates from the FastAPI repository, including performance improvements and dependency updates. Check the full docs at https://fastapi.tiangolo.com",
    tag: "Benign",
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
      <div className="space-y-8 max-w-5xl mx-auto">
        {/* 1. Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <MailWarning className="w-4 h-4" />
            </span>
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
              Multi-Vector Email Forensic Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-100">
            Email Threat & BEC Analyzer
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Holistic header inspection, sender domain reputation, subject line psychological cues, and body link extraction.
          </p>
        </div>

        {/* 2. Input Form Box */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl">
          <form onSubmit={handleScan} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-1.5">
                  Sender Email / Display Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={sender}
                    onChange={(e) => setSender(e.target.value)}
                    placeholder="security-alert@service.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-1.5">
                  Subject Line
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Immediate Action Required..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-1.5">
                Email Body Content
              </label>
              <textarea
                required
                rows={6}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Paste the email body text including any embedded links or instructions..."
                className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors shadow-inner resize-y"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="w-full">
                <span className="text-[11px] font-semibold text-slate-400 block mb-2">
                  Sample Email Phishing Templates:
                </span>
                <div className="flex flex-wrap gap-2">
                  {PRESET_EMAILS.map((item, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handlePresetSelect(item)}
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

              <button
                type="submit"
                disabled={loading || !body.trim()}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-500/20 whitespace-nowrap"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Triage in Progress...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Analyze Email</span>
                  </>
                )}
              </button>
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
