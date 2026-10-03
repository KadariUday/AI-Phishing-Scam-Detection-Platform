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
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col justify-center items-center px-6 py-12 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="fixed inset-0 bg-radial-gradient pointer-events-none z-0" />
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none z-0 opacity-60" />

      {/* Brand Header */}
      <Link href="/" className="flex items-center gap-3 mb-8 relative z-10 group">
        <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20 group-hover:bg-blue-500 transition-colors">
          <Shield className="w-6 h-6" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-white">
            PhishGuard
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
            SOC
          </span>
        </div>
      </Link>

      {/* Reset Password Card */}
      <div className="w-full max-w-md panel-card p-8 relative z-10">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white tracking-tight">Reset Password</h2>
          <p className="text-xs text-slate-400 mt-1">
            We will dispatch account recovery instructions to your registered email
          </p>
        </div>

        {submitted ? (
          <div className="p-5 rounded-lg bg-emerald-950/20 border border-emerald-900/30 text-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-sm text-emerald-300 font-bold">
              Recovery Instructions Sent
            </p>
            <p className="text-xs text-slate-300 mt-1">
              If an active account exists for <span className="text-blue-400 font-semibold">{email}</span>, password reset instructions have been generated.
            </p>
            <Link
              href="/login"
              className="inline-block mt-4 text-xs text-blue-400 hover:text-blue-300 underline font-semibold"
            >
              &larr; Return to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5 uppercase tracking-wider">
                Registered Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst@domain.com"
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <span>Send Recovery Link</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {!submitted && (
          <p className="text-center text-xs text-slate-400 mt-6">
            Remember your credentials?{" "}
            <Link href="/login" className="text-blue-400 hover:text-blue-300 font-semibold underline transition-colors">
              Sign In Here
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
