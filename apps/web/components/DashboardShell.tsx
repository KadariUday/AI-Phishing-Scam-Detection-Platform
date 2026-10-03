"use client";

import React from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

interface DashboardShellProps {
  children: React.ReactNode;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col md:flex-row relative">
      {/* Background subtle ambient gradient */}
      <div className="fixed inset-0 bg-radial-gradient pointer-events-none z-0" />
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none z-0 opacity-60" />

      {/* Sidebar for Desktop */}
      <div className="hidden md:block relative z-20">
        <Sidebar />
      </div>

      {/* Main Body */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <Topbar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
