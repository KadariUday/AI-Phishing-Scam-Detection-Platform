"use client";

import React from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { Activity, Radio, Cpu, ShieldCheck } from "lucide-react";

interface DashboardShellProps {
  children: React.ReactNode;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-cyber-950 text-slate-100 flex flex-col md:flex-row relative">
      {/* 1. Aurora Ambient Atmospheric Glows */}
      <div className="aurora-bg">
        <div className="aurora-blob-1" />
        <div className="aurora-blob-2" />
        <div className="aurora-blob-3" />
      </div>

      {/* 2. Cyber Grid Overlay */}
      <div className="fixed inset-0 cyber-grid-overlay pointer-events-none z-0 opacity-80" />

      {/* 3. Sidebar */}
      <div className="hidden md:block relative z-20">
        <Sidebar />
      </div>

      {/* 4. Main Body with HUD Topbar */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Tactical HUD Telemetry Ticker */}
        <div className="bg-cyber-950/90 border-b border-white/[0.04] px-6 py-1.5 flex items-center justify-between text-[10px] font-mono text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              LIVE TELEMETRY :: ONLINE
            </span>
            <span className="hidden sm:inline text-slate-500">|</span>
            <span className="hidden sm:inline text-slate-400">
              NODE: <span className="text-slate-200">LOCAL_LAPTOP_CORE</span>
            </span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:inline text-slate-400">
              ENGINES: <span className="text-emerald-400">RF-21 (98.4%)</span> + <span className="text-cyan-400">NLP-TFIDF (96.8%)</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-400">
              LATENCY: <span className="text-emerald-400 font-bold">&lt;1.2ms</span>
            </span>
            <span className="px-1.5 py-0.2 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[9px] font-semibold tracking-wider">
              DEFCON 5 :: NOMINAL
            </span>
          </div>
        </div>

        <Topbar />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
