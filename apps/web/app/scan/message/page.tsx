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
    tag: "Safe Baseline",
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
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <MessageSquareWarning className="w-4 h-4" />
            </span>
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              NLP Intent & Social Engineering Triage
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            SMS & Message Scam Analyzer
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Detects psychological manipulation triggers: artificial urgency, fear intimidation, credential/OTP requests, and embedded links.
          </p>
        </div>

        {/* Input Form Box */}
        <div className="panel-card p-6 sm:p-8">
          <form onSubmit={handleScan} className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-2">
                Message Content (SMS, WhatsApp, Direct Message) <span className="text-rose-400">*</span>
              </label>
              <textarea
                required
                rows={5}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste a suspicious SMS, WhatsApp message, social media direct message, or chat text here..."
                className="w-full p-4 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors shadow-inner resize-y"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Test Vectors:
                </span>
                <div className="flex flex-wrap gap-2">
                  {PRESET_MESSAGES.map((item, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setText(item.text)}
                      className="px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-white transition-colors"
                    >
                      <span className="text-[10px] text-amber-400 font-mono font-medium">[{item.tag}]</span>{" "}
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !text.trim()}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing Intent...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-3.5 h-3.5" />
                    <span>Analyze Message</span>
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
