"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Shield, Mail, ArrowRight, CheckCircle2, KeyRound } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-cyber-950 text-slate-100 flex flex-col justify-center items-center px-6 py-12 relative overflow-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 1. Aurora Atmospheric Background */}
      <div className="aurora-bg">
        <div className="aurora-blob-1" />
        <div className="aurora-blob-2" />
        <div className="aurora-blob-3" />
      </div>

      {/* 2. Cyber Grid */}
      <div className="fixed inset-0 cyber-grid-overlay pointer-events-none z-0 opacity-80" />

      {/* 3. Header Branding */}
      <Link href="/" className="flex items-center gap-3 mb-8 relative z-10 group">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 shadow-lg shadow-cyan-500/25 group-hover:shadow-cyan-400/40 transition-all">
          <Shield className="w-6 h-6 text-slate-950 stroke-[2.5]" />
        </div>
        <span className="text-xl font-extrabold tracking-tight text-slate-100 flex items-center gap-1.5">
          PHISHGUARD <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">AI</span>
        </span>
      </Link>

      {/* 4. Reset Password Card */}
      <div className="w-full max-w-md glass-hud hud-corner rounded-2xl p-8 relative z-10 shadow-2xl backdrop-blur-2xl">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
            <KeyRound className="w-3 h-3 text-cyan-400" />
            <span>CREDENTIAL RECOVERY PROTOCOL</span>
          </div>
          <h2 className="text-2xl font-black text-slate-100 tracking-tight">Reset Password</h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Dispatches password reset instructions to registered email
          </p>
        </div>

        {submitted ? (
          <div className="p-5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-center shadow-lg shadow-emerald-950/50">
            <CheckCircle2 className="w-9 h-9 text-emerald-400 mx-auto mb-2.5 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
            <p className="text-sm text-emerald-300 font-bold font-mono">
              Recovery Dispatch Sent
            </p>
            <p className="text-xs text-slate-300 mt-1.5 font-mono">
              If an active analyst account matches <span className="text-cyan-300 font-semibold">{email}</span>, recovery token instructions have been delivered.
            </p>
            <Link
              href="/login"
              className="inline-block mt-5 text-xs text-cyan-400 hover:text-cyan-300 underline font-mono font-bold"
            >
              ← Return to Operator Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-mono font-bold text-slate-300 block mb-1.5 uppercase tracking-wider">
                Registered Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst@phishguard.ai"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl neu-input text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition-all font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-3 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-hud-cyan"
            >
              <span>SEND RECOVERY LINK</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {!submitted && (
          <p className="text-center text-xs text-slate-400 mt-6 font-mono">
            Remember credentials?{" "}
            <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-bold underline transition-colors">
              Sign In Here
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
