"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  LayoutDashboard,
  Globe,
  MessageSquareWarning,
  MailWarning,
  History,
  BarChart3,
  FileText,
  Settings,
  Activity,
  CheckCircle2,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { User } from "@/lib/types";

interface NavGroup {
  label: string;
  items: {
    name: string;
    href: string;
    icon: React.ElementType;
    badge?: string;
  }[];
}

const navGroups: NavGroup[] = [
  {
    label: "Investigation & Triage",
    items: [
      { name: "Operations Center", href: "/dashboard", icon: LayoutDashboard },
      { name: "URL Inspection", href: "/scan/url", icon: Globe, badge: "Live" },
      { name: "Message Analysis", href: "/scan/message", icon: MessageSquareWarning },
      { name: "Email Forensics", href: "/scan/email", icon: MailWarning },
    ],
  },
  {
    label: "Intelligence & Audit",
    items: [
      { name: "Incident History", href: "/history", icon: History },
      { name: "Forensic Reports", href: "/reports", icon: FileText, badge: "PDF" },
      { name: "Threat Analytics", href: "/analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Platform",
    items: [
      { name: "Settings & Keys", href: "/settings", icon: Settings },
    ],
  },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(api.getSavedUser());
  }, []);

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-[#0B0F19] flex flex-col justify-between p-4 min-h-screen sticky top-0 z-30 select-none">
      <div>
        {/* Brand Header */}
        <Link href="/" className="flex items-center gap-3 px-2 py-3 mb-6 group">
          <div className="p-2 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20 group-hover:bg-blue-500 transition-colors">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold tracking-tight text-white">
                PhishGuard
              </span>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
                SOC
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Cybersecurity Intelligence
            </p>
          </div>
        </Link>

        {/* Navigation Sections */}
        <div className="space-y-6">
          {navGroups.map((group) => (
            <div key={group.label}>
              <div className="px-3 pb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                {group.label}
              </div>
              <nav className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors relative group",
                        isActive
                          ? "bg-blue-600/15 text-blue-400 font-semibold border border-blue-500/25"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={cn(
                            "w-4 h-4 transition-colors",
                            isActive ? "text-blue-400" : "text-slate-400 group-hover:text-slate-300"
                          )}
                        />
                        <span>{item.name}</span>
                      </div>

                      {item.badge && (
                        <span
                          className={cn(
                            "text-[9px] font-mono font-medium px-1.5 py-0.5 rounded",
                            isActive
                              ? "bg-blue-500/20 text-blue-300"
                              : "bg-slate-800 text-slate-400 group-hover:bg-slate-700"
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </div>

      {/* Footer System Status & User Info */}
      <div className="space-y-3 pt-4 border-t border-slate-800/80">
        <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-xs">
          <div className="flex items-center justify-between text-slate-300 mb-1">
            <div className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Engine Status</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono font-semibold">Ready</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Heuristic + ML Triage Active
          </p>
        </div>

        {user ? (
          <div className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-slate-900/50 border border-slate-800">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-xs">
                {user.full_name?.charAt(0) || user.email?.charAt(0) || "U"}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-medium text-slate-200 truncate">
                  {user.full_name || "Analyst"}
                </p>
                <p className="text-[10px] text-slate-400 truncate font-mono">
                  {user.email || "analyst@phishguard.ai"}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                api.clearToken();
                window.location.href = "/login";
              }}
              title="Sign Out"
              className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>Sign In to SOC Console</span>
          </Link>
        )}
      </div>
    </aside>
  );
};
