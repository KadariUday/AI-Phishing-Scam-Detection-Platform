"use client";

import React from "react";
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
  Terminal,
  Activity,
  Radio,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard, tag: "HUD" },
  { name: "Scan URL", href: "/scan/url", icon: Globe, tag: "21-DIM" },
  { name: "Analyze Message", href: "/scan/message", icon: MessageSquareWarning, tag: "NLP" },
  { name: "Analyze Email", href: "/scan/email", icon: MailWarning, tag: "BEC" },
  { name: "Scan History", href: "/history", icon: History, tag: "AUDIT" },
  { name: "Reports", href: "/reports", icon: FileText, tag: "PDF" },
  { name: "Analytics", href: "/analytics", icon: BarChart3, tag: "METRICS" },
  { name: "Settings", href: "/settings", icon: Settings, tag: "SYS" },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-white/[0.07] bg-cyber-950/80 backdrop-blur-2xl flex flex-col justify-between p-4 min-h-screen sticky top-0 shadow-2xl">
      <div>
        {/* Brand Logo & Tactical HUD Indicator */}
        <Link href="/" className="flex items-center gap-3 px-2 py-3 mb-6 group">
          <div className="relative">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 shadow-lg shadow-cyan-500/30 group-hover:shadow-cyan-400/50 transition-all">
              <Shield className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-cyber-950 animate-pulse" />
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight text-slate-100 flex items-center gap-1.5">
              PHISHGUARD <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">AI</span>
            </h1>
            <p className="text-[9px] text-slate-400 font-mono tracking-wider uppercase font-semibold">
              SEC_OP // THREAT_INTELLIGENCE
            </p>
          </div>
        </Link>

        {/* Section Label */}
        <div className="px-3 pb-2 text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider flex items-center justify-between">
          <span>OPERATIONAL MODULES</span>
          <Radio className="w-3 h-3 text-cyan-500/60 animate-pulse" />
        </div>

        {/* Navigation List */}
        <nav className="space-y-1.5">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 group relative",
                  isActive
                    ? "bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-transparent text-cyan-300 border border-cyan-500/40 shadow-hud-cyan font-bold"
                    : "text-slate-400 hover:text-slate-100 hover:bg-white/[0.04] border border-transparent"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "w-4 h-4 transition-colors",
                      isActive ? "text-cyan-400" : "text-slate-500 group-hover:text-slate-300"
                    )}
                  />
                  <span>{item.name}</span>
                </div>

                <span
                  className={cn(
                    "text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border transition-colors",
                    isActive
                      ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                      : "bg-slate-900/80 text-slate-500 border-slate-800 group-hover:text-slate-400"
                  )}
                >
                  {item.tag}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer System Status Card */}
      <div className="glass-hud hud-corner rounded-xl p-3.5 relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-200">
              CORE DEFENSE ACTIVE
            </span>
          </div>
          <span className="text-[9px] font-mono text-cyan-400 font-semibold">99.9%</span>
        </div>
        <p className="text-[10px] text-slate-400 font-mono leading-tight">
          Supervised Ensemble + XAI Attribution Engine v1.0.0 Online
        </p>
      </div>
    </aside>
  );
};
