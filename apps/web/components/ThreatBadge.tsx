"use client";

import React from "react";
import { ShieldCheck, ShieldAlert, AlertTriangle, AlertOctagon, CheckCircle2 } from "lucide-react";
import { RiskLevel } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ThreatBadgeProps {
  level: RiskLevel | string;
  className?: string;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
}

export const ThreatBadge: React.FC<ThreatBadgeProps> = ({
  level,
  className,
  showIcon = true,
  size = "md",
}) => {
  const normLevel = (level || "SAFE").toUpperCase();

  const getBadgeConfig = () => {
    switch (normLevel) {
      case "CRITICAL":
      case "PHISHING":
        return {
          icon: <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />,
          container: "bg-rose-500/10 text-rose-300 border-rose-500/30 hover:bg-rose-500/15",
          dot: "bg-rose-500",
        };
      case "HIGH":
        return {
          icon: <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />,
          container: "bg-orange-500/10 text-orange-300 border-orange-500/30 hover:bg-orange-500/15",
          dot: "bg-orange-500",
        };
      case "MEDIUM":
      case "SUSPICIOUS":
        return {
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />,
          container: "bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/15",
          dot: "bg-amber-500",
        };
      case "LOW":
        return {
          icon: <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />,
          container: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/15",
          dot: "bg-cyan-400",
        };
      case "SAFE":
      case "BENIGN":
      default:
        return {
          icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />,
          container: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/15",
          dot: "bg-emerald-400",
        };
    }
  };

  const config = getBadgeConfig();

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[11px] gap-1.5",
    md: "px-2.5 py-1 text-xs gap-2",
    lg: "px-3.5 py-1.5 text-sm gap-2.5",
  }[size];

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium tracking-wide rounded-md border transition-colors",
        config.container,
        sizeClasses,
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", config.dot)} />
      {showIcon && <span className="flex-shrink-0">{config.icon}</span>}
      <span className="font-semibold tracking-wider font-mono uppercase text-[11px]">{normLevel}</span>
    </span>
  );
};
