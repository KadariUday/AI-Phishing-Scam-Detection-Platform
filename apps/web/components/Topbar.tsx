"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User as UserIcon,
  LogOut,
  Search,
  Plus,
  Bell,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import { api } from "@/lib/api";
import { User } from "@/lib/types";

export const Topbar: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const saved = api.getSavedUser();
    if (saved) {
      setUser(saved);
    }
  }, []);

  const handleLogout = () => {
    api.clearToken();
    setUser(null);
    router.push("/login");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/history?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-[#0B0F19]/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative w-72 sm:w-96">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search IOCs, domains, or audit logs..."
          className="w-full h-9 pl-9 pr-8 rounded-lg bg-slate-900 border border-slate-700/80 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
        />
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:flex items-center text-[10px] font-mono text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
          ↵
        </div>
      </form>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Quick Scan Action */}
        <Link
          href="/scan/url"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Scan</span>
        </Link>

        {/* Live System Indicator */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-medium text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-slate-400">SOC Triage:</span>
          <span className="text-emerald-400 font-semibold">Active</span>
        </div>

        {/* Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-800 transition-colors text-left"
          >
            <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold text-xs">
              {user?.full_name ? user.full_name[0].toUpperCase() : "A"}
            </div>
            <span className="text-xs font-medium text-slate-200 hidden md:block">
              {user?.full_name || "Analyst"}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-lg bg-slate-900 border border-slate-800 p-1.5 z-50 shadow-xl">
              <div className="px-3 py-2 border-b border-slate-800 mb-1">
                <p className="text-xs font-semibold text-slate-100">{user?.full_name || "Security Analyst"}</p>
                <p className="text-[11px] text-slate-400 truncate font-mono">{user?.email || "analyst@phishguard.ai"}</p>
              </div>
              <Link
                href="/settings"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                <span>Account & Preferences</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
