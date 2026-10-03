import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { RiskLevel } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateTime(dateString: string): string {
  if (!dateString) return "N/A";
  try {
    const d = new Date(dateString);
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
}

export function getRiskColor(level: RiskLevel): {
  bg: string;
  text: string;
  border: string;
  badge: string;
  glow: string;
} {
  switch (level) {
    case "CRITICAL":
      return {
        bg: "bg-red-950/40",
        text: "text-red-400",
        border: "border-red-600/50",
        badge: "bg-red-500/20 text-red-300 border-red-500/40",
        glow: "shadow-[0_0_15px_rgba(239,68,68,0.25)]",
      };
    case "HIGH":
      return {
        bg: "bg-orange-950/40",
        text: "text-orange-400",
        border: "border-orange-600/50",
        badge: "bg-orange-500/20 text-orange-300 border-orange-500/40",
        glow: "shadow-[0_0_15px_rgba(249,115,22,0.25)]",
      };
    case "MEDIUM":
      return {
        bg: "bg-amber-950/40",
        text: "text-amber-400",
        border: "border-amber-600/50",
        badge: "bg-amber-500/20 text-amber-300 border-amber-500/40",
        glow: "shadow-[0_0_15px_rgba(245,158,11,0.25)]",
      };
    case "LOW":
      return {
        bg: "bg-sky-950/40",
        text: "text-sky-400",
        border: "border-sky-600/50",
        badge: "bg-sky-500/20 text-sky-300 border-sky-500/40",
        glow: "shadow-[0_0_15px_rgba(14,165,233,0.25)]",
      };
    case "SAFE":
    default:
      return {
        bg: "bg-emerald-950/40",
        text: "text-emerald-400",
        border: "border-emerald-600/50",
        badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
        glow: "shadow-[0_0_15px_rgba(16,185,129,0.25)]",
      };
  }
}
