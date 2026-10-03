"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Shield,
  ArrowRight,
  Globe,
  MessageSquareWarning,
  MailWarning,
  Lock,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Terminal,
  Activity,
  Cpu,
  FileText,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { ThreatBadge } from "@/components/ThreatBadge";
import { RiskGauge } from "@/components/RiskGauge";

export default function LandingPage() {
  const [activeDemo, setActiveDemo] = useState<"url_phish" | "url_safe" | "email_phish" | "sms_phish">("url_phish");

  const demoPresets = {
    url_phish: {
      type: "URL Threat",
      target: "http://192.168.1.1/paypal-account-update/login.php?session=9284",
      riskScore: 94,
      riskLevel: "CRITICAL",
      classification: "PHISHING",
      confidence: 0.98,
      indicators: [
        "Direct IPv4 host bypassing DNS reputation controls",
        "Targeted PayPal brand spoofing in URI path token",
        "High information entropy (4.32 bits/char) in parameter string",
      ],
      recommendation: "Immediate perimeter firewall block and domain blacklisting.",
    },
    url_safe: {
      type: "URL Inspection",
      target: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
      riskScore: 6,
      riskLevel: "SAFE",
      classification: "BENIGN",
      confidence: 0.99,
      indicators: [
        "Verified high-reputation domain (.microsoftonline.com)",
        "Strict Transport Security (HSTS) with valid root CA",
        "Standard RFC-compliant OAuth 2.0 authorization endpoint",
      ],
      recommendation: "Traffic verified benign. Nominal enterprise access allowed.",
    },
    email_phish: {
      type: "Email Analysis",
      target: "Urgent: Immediate Wire Transfer Required for Supplier Invoice #94021 - Sent by ceo-executive@payroll-urgent.org",
      riskScore: 88,
      riskLevel: "HIGH",
      classification: "PHISHING",
      confidence: 0.94,
      indicators: [
        "Severe psychological urgency (CEO Fraud / BEC vector)",
        "Financial coercion keywords ('wire transfer', 'invoice')",
        "Lookalike domain spoofing executive communications",
      ],
      recommendation: "Quarantine email across corporate gateway and alert recipient.",
    },
    sms_phish: {
      type: "SMS / Smishing",
      target: "[ALERT] Your Chase Bank debit card is frozen. Verify immediately at http://chase-security-verify.top/auth to restore access.",
      riskScore: 92,
      riskLevel: "CRITICAL",
      classification: "SCAM",
      confidence: 0.97,
      indicators: [
        "Urgent account suspension lure aimed at credential theft",
        "Suspicious top-level domain (.top) with banking brand imitation",
        "Deceptive SMS phishing vector bypassing telecom filters",
      ],
      recommendation: "Do not interact. Report sender number to telecom carrier.",
    },
  };

  const currentDemo = demoPresets[activeDemo];

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col relative overflow-x-hidden">
      {/* Background Gradients */}
      <div className="fixed inset-0 bg-radial-gradient pointer-events-none z-0" />
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none z-0 opacity-60" />

      {/* Navigation Header */}
      <header className="border-b border-slate-800/80 bg-[#0B0F19]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20 group-hover:bg-blue-500 transition-colors">
              <Shield className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-white">
                PhishGuard
              </span>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
                ENTERPRISE
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Capabilities</a>
            <a href="#pipeline" className="hover:text-white transition-colors">Detection Architecture</a>
            <a href="#playground" className="hover:text-white transition-colors">Live Sandbox</a>
            <a href="#specs" className="hover:text-white transition-colors">Technical Specs</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-3.5 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <span>Launch Platform</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-6 z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span>Multi-Layer Cybersecurity Intelligence Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Stop Phishing & Social Engineering Attacks <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-400">
              Before They Compromise Your Assets
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 mt-6 max-w-2xl mx-auto leading-relaxed">
            High-precision security operations platform combining 21-dimensional static lexical analysis, natural language psychological intent extraction, and Explainable AI (XAI) feature attribution.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5 mt-8">
            <Link
              href="/scan/url"
              className="flex items-center gap-2 px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-sm"
            >
              <Globe className="w-4 h-4" />
              <span>Inspect Suspicious URL</span>
            </Link>
            <Link
              href="/scan/email"
              className="flex items-center gap-2 px-5 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs transition-colors"
            >
              <MailWarning className="w-4 h-4 text-blue-400" />
              <span>Analyze Phishing Email</span>
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-5 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs transition-colors"
            >
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span>SOC Operations Console</span>
            </Link>
          </div>
        </div>

        {/* Live Interactive Forensics Sandbox */}
        <div id="playground" className="max-w-5xl mx-auto mt-16 panel-card p-6 sm:p-8 relative">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-semibold text-slate-200">
                Interactive Triage Sandbox
              </span>
            </div>

            {/* Presets Toggle */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-lg bg-slate-950 border border-slate-800 text-xs">
              <button
                onClick={() => setActiveDemo("url_phish")}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  activeDemo === "url_phish"
                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Phishing URL
              </button>
              <button
                onClick={() => setActiveDemo("email_phish")}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  activeDemo === "email_phish"
                    ? "bg-orange-500/20 text-orange-300 border border-orange-500/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                BEC Email Fraud
              </button>
              <button
                onClick={() => setActiveDemo("sms_phish")}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  activeDemo === "sms_phish"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Smishing SMS
              </button>
              <button
                onClick={() => setActiveDemo("url_safe")}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  activeDemo === "url_safe"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Legitimate OAuth
              </button>
            </div>
          </div>

          {/* Sandbox Body */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-center">
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-slate-950/60 rounded-xl border border-slate-800 text-center">
              <RiskGauge
                score={currentDemo.riskScore}
                level={currentDemo.riskLevel}
                size={140}
              />
              <div className="mt-4 space-y-1">
                <ThreatBadge level={currentDemo.riskLevel} size="md" />
                <p className="text-xs text-slate-400 mt-2">
                  Confidence: <span className="text-slate-200 font-mono font-medium">{Math.round(currentDemo.confidence * 100)}%</span>
                </p>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-4">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Target Vector ({currentDemo.type})
                </span>
                <div className="mt-1.5 p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 break-all select-all">
                  {currentDemo.target}
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Key Detected Indicators
                </span>
                <div className="mt-1.5 space-y-1.5">
                  {currentDemo.indicators.map((ind, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300"
                    >
                      <span className="text-blue-400 font-mono text-[11px] font-semibold mt-0.5">•</span>
                      <span>{ind}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-blue-950/20 border border-blue-900/30 flex items-start gap-2 text-xs text-blue-200">
                <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Actionable Mitigation: </span>
                  {currentDemo.recommendation}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics / Capabilities Banner */}
      <section className="border-y border-slate-800/80 bg-[#0B0F19]/90 py-10 px-6 z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white">
              98.4%
            </div>
            <p className="text-xs font-medium text-slate-400 mt-1">
              Cross-Validated Model Precision
            </p>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-blue-400">
              &lt; 12ms
            </div>
            <p className="text-xs font-medium text-slate-400 mt-1">
              Average Feature Extraction Latency
            </p>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-400">
              21 Dim
            </div>
            <p className="text-xs font-medium text-slate-400 mt-1">
              Static Lexical & Entropy Vectors
            </p>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-indigo-400">
              100%
            </div>
            <p className="text-xs font-medium text-slate-400 mt-1">
              Transparent XAI Auditability
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">
            Defense Capabilities
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Engineered for Modern Security Operations
          </h3>
          <p className="text-slate-400 text-sm mt-3">
            Comprehensive triage pipelines covering web, email, SMS vectors, and forensic reporting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="panel-card panel-card-hover p-6">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
              <Globe className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white mb-2">
              21-Dimensional URL Analyzer
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Extracts Shannon entropy, IDN homograph punycode, IP-based hosting, keyword evasion, and suspicious TLD patterns in real time without executing untrusted remote code.
            </p>
            <Link
              href="/scan/url"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 mt-4 transition-colors"
            >
              <span>Scan Suspicious URLs</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="panel-card panel-card-hover p-6">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
              <MailWarning className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white mb-2">
              NLP Intent & BEC Detection
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dissects psychological urgency, executive spoofing patterns, wire transfer coercion, and credential harvesting signals using TF-IDF feature mapping.
            </p>
            <Link
              href="/scan/email"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 mt-4 transition-colors"
            >
              <span>Analyze Phishing Emails</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="panel-card panel-card-hover p-6">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white mb-2">
              Forensic PDF Reports & Compliance
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generates executive-ready PDF audit trails with cryptographic risk breakdown, feature importance vectors, and immutable MongoDB compliance logging.
            </p>
            <Link
              href="/reports"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 mt-4 transition-colors"
            >
              <span>View Audit Reports</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Detection Pipeline Section */}
      <section id="pipeline" className="py-16 px-6 bg-[#0B0F19]/60 border-t border-slate-800 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">
              Architecture
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Multi-Layer Defense Pipeline
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="panel-card p-5">
              <span className="text-xs font-mono font-bold text-blue-400">01 / INGESTION</span>
              <h4 className="text-sm font-bold text-white mt-1 mb-2">Payload Sanitization</h4>
              <p className="text-xs text-slate-400">
                Safe parsing of raw URIs, RFC 822 email headers, and SMS messages without risking drive-by execution.
              </p>
            </div>

            <div className="panel-card p-5">
              <span className="text-xs font-mono font-bold text-indigo-400">02 / FEATURE EXTRACTION</span>
              <h4 className="text-sm font-bold text-white mt-1 mb-2">Static Lexical Engine</h4>
              <p className="text-xs text-slate-400">
                Computes 21 discrete structural properties including entropy, subdomain depth, and keyword embeddings.
              </p>
            </div>

            <div className="panel-card p-5">
              <span className="text-xs font-mono font-bold text-sky-400">03 / INFERENCE</span>
              <h4 className="text-sm font-bold text-white mt-1 mb-2">Ensemble Classification</h4>
              <p className="text-xs text-slate-400">
                Random Forest & TF-IDF Logistic Regression models compute calibrated statistical probabilities.
              </p>
            </div>

            <div className="panel-card p-5">
              <span className="text-xs font-mono font-bold text-emerald-400">04 / EXPLAINABILITY</span>
              <h4 className="text-sm font-bold text-white mt-1 mb-2">XAI & Action Plan</h4>
              <p className="text-xs text-slate-400">
                Translates model weights into human-readable SOC explanations and defensive countermeasures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800 bg-[#070A12] py-8 px-6 z-10 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Shield className="w-4 h-4 text-blue-400" />
            <span className="font-semibold text-slate-300">PhishGuard Cybersecurity Intelligence Platform</span>
            <span>&bull;</span>
            <span>Academic & SOC Production Release</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="hover:text-slate-200 transition-colors">Operations</Link>
            <Link href="/reports" className="hover:text-slate-200 transition-colors">Reports</Link>
            <Link href="/settings" className="hover:text-slate-200 transition-colors">API Docs</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
