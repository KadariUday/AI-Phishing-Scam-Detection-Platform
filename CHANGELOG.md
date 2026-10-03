# Changelog

All notable changes to the **PhishGuard AI** project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-10-03

### Added
- **Production Monorepo**: Structured modular layout with `apps/web`, `apps/api`, `ml/`, `docs/`, `docker/`, and `.github/`.
- **Machine Learning Classifiers**:
  - URL Phishing Detection with Random Forest, Gradient Boosting, and Logistic Regression with full metric evaluations.
  - NLP Scam & Social Engineering Classifier utilizing TF-IDF n-grams + Logistic Regression with feature importance.
- **Explainable AI (XAI)**:
  - Factor-based explainability engine mapping feature importances, syntactic heuristics, and NLP intent indicators to human-readable security advisories.
- **Hybrid Cybersecurity Risk Engine**:
  - Multi-tier weighted risk calculation (URL ML, NLP ML, heuristic rule engine, domain integrity, and impersonation detection).
- **FastAPI Backend (REST API v1)**:
  - Asynchronous endpoints for URL, Message, and Email analysis.
  - JWT Authentication (Register, Login, User Profile, Session management).
  - Scan history persistence, metrics aggregation, analytics API, and PDF report generation.
  - Rate limiting, CORS middleware, and structured logging.
- **Modern Next.js Frontend Dashboard**:
  - Dark-first technical cybersecurity UI built with Tailwind CSS, Lucide icons, Framer Motion, and Recharts.
  - Real-time URL Scanner, Message Analyzer, and Email Analyzer with instant visual breakdown.
  - Executive Security Analytics Dashboard, Scan History table with filters, and downloadable PDF reports.
  - Interactive Demo data switcher and comprehensive accessibility compliance.
- **Academic & Technical Documentation**:
  - Full academic suite under `docs/academic/` (Problem statement, literature review, methodology, architecture, evaluation results, limitations, future scope).
  - Architecture specifications, OpenAPI docs, and Docker orchestration files.
