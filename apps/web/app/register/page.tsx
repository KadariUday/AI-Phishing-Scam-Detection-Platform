"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, Lock, Mail, User, ArrowRight, AlertCircle, Sparkles, UserPlus } from "lucide-react";
import { api } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.register(email, password, fullName);
      await api.login(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
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

      {/* 4. Register Card */}
      <div className="w-full max-w-md glass-hud hud-corner rounded-2xl p-8 relative z-10 shadow-2xl backdrop-blur-2xl">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
            <UserPlus className="w-3 h-3 text-cyan-400" />
            <span>NEW ANALYST ONBOARDING</span>
          </div>
          <h2 className="text-2xl font-black text-slate-100 tracking-tight">Create Operator Seat</h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Provision local credentials for threat detection
          </p>
        </div>

        {error && (
          <div className="p-3.5 mb-5 rounded-xl bg-rose-950/40 border border-rose-500/40 flex items-center gap-2 text-xs text-rose-300 shadow-lg shadow-rose-950/50">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-mono font-bold text-slate-300 block mb-1.5 uppercase tracking-wider">
              Analyst Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Alex Morgan"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl neu-input text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition-all font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono font-bold text-slate-300 block mb-1.5 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex.morgan@company.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl neu-input text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition-all font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono font-bold text-slate-300 block mb-1.5 uppercase tracking-wider">
              Password (min 8 chars)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl neu-input text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition-all font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-3 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-hud-cyan disabled:opacity-50"
          >
            <span>{loading ? "PROVISIONING ACCOUNT..." : "PROVISION OPERATOR ACCOUNT"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-6 font-mono">
          Already registered?{" "}
          <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-bold underline transition-colors">
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
}
