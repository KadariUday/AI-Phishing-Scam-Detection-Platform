"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, Lock, Mail, ArrowRight, AlertCircle, Terminal } from "lucide-react";
import { api } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("analyst@phishguard.ai");
  const [password, setPassword] = useState("Analyst123!");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.login(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to authenticate. Please check your credentials.");
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

      {/* 4. Login Card with HUD brackets & Glassmorphism */}
      <div className="w-full max-w-md glass-hud hud-corner rounded-2xl p-8 relative z-10 shadow-2xl backdrop-blur-2xl">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
            <Terminal className="w-3 h-3 text-cyan-400" />
            <span>OPERATOR CONSOLE ACCESS</span>
          </div>
          <h2 className="text-2xl font-black text-slate-100 tracking-tight">Analyst Sign In</h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Authenticate to access live detection pipeline
          </p>
        </div>

        {error && (
          <div className="p-3.5 mb-5 rounded-xl bg-rose-950/40 border border-rose-500/40 flex flex-col gap-1 text-xs text-rose-300 shadow-lg shadow-rose-950/50">
            <div className="flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
            {error.toLowerCase().includes("sign up") && (
              <Link href="/register" className="mt-1 ml-6 text-cyan-300 font-bold hover:underline">
                → Click here to Create an Account
              </Link>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="analyst@phishguard.ai"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl neu-input text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition-all font-mono"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                Password
              </label>
              <Link href="/forgot-password" className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
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
            <span>{loading ? "AUTHENTICATING..." : "AUTHORIZE SESSION"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast-Fill helper */}
        <div className="mt-6 pt-4 border-t border-white/[0.06] text-center">
          <span className="text-[10px] text-slate-400 block mb-2 font-mono uppercase tracking-wider font-semibold">
            One-Click Demo Credentials
          </span>
          <div className="flex justify-center gap-2">
            <button
              onClick={() => {
                setEmail("analyst@phishguard.ai");
                setPassword("Analyst123!");
              }}
              type="button"
              className="px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 text-[11px] text-slate-300 font-mono transition-all hover:border-cyan-500/40"
            >
              Analyst Role
            </button>
            <button
              onClick={() => {
                setEmail("admin@phishguard.ai");
                setPassword("AdminSecure2026!");
              }}
              type="button"
              className="px-3 py-1.5 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/40 text-[11px] text-cyan-300 font-mono transition-all"
            >
              Admin Role
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6 font-mono">
          Need an analyst account?{" "}
          <Link href="/register" className="text-cyan-400 hover:text-cyan-300 font-bold underline transition-colors">
            Register Operator Seat
          </Link>
        </p>
      </div>
    </div>
  );
}
