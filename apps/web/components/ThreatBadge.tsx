"use client";

import React from "react";
import { ShieldCheck, ShieldAlert, AlertTriangle, Flame, ShieldX } from "lucide-react";
import { RiskLevel } from "@/lib/types";
import { getRiskColor, cn } from "@/lib/utils";

interface ThreatBadgeProps {
  level: RiskLevel;
  className?: string;
  showIcon?: boolean;
}

export const ThreatBadge: React.FC<ThreatBadgeProps> = ({
  level,
  className,
  showIcon = true,
}) => {
  const getBadgeConfig = () => {
    switch (level) {
      case "CRITICAL":
        return {
          icon: <Flame className="w-3.5 h-3.5 text-red-400 animate-pulse" />,
          style: "bg-red-500/15 text-red-300 border-red-500/40 shadow-[0_0_12px_rgba(239,68,68,0.25)]",
          dot: "bg-red-400 shadow-[0_0_8px_#ef4444]",
        };
      case "HIGH":
        return {
          icon: <ShieldX className="w-3.5 h-3.5 text-orange-400" />,
          style: "bg-orange-500/15 text-orange-300 border-orange-500/40 shadow-[0_0_12px_rgba(249,115,22,0.25)]",
          dot: "bg-orange-400 shadow-[0_0_8px_#f97316]",
        };
      case "MEDIUM":
        return {
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />,
          style: "bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.25)]",
          dot: "bg-amber-400 shadow-[0_0_8px_#f59e0b]",
        };
      case "LOW":
        return {
          icon: <ShieldAlert className="w-3.5 h-3.5 text-sky-400" />,
          style: "bg-sky-500/15 text-sky-300 border-sky-500/40 shadow-[0_0_12px_rgba(14,165,233,0.25)]",
          dot: "bg-sky-400 shadow-[0_0_8px_#0ea5e9]",
        };
      case "SAFE":
      default:
        return {
          icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />,
          style: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-[0_0_12px_rgba(0,240,168,0.25)]",
          dot: "bg-emerald-400 shadow-[0_0_8px_#00f0a8]",
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-extrabold uppercase tracking-wider border backdrop-blur-md transition-all",
        config.style,
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", config.dot)} />
      {showIcon && config.icon}
      <span>{level}</span>
    </span>
  );
};
