"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User as UserIcon,
  LogOut,
  Shield,
  Search,
  Sparkles,
  Radio,
  Terminal,
  ChevronDown,
} from "lucide-react";
import { api } from "@/lib/api";
import { User } from "@/lib/types";

export const Topbar: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const saved = api.getSavedUser();
    if (saved) {
      setUser(saved);
    } else {
      setUser({
        id: "demo",
        email: "analyst@phishguard.ai",
        full_name: "Security Analyst",
        role: "USER",
        is_active: true,
        created_at: new Date().toISOString(),
      });
    }
  }, []);

  const handleLogout = () => {
    api.clearToken();
    setUser(null);
    router.push("/login");
  };

  return (
    <header className="h-16 border-b border-white/[0.06] bg-cyber-950/60 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-30 shadow-lg">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-900/80 border border-white/[0.06] text-[11px] font-mono text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#10b981]" />
          <span className="text-slate-400">STATUS:</span>
          <span className="text-cyan-300 font-bold">ARMED & SCANNING</span>
        </div>
      </div>

      <div className="flex items-center gap-3.5">
        {/* Quick Demo Scan CTA */}
        <Link
          href="/scan/url"
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500/20 via-blue-500/15 to-cyan-500/10 hover:from-cyan-500/30 hover:to-blue-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition-all shadow-hud-cyan group"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform" />
          <span>Quick Threat Scan</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
            ⌘K
          </span>
        </Link>

        {/* User profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full bg-slate-900/90 border border-white/[0.08] hover:border-cyan-500/40 transition-all text-left shadow-md"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-600/30 border border-cyan-400/50 flex items-center justify-center text-cyan-300 font-bold text-xs font-mono shadow-[0_0_10px_rgba(0,245,255,0.2)]">
              {user?.full_name ? user.full_name[0].toUpperCase() : "A"}
            </div>
            <div className="hidden md:block">
              <span className="text-xs font-bold text-slate-200 block leading-tight">
                {user?.full_name || "Analyst"}
              </span>
              <span className="text-[9px] text-cyan-400/80 font-mono block">
                {user?.role || "USER"} :: VERIFIED
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden md:block" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl glass-hud p-1.5 z-50 border border-slate-700 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3.5 py-2.5 border-b border-white/[0.06] mb-1">
                <p className="text-xs font-bold text-slate-100">{user?.full_name}</p>
                <p className="text-[10px] text-slate-400 font-mono truncate">{user?.email}</p>
              </div>
              <Link
                href="/settings"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
              >
                <UserIcon className="w-3.5 h-3.5 text-cyan-400" />
                Settings & API
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-red-400 hover:bg-red-950/40 transition-colors text-left"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
