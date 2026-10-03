"use client";

import React from "react";
import { AlertCircle, AlertOctagon, Info, AlertTriangle, ShieldAlert } from "lucide-react";
import { ThreatIndicator } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ThreatIndicatorCardProps {
  indicator: ThreatIndicator;
}

export const ThreatIndicatorCard: React.FC<ThreatIndicatorCardProps> = ({ indicator }) => {
  const getSeverityConfig = () => {
    switch (indicator.severity) {
      case "CRITICAL":
        return {
          badge: "bg-red-500/20 text-red-300 border-red-500/40",
          icon: <AlertOctagon className="w-4 h-4 text-red-400 animate-pulse" />,
          border: "border-red-900/50 bg-gradient-to-r from-red-950/30 via-red-950/10 to-transparent shadow-[0_0_15px_rgba(239,68,68,0.12)]",
          tagColor: "text-red-400",
        };
      case "HIGH":
        return {
          badge: "bg-orange-500/20 text-orange-300 border-orange-500/40",
          icon: <AlertCircle className="w-4 h-4 text-orange-400" />,
          border: "border-orange-900/50 bg-gradient-to-r from-orange-950/30 via-orange-950/10 to-transparent shadow-[0_0_15px_rgba(249,115,22,0.12)]",
          tagColor: "text-orange-400",
        };
      case "MEDIUM":
        return {
          badge: "bg-amber-500/20 text-amber-300 border-amber-500/40",
          icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
          border: "border-amber-900/50 bg-gradient-to-r from-amber-950/30 via-amber-950/10 to-transparent shadow-[0_0_15px_rgba(245,158,11,0.12)]",
          tagColor: "text-amber-400",
        };
      case "LOW":
      default:
        return {
          badge: "bg-sky-500/20 text-sky-300 border-sky-500/40",
          icon: <Info className="w-4 h-4 text-sky-400" />,
          border: "border-sky-900/50 bg-gradient-to-r from-sky-950/30 via-sky-950/10 to-transparent shadow-[0_0_15px_rgba(14,165,233,0.12)]",
          tagColor: "text-sky-400",
        };
    }
  };

  const config = getSeverityConfig();

  return (
    <div
      className={cn(
        "p-4 rounded-xl border backdrop-blur-xl transition-all duration-200 relative group overflow-hidden",
        config.border
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-1.5">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-slate-900/80 border border-white/[0.08]">
            {config.icon}
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-100 tracking-tight">
              {indicator.title}
            </h4>
            <span className={cn("text-[9px] font-mono font-bold tracking-wider", config.tagColor)}>
              CODE :: {indicator.code}
            </span>
          </div>
        </div>

        <span
          className={cn(
            "text-[9px] font-mono font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider border",
            config.badge
          )}
        >
          {indicator.severity}
        </span>
      </div>

      <p className="text-xs text-slate-300 mt-2 leading-relaxed pl-1">
        {indicator.description}
      </p>
    </div>
  );
};
