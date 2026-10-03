# Project Objectives

The core objectives of the **PhishGuard AI** research and engineering project are:

1. **Design a Comprehensive Multi-Dimensional URL Feature Extractor**:
   - Extract 21 structural, syntactic, information-theoretic (Shannon entropy), and lexical features statically from incoming URLs without executing external network queries or causing SSRF vulnerabilities.

2. **Train and Benchmark High-Performance Machine Learning Classifiers**:
   - Evaluate Random Forest, Gradient Boosting, and Logistic Regression on balanced, verified datasets.
   - Achieve an accuracy exceeding 97% and F1-Score exceeding 97% on zero-day URL phishing detection.

3. **Develop a Multi-Signal NLP Intent Classifier**:
   - Implement text normalization and TF-IDF n-gram vectorization.
   - Detect psychological coercion vectors including urgency, fear of penalty, OTP/credential harvesting, financial scam terminology, and brand impersonation.

4. **Implement an Explainable AI (XAI) Architecture**:
   - Provide human-readable, transparent threat breakdowns detailing the key contributing factors and indicators for every scan decision.

5. **Build a Calibrated Multi-Tier Hybrid Risk Engine**:
   - Fuse ML probabilities, heuristic rule violations, and NLP intent scores into a normalized $0-100$ Risk Score with calibrated risk tiers (`SAFE`, `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`).

6. **Deliver a Production-Ready Full-Stack Cybersecurity Application**:
   - Implement a modern, dark-first Next.js frontend with real-time risk gauges, interactive dashboards, and forensic PDF report generation.
   - Build a robust FastAPI backend with asynchronous request handling, JWT authentication, PostgreSQL data persistence, rate limiting, and Docker containerization.
