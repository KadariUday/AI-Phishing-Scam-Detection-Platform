"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Shield,
  ArrowRight,
  Globe,
  MessageSquareWarning,
  MailWarning,
  BrainCircuit,
  Lock,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Sparkles,
  Terminal,
  Activity,
  Cpu,
  Radio,
} from "lucide-react";
import { ThreatBadge } from "@/components/ThreatBadge";
import { RiskGauge } from "@/components/RiskGauge";

export default function LandingPage() {
  const [demoInput, setDemoInput] = useState(
    "http://192.168.1.1/paypal-secure/verify-account.php?token=92841"
  );
  const [demoType, setDemoType] = useState<"phishing" | "benign">("phishing");

  const toggleDemo = (type: "phishing" | "benign") => {
    setDemoType(type);
    if (type === "phishing") {
      setDemoInput("http://192.168.1.1/paypal-secure/verify-account.php?token=92841");
    } else {
      setDemoInput("https://login.microsoftonline.com/common/oauth2/v2.0/authorize");
    }
  };

  return (
    <div className="min-h-screen bg-cyber-950 text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-x-hidden">
      {/* 1. Aurora Ambient Atmospheric Glows */}
      <div className="aurora-bg">
        <div className="aurora-blob-1" />
        <div className="aurora-blob-2" />
        <div className="aurora-blob-3" />
      </div>

      {/* 2. Cyber Grid Overlay */}
      <div className="fixed inset-0 cyber-grid-overlay pointer-events-none z-0 opacity-80" />

      {/* 3. Header Navigation */}
      <header className="border-b border-white/[0.06] bg-cyber-950/70 backdrop-blur-xl sticky top-0 z-40 shadow-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 shadow-lg shadow-cyan-500/25 group-hover:shadow-cyan-400/40 transition-all">
              <Shield className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <span className="text-base font-extrabold tracking-tight text-slate-100 flex items-center gap-1.5">
              PHISHGUARD <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">AI</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-xs font-mono font-semibold text-slate-400">
            <a href="#features" className="hover:text-cyan-300 transition-colors">FEATURES</a>
            <a href="#how-it-works" className="hover:text-cyan-300 transition-colors">PIPELINE</a>
            <a href="#technology" className="hover:text-cyan-300 transition-colors">MODELS (98.4%)</a>
            <a href="#security" className="hover:text-cyan-300 transition-colors">DEFENSE POLICY</a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold text-slate-300 hover:text-white hover:bg-white/[0.05] transition-all"
            >
              SIGN IN
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 text-xs font-black tracking-wide transition-all shadow-hud-cyan"
            >
              <span>LAUNCH PLATFORM</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* 4. Hero Section */}
      <section className="relative pt-20 pb-16 px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold uppercase tracking-wider mb-6 shadow-hud-cyan backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00f5ff]" />
            DEFENSE ARMED :: 21-DIM URL & NLP INTENT TRIAGE
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-100 leading-[1.1]">
            Detect Threats <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400">
              Before They Detect You.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 mt-6 max-w-2xl mx-auto leading-relaxed font-normal">
            Enterprise-calibrated cybersecurity platform combining 21-dimensional static lexical URL feature extraction, NLP psychological coercion triage, and transparent Explainable AI.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <Link
              href="/scan/url"
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs font-mono uppercase tracking-wider transition-all shadow-hud-cyan"
            >
              <Globe className="w-4 h-4" />
              <span>Analyze Suspicious URL</span>
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl glass-hud glass-hud-hover text-slate-200 font-bold text-xs font-mono uppercase tracking-wider transition-all"
            >
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <span>Live Threat Workbench</span>
            </Link>
          </div>
        </div>

        {/* Live Interactive Simulation HUD Widget */}
        <div className="max-w-4xl mx-auto mt-16 glass-hud hud-corner rounded-3xl p-6 sm:p-8 border border-white/[0.08] shadow-2xl relative">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_6px_#ef4444]" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 shadow-[0_0_6px_#f59e0b]" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 shadow-[0_0_6px_#10b981]" />
              <span className="text-xs font-mono font-bold text-slate-300 ml-2">
                HUD_LIVE_INSPECTION_MATRIX.SH
              </span>
            </div>

            <div className="flex items-center gap-2 neu-input p-1 rounded-xl text-xs font-mono">
              <button
                onClick={() => toggleDemo("phishing")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  demoType === "phishing"
                    ? "bg-red-500/20 text-red-300 border border-red-500/40 shadow-[0_0_12px_rgba(239,68,68,0.3)]"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                PHISHING ATTACK VECTOR
              </button>
              <button
                onClick={() => toggleDemo("benign")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  demoType === "benign"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_12px_rgba(0,240,168,0.3)]"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                BENIGN ENTERPRISE VECTOR
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 w-full text-left">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-2">
                INGESTED TARGET PAYLOAD
              </span>
              <div className="p-3.5 rounded-xl neu-input font-mono text-xs text-slate-200 break-all select-all">
                {demoInput}
              </div>

              <div className="mt-5 space-y-2.5">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">
                  XAI FACTOR ATTRIBUTION EXPLANATION
                </span>
                {demoType === "phishing" ? (
                  <>
                    <div className="flex items-start gap-2.5 text-xs text-red-300 p-2 rounded-lg bg-red-950/20 border border-red-900/30">
                      <span className="text-red-400 font-mono font-bold">[1]</span>
                      <span>Bare IPv4 host address bypassing top-level DNS reputation registries</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-red-300 p-2 rounded-lg bg-red-950/20 border border-red-900/30">
                      <span className="text-red-400 font-mono font-bold">[2]</span>
                      <span>Deceptive path tokens mimicking PayPal authentication gateways</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start gap-2.5 text-xs text-emerald-300 p-2 rounded-lg bg-emerald-950/20 border border-emerald-900/30">
                      <span className="text-emerald-400 font-mono font-bold">[1]</span>
                      <span>High-reputation official Microsoft corporate root domain</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-emerald-300 p-2 rounded-lg bg-emerald-950/20 border border-emerald-900/30">
                      <span className="text-emerald-400 font-mono font-bold">[2]</span>
                      <span>Standard OAuth2 authorization endpoint with valid TLS encryption</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-col items-center justify-center p-5 rounded-2xl glass-hud min-w-[190px]">
              <RiskGauge
                score={demoType === "phishing" ? 94 : 6}
                level={demoType === "phishing" ? "CRITICAL" : "SAFE"}
                size={120}
              />
              <div className="mt-2 text-center">
                <ThreatBadge level={demoType === "phishing" ? "CRITICAL" : "SAFE"} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Core Features Section */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto border-t border-white/[0.06] relative z-10">
        <div className="text-center mb-16">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
            DEFENSIVE ARSENAL
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 mt-2">
            Multi-Vector AI Intelligence Modules
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Globe,
              title: "URL Intelligence",
              desc: "Extracts 21 static lexical dimensions, Shannon entropy across host and path, punycode spoofing, and IP hostnames without dynamic SSRF risk.",
            },
            {
              icon: MessageSquareWarning,
              title: "Scam & Smishing Detection",
              desc: "NLP intent modeling identifies psychological pressure points: artificial urgency, fear of arrest, OTP harvesting, and financial wire fraud.",
            },
            {
              icon: MailWarning,
              title: "Email Forensic Analyzer",
              desc: "Dissects sender headers, subject line threats, brand impersonation cues, and embedded links in holistic multi-vector scans.",
            },
            {
              icon: BrainCircuit,
              title: "Explainable AI (XAI)",
              desc: "Transparent factor attribution highlights exactly why a score was assigned, eliminating opaque black-box AI ambiguities.",
            },
            {
              icon: Lock,
              title: "Hybrid Risk Scoring",
              desc: "Combines statistical ML probabilities with deterministic rule penalties to provide calibrated 0–100 risk levels.",
            },
            {
              icon: BarChart3,
              title: "Executive Reports & Audit",
              desc: "Generates instant forensic PDF reports and aggregates organizational analytics without transmitting data to paid cloud APIs.",
            },
          ].map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div
                key={i}
                className="glass-hud glass-hud-hover hud-corner rounded-2xl p-6 relative overflow-hidden group"
              >
                <div className="p-3 rounded-xl neu-input text-cyan-400 w-fit mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-100 mb-2">{feat.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Footer */}
      <footer id="security" className="border-t border-white/[0.06] bg-cyber-950/90 py-12 px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono font-bold text-slate-200 tracking-wider uppercase">
                PHISHGUARD AI :: DEFENSIVE CYBERSECURITY PLATFORM
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
              PhishGuard AI provides automated statistical and heuristic risk assessments. Designed as an academic thesis and production cybersecurity platform.
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs font-mono font-semibold text-slate-400">
            <Link href="/login" className="hover:text-cyan-400 transition-colors">SIGN IN</Link>
            <Link href="/register" className="hover:text-cyan-400 transition-colors">REGISTER</Link>
            <Link href="/dashboard" className="hover:text-cyan-400 transition-colors">DASHBOARD</Link>
            <Link href="/scan/url" className="hover:text-cyan-400 transition-colors">SCANNER</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
