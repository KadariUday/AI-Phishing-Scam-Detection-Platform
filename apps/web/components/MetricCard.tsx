"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  borderColor?: string;
  tag?: string;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = "text-cyan-400",
  tag,
  className,
}) => {
  return (
    <div
      className={cn(
        "glass-hud glass-hud-hover hud-corner rounded-2xl p-5 relative overflow-hidden group",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
            {title}
          </span>
          {tag && (
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-slate-500">
              {tag}
            </span>
          )}
        </div>
        <div
          className={cn(
            "p-2.5 rounded-xl neu-input transition-transform group-hover:scale-110",
            iconColor
          )}
        >
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-3.5">
        <div className="text-3xl font-black font-mono text-slate-100 tracking-tight flex items-baseline gap-1.5">
          {value}
        </div>
        {subtitle && (
          <p className="text-[11px] text-slate-400 mt-1 font-mono flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-cyan-500/60" />
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};
