"use client";

import React, { useState } from "react";
import { MessageSquareWarning, Search, AlertCircle, RefreshCw, Sparkles } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { ScanResultView } from "@/components/ScanResultView";
import { ScanResultData } from "@/lib/types";
import { api } from "@/lib/api";

const PRESET_MESSAGES = [
  {
    label: "Banking Smishing (OTP Theft)",
    text: "URGENT: Your Bank of America debit card has been SUSPENDED due to suspicious activity. Click http://192.168.1.1/bofa-verify to unlock your card and enter your OTP within 2 hours!",
    tag: "Critical Scam",
  },
  {
    label: "IRS Extortion Threat",
    text: "FINAL NOTICE: IRS has filed a lawsuit against you for tax evasion. Call immediately or police will be dispatched to arrest you today.",
    tag: "Threat / Coercion",
  },
  {
    label: "Lottery / Wire Fraud",
    text: "Congratulations! You won the $1,500,000 international lottery! Send your bank details and $200 processing fee via Western Union to claim your prize now.",
    tag: "Financial Fraud",
  },
  {
    label: "Legitimate Personal Chat",
    text: "Hey, are we still meeting for lunch at 12:30 pm today? Let me know if you want Italian or Mexican food.",
    tag: "Benign",
  },
];

export default function MessageScannerPage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResultData | null>(null);

  const handleScan = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const data = await api.scanMessage(text.trim());
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to analyze message content.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardShell>
      <div className="space-y-8 max-w-5xl mx-auto">
        {/* 1. Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <MessageSquareWarning className="w-4 h-4" />
            </span>
            <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider">
              NLP Intent & Social Engineering Triage
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-100">
            SMS & Message Scam Analyzer
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Detects psychological manipulation triggers: artificial urgency, fear intimidation, credential/OTP requests, and embedded links.
          </p>
        </div>

        {/* 2. Input Form Box */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl">
          <form onSubmit={handleScan} className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-2">
                Message Content (SMS, WhatsApp, Chat)
              </label>
              <textarea
                required
                rows={5}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste a suspicious SMS, WhatsApp message, social-media message, or chat text here..."
                className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors shadow-inner resize-y"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="w-full">
                <span className="text-[11px] font-semibold text-slate-400 block mb-2">
                  Quick Scam Samples:
                </span>
                <div className="flex flex-wrap gap-2">
                  {PRESET_MESSAGES.map((item, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setText(item.text)}
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
                disabled={loading || !text.trim()}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-orange-500/20 whitespace-nowrap"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing Content...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Analyze Message</span>
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
