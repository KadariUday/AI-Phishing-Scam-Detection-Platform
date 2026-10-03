"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, Lock, Mail, User, ArrowRight, AlertCircle, UserCheck } from "lucide-react";
import { api } from "@/lib/api";
import { User as UserType } from "@/lib/types";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedUser, setSavedUser] = useState<UserType | null>(null);

  useEffect(() => {
    const active = api.getSavedUser();
    if (active) {
      setSavedUser(active);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const cleanEmail = email.trim().toLowerCase();
    try {
      await api.register(cleanEmail, password, fullName.trim());
      await api.login(cleanEmail, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Registration failed. Please verify your details.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOutActive = () => {
    api.clearToken();
    setSavedUser(null);
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

      {/* Register Card */}
      <div className="w-full max-w-md panel-card p-8 relative z-10">
        {savedUser ? (
          <div className="p-4 mb-6 rounded-lg bg-blue-950/20 border border-blue-900/30 text-xs">
            <div className="flex items-center gap-2 text-blue-400 font-bold mb-1">
              <UserCheck className="w-4 h-4" />
              <span>Existing Active Session</span>
            </div>
            <p className="text-slate-300">
              You are currently signed in as <span className="font-mono text-blue-300 font-semibold">{savedUser.email}</span>.
            </p>
            <div className="flex items-center gap-3 mt-3">
              <Link
                href="/dashboard"
                className="px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-1 transition-colors"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                type="button"
                onClick={handleSignOutActive}
                className="text-slate-400 hover:text-slate-200 underline font-medium"
              >
                Sign Out to Register Another User
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white tracking-tight">Create Analyst Account</h2>
            <p className="text-xs text-slate-400 mt-1">
              One account per email &bull; Permanent credentials for future sign-ins
            </p>
          </div>
        )}

        {error && (
          <div className="p-3.5 mb-5 rounded-lg bg-rose-950/20 border border-rose-900/30 flex flex-col gap-1 text-xs text-rose-300">
            <div className="flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
            {(error.toLowerCase().includes("already registered") || error.toLowerCase().includes("already exists") || error.toLowerCase().includes("sign in") || error.toLowerCase().includes("log in")) && (
              <Link href="/login" className="mt-1 ml-6 text-blue-400 font-semibold hover:underline">
                &rarr; Click here to Sign In with your existing password
              </Link>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5 uppercase tracking-wider">
              Analyst Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Alex Morgan"
                className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5 uppercase tracking-wider">
              Unique Email Address (1 Email = 1 User)
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

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5 uppercase tracking-wider">
              Account Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Choose a secure password"
                className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 mt-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <span>{loading ? "Registering & Authenticating..." : "Create Account & Sign In"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-6">
          Already registered?{" "}
          <Link href="/login" className="text-blue-400 hover:text-blue-300 font-semibold underline transition-colors">
            Sign In with Existing Credentials
          </Link>
        </p>
      </div>
    </div>
  );
}
