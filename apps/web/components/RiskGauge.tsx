"use client";

import React from "react";
import { RiskLevel } from "@/lib/types";
import { getRiskColor, cn } from "@/lib/utils";

interface RiskGaugeProps {
  score: number; // 0 to 100
  level: RiskLevel;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({
  score,
  level,
  size = 140,
  strokeWidth = 9,
  className,
}) => {
  const colors = getRiskColor(level);
  const radius = (size - strokeWidth - 14) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(100, Math.max(0, score));
  const offset = circumference - (progress / 100) * circumference;

  const getStrokeHex = () => {
    switch (level) {
      case "CRITICAL":
        return "#ff0054";
      case "HIGH":
        return "#fb8500";
      case "MEDIUM":
        return "#ffb703";
      case "LOW":
        return "#00b4d8";
      case "SAFE":
      default:
        return "#00f0a8";
    }
  };

  const strokeHex = getStrokeHex();

  return (
    <div
      className={cn("relative inline-flex items-center justify-center p-2", className)}
      style={{ width: size, height: size }}
    >
      {/* Outer subtle HUD ring with crosshairs */}
      <div
        className="absolute rounded-full border border-white/[0.08] pointer-events-none"
        style={{ width: size - 4, height: size - 4 }}
      />
      <div
        className="absolute rounded-full border border-dashed border-white/[0.05] pointer-events-none animate-spin"
        style={{ width: size - 8, height: size - 8, animationDuration: "40s" }}
      />

      <svg width={size} height={size} className="rotate-[-90deg]">
        <defs>
          <filter id={`glow-${level}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#091322"
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {/* Outer tick marks */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius + 6}
          stroke="rgba(255, 255, 255, 0.12)"
          strokeWidth={1}
          strokeDasharray="2 6"
          fill="transparent"
        />

        {/* Animated progress ring with glow */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeHex}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          filter={`url(#glow-${level})`}
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      {/* Center Tactical Score Readout */}
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span
          className="text-3xl font-black font-mono tracking-tighter drop-shadow-md"
          style={{ color: strokeHex }}
        >
          {score}
        </span>
        <span className="text-[9px] text-slate-400 font-mono uppercase tracking-widest -mt-1">
          RISK / 100
        </span>
      </div>
    </div>
  );
};
