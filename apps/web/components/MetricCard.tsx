"use client";

import React from "react";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
    isNeutral?: boolean;
  };
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  iconColor = "text-blue-400",
  iconBg = "bg-blue-500/10 border-blue-500/20",
  className,
}) => {
  return (
    <div
      className={cn(
        "panel-card panel-card-hover p-5 relative overflow-hidden transition-all duration-200",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold text-slate-400 tracking-wide uppercase">
          {title}
        </span>
        <div className={cn("p-2 rounded-lg border flex items-center justify-center", iconBg)}>
          <Icon className={cn("w-4 h-4", iconColor)} />
        </div>
      </div>

      <div className="mt-3">
        <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-white">
          {value}
        </div>

        <div className="flex items-center gap-2 mt-2">
          {trend && (
            <span
              className={cn(
                "inline-flex items-center gap-1 text-[11px] font-mono font-medium px-1.5 py-0.5 rounded",
                trend.isNeutral
                  ? "bg-slate-800 text-slate-400 border border-slate-700"
                  : trend.isPositive
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
              )}
            >
              {trend.isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : trend.isNeutral ? null : (
                <TrendingDown className="w-3 h-3" />
              )}
              {trend.value}
            </span>
          )}

          {subtitle && (
            <p className="text-xs text-slate-400 truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
