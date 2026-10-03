"use client";

import React from "react";
import { RiskLevel } from "@/lib/types";
import { cn } from "@/lib/utils";

interface RiskGaugeProps {
  score: number; // 0 to 100
  level: RiskLevel | string;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showLabels?: boolean;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({
  score,
  level,
  size = 150,
  strokeWidth = 10,
  className,
  showLabels = true,
}) => {
  const radius = (size - strokeWidth - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.min(100, Math.max(0, Math.round(score)));
  const offset = circumference - (clampedScore / 100) * circumference;

  const getColorConfig = () => {
    const norm = (level || "SAFE").toUpperCase();
    switch (norm) {
      case "CRITICAL":
      case "PHISHING":
        return {
          stroke: "#EF4444",
          trackBg: "#1F1318",
          textColor: "text-rose-400",
          subtextColor: "text-rose-400/70",
          glow: "rgba(239, 68, 68, 0.25)",
        };
      case "HIGH":
        return {
          stroke: "#F97316",
          trackBg: "#1E1612",
          textColor: "text-orange-400",
          subtextColor: "text-orange-400/70",
          glow: "rgba(249, 115, 22, 0.25)",
        };
      case "MEDIUM":
      case "SUSPICIOUS":
        return {
          stroke: "#F59E0B",
          trackBg: "#1E1B13",
          textColor: "text-amber-400",
          subtextColor: "text-amber-400/70",
          glow: "rgba(245, 158, 11, 0.25)",
        };
      case "LOW":
        return {
          stroke: "#06B6D4",
          trackBg: "#0F1A22",
          textColor: "text-cyan-400",
          subtextColor: "text-cyan-400/70",
          glow: "rgba(6, 182, 212, 0.25)",
        };
      case "SAFE":
      case "BENIGN":
      default:
        return {
          stroke: "#10B981",
          trackBg: "#0E1C1A",
          textColor: "text-emerald-400",
          subtextColor: "text-emerald-400/70",
          glow: "rgba(16, 185, 129, 0.25)",
        };
    }
  };

  const config = getColorConfig();

  return (
    <div
      className={cn("relative inline-flex flex-col items-center justify-center select-none", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="rotate-[-90deg]">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1E293B"
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {/* Dynamic active arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={config.stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-700 ease-out"
          style={{
            filter: `drop-shadow(0 0 6px ${config.glow})`,
          }}
        />
      </svg>

      {/* Center readout */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className={cn("text-3xl font-extrabold font-mono tracking-tight leading-none", config.textColor)}>
          {clampedScore}
        </span>
        {showLabels && (
          <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase mt-1">
            SCORE / 100
          </span>
        )}
      </div>
    </div>
  );
};
