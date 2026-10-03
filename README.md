# PhishGuard AI: AI-Powered Phishing, Scam & Malicious Content Detection Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python Version](https://img.shields.io/badge/Python-3.11%20%7C%203.12%20%7C%203.13-blue)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014-black.svg)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/UI-Tailwind%20CSS-38B2AC.svg)](https://tailwindcss.com/)
[![Scikit-Learn](https://img.shields.io/badge/ML-scikit--learn-F7931E.svg)](https://scikit-learn.org/)

> **PhishGuard AI** is a production-grade, AI-driven cybersecurity intelligence platform engineered to detect, analyze, explain, and mitigate phishing URLs, fraudulent SMS/messages, social engineering attacks, and malicious emails in real time.

---

## 🛡️ Key Capabilities

- 🔍 **Multi-Vector Threat Scanning**:
  - **URL Scanner**: Deep lexical, entropy, syntactic, and ML analysis of suspicious links, punycode spoofing, and IP hostnames.
  - **Message Analyzer**: NLP-driven intent analysis for SMS, WhatsApp, and social media scams (urgency, OTP harvesting, financial coercion).
  - **Email Analyzer**: Holistic header, sender integrity, subject urgency, and body threat indicator dissection.
- 🧠 **Real Machine Learning & NLP Pipelines**:
  - Supervised Ensembles (Random Forest, Gradient Boosting, Logistic Regression) trained on lexical URL features with full metric validation.
  - TF-IDF n-gram NLP classifier capturing scam vocabularies and psychological triggers.
- 💡 **Explainable AI (XAI)**:
  - Transparent feature attribution breakdown explaining *why* a threat received its risk score without vague black-box assertions.
- ⚖️ **Multi-Tier Hybrid Risk Engine**:
  - Deterministic heuristics + statistical ML inference + domain reputation weighing into normalized risk ratings: `SAFE`, `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`.
- 📊 **Executive Analytics & PDF Reporting**:
  - Interactive dashboards, trend analyses, threat categorization, audit logging, and downloadable forensic PDF reports.
- 🍃 **MongoDB Persistence & Activity History ("At What Time They Did What")**:
  - `users` collection: Stores `username`, `email`, and `password` as strings with roles and registration timestamps.
  - `activity_history` collection: Real-time chronological audit trail capturing exact timestamps (`readable_time`, ISO format), operator username/email, action type (`USER_SIGNUP`, `USER_LOGIN`, `SCAN_URL`, `SCAN_MESSAGE`, `SCAN_EMAIL`), target payloads, and risk scores.
- ⚡ **Lightweight & Self-Contained**:
  - Runs efficiently on standard consumer hardware with zero-config local persistence and optional MongoDB Atlas / local MongoDB daemon.

---

## 🏗️ Architecture Overview

```text
phishguard-ai/
├── apps/
│   ├── web/               # Next.js 14, React, Tailwind CSS, TypeScript, Recharts
│   └── api/               # FastAPI async backend, Pydantic v2, SQLAlchemy, JWT
├── ml/
│   ├── datasets/          # Curated training & benchmark datasets
│   ├── features/          # URL & Text feature extractors
│   ├── training/          # Model training, hyperparameter tuning & evaluation
│   └── artifacts/         # Serialized models, scalers, and metric manifests
├── docs/
│   ├── architecture/      # Detailed architectural diagrams and specifications
│   ├── api/               # OpenAPI endpoint documentation
│   ├── ml/                # Dataset provenance, model metrics & XAI rationale
│   ├── security/          # Defensive boundary definitions and threat modeling
│   └── academic/          # Full 11-part major project thesis documentation
├── docker/                # Dockerfiles for frontend, backend, and postgres
└── scripts/               # Quickstart and automated verification scripts
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.0+ or v20+ / v22+
- **Python**: v3.11+ / v3.12+ / v3.13+
- **Git**

### 1. Clone & Configure
```bash
git clone https://github.com/phishguard-ai/phishguard-ai.git
cd "AI Phishing & Scam Detection Platform"
cp .env.example .env
```

### 2. Machine Learning Training & Model Serialization
Generate and verify the trained models and artifacts:
```bash
python ml/training/train_all.py
```
This generates:
- `ml/artifacts/url_phishing_model.joblib`
- `ml/artifacts/url_scaler.joblib`
- `ml/artifacts/nlp_scam_model.joblib`
- `ml/artifacts/nlp_vectorizer.joblib`
- `ml/artifacts/model_metrics.json`

### 3. Backend Setup & Run (FastAPI)
```bash
cd apps/api
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
Interactive API documentation available at: `http://localhost:8000/docs`

### 4. Frontend Setup & Run (Next.js)
```bash
cd apps/web
npm install
npm run dev
```
Access the application dashboard at: `http://localhost:3000`

---

## 🐳 Docker Deployment
To launch the entire stack using Docker Compose:
```bash
docker compose up --build
```
- Web Application: `http://localhost:3000`
- FastAPI REST API: `http://localhost:8000`
- Database: PostgreSQL on port `5432`

---

## 🧪 Testing
```bash
# Run backend test suite (unit, feature extraction, ML inference, API endpoints)
pytest apps/api/tests/ -v

# Run frontend linting and type checks
cd apps/web && npm test
```

---

## 📄 License & Defensive Policy
Distributed under the **MIT License**. PhishGuard AI is an exclusively defensive tool intended for threat detection, research, and educational analysis.
