import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PhishGuard AI — AI-Powered Phishing, Scam & Malicious Content Detection",
  description:
    "Enterprise-grade cybersecurity intelligence platform utilizing Machine Learning, NLP, and Explainable AI for real-time phishing and scam threat detection.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-canvas-950 text-slate-100 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
