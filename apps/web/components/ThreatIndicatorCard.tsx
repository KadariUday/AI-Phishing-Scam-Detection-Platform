"use client";

import React from "react";
import { AlertOctagon, AlertTriangle, Info, ShieldAlert, ArrowRight } from "lucide-react";
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
          icon: <AlertOctagon className="w-4 h-4 text-rose-400 flex-shrink-0" />,
          cardBorder: "border-rose-500/30 bg-rose-950/10",
          tagBg: "bg-rose-500/10 text-rose-400 border-rose-500/30",
          codeColor: "text-rose-400",
        };
      case "HIGH":
        return {
          icon: <AlertTriangle className="w-4 h-4 text-orange-400 flex-shrink-0" />,
          cardBorder: "border-orange-500/30 bg-orange-950/10",
          tagBg: "bg-orange-500/10 text-orange-400 border-orange-500/30",
          codeColor: "text-orange-400",
        };
      case "MEDIUM":
        return {
          icon: <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />,
          cardBorder: "border-amber-500/30 bg-amber-950/10",
          tagBg: "bg-amber-500/10 text-amber-400 border-amber-500/30",
          codeColor: "text-amber-400",
        };
      case "LOW":
      default:
        return {
          icon: <Info className="w-4 h-4 text-sky-400 flex-shrink-0" />,
          cardBorder: "border-sky-500/30 bg-sky-950/10",
          tagBg: "bg-sky-500/10 text-sky-400 border-sky-500/30",
          codeColor: "text-sky-400",
        };
    }
  };

  const config = getSeverityConfig();

  return (
    <div
      className={cn(
        "p-4 rounded-lg border transition-all duration-150 flex flex-col gap-2",
        config.cardBorder
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
            {config.icon}
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-100">
              {indicator.title}
            </h4>
            <span className={cn("text-[10px] font-mono font-medium", config.codeColor)}>
              {indicator.code}
            </span>
          </div>
        </div>

        <span
          className={cn(
            "text-[10px] font-mono font-semibold px-2 py-0.5 rounded border uppercase tracking-wider",
            config.tagBg
          )}
        >
          {indicator.severity}
        </span>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed pl-0.5">
        {indicator.description}
      </p>
    </div>
  );
};
