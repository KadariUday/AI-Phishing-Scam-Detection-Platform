"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, Lock, Mail, ArrowRight, AlertCircle, KeyRound, CheckCircle2 } from "lucide-react";
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
      setError(err.message || "Authentication failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleUseDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
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

      {/* Login Card */}
      <div className="w-full max-w-md panel-card p-8 relative z-10">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white tracking-tight">Security Analyst Sign In</h2>
          <p className="text-xs text-slate-400 mt-1">
            Access real-time detection pipeline and threat workbench
          </p>
        </div>

        {error && (
          <div className="p-3.5 mb-5 rounded-lg bg-rose-950/20 border border-rose-900/30 flex flex-col gap-1 text-xs text-rose-300">
            <div className="flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
            {error.toLowerCase().includes("sign up") && (
              <Link href="/register" className="mt-1 ml-6 text-blue-400 font-semibold hover:underline">
                &rarr; Click here to Create an Account
              </Link>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="analyst@phishguard.ai"
                className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors font-mono"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 mt-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <span>{loading ? "Authenticating..." : "Sign In to Platform"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Credentials Box */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Pre-Seeded Demo Accounts:
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleUseDemo("analyst@phishguard.ai", "Analyst123!")}
              className="p-2 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-800 text-left transition-colors"
            >
              <span className="text-[10px] text-blue-400 font-mono font-bold block">Security Analyst</span>
              <span className="text-slate-300 font-mono text-[11px] truncate block">analyst@phishguard.ai</span>
            </button>
            <button
              type="button"
              onClick={() => handleUseDemo("admin@phishguard.ai", "AdminSecure2026!")}
              className="p-2 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-800 text-left transition-colors"
            >
              <span className="text-[10px] text-emerald-400 font-mono font-bold block">Lead SOC Admin</span>
              <span className="text-slate-300 font-mono text-[11px] truncate block">admin@phishguard.ai</span>
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Need an analyst account?{" "}
          <Link href="/register" className="text-blue-400 hover:text-blue-300 font-semibold underline transition-colors">
            Register Here
          </Link>
        </p>
      </div>
    </div>
  );
}
