# System Architecture Specification — PhishGuard AI

## 1. Executive Summary

PhishGuard AI is an extensible, modular cybersecurity intelligence platform engineered to protect end-users and organizations from malicious URLs, phishing emails, SMS scams (smishing), and social engineering threats. It combines deterministic heuristic engines with statistical machine learning and natural language processing to deliver transparent, explainable risk assessments.

---

## 2. High-Level Architectural Diagram

```
+-----------------------------------------------------------------------------+
|                                Presentation Tier                            |
|  Next.js 14+ / React (TypeScript) - Dark-First Cyber UI                     |
|  - Threat Scanner UI (URL, SMS/Message, Email)                              |
|  - Real-Time Risk Gauges & Explainable AI Factor Visualizations             |
|  - Executive Analytics & Trends Dashboard (Recharts)                        |
|  - Historical Scan Audit Ledger & Exportable PDF Reports                    |
+-----------------------------------------------------------------------------+
                                       |
                           HTTPS / REST API / JSON
                                       v
+-----------------------------------------------------------------------------+
|                               API Gateway Tier                              |
|  FastAPI (Python 3.11+) Asynchronous Application Server                     |
|  - JWT Authentication Middleware & RBAC (User / Admin)                      |
|  - Token-Bucket In-Memory / Distributed Rate Limiter                         |
|  - Pydantic v2 Request Validation & Strict Sanitization                     |
|  - Structured JSON Logging & Health Observability                           |
+-----------------------------------------------------------------------------+
                                       |
            +--------------------------+--------------------------+
            |                                                     |
            v                                                     v
+-----------------------+                             +-----------------------+
|   Database Layer      |                             |   Core Engine Tier    |
| PostgreSQL / SQLite   |                             | - Risk Engine         |
| - Users & Auth        |                             | - URL Feature Engine  |
| - Scan History Ledger |                             | - NLP Scam Engine     |
| - Threat Indicators   |                             | - Heuristic Rules     |
| - Audit Trail         |                             | - Explainability (XAI)|
+-----------------------+                             +-----------------------+
                                                                  |
                                                                  v
                                                      +-----------------------+
                                                      |   ML Inference Tier   |
                                                      | - Random Forest       |
                                                      | - Gradient Boosting   |
                                                      | - TF-IDF Scikit-Learn |
                                                      | - Feature Scalers     |
                                                      +-----------------------+
```

---

## 3. Core Subsystems

### 3.1 Detector Interface & Extensibility
The core detection logic implements an open-closed architectural pattern via `DetectorInterface`. Any new threat analyzer (such as QR codes, attachments, or image OCR) can be plugged into the detection pipeline without modifying existing components:

```python
class DetectorInterface(ABC):
    @abstractmethod
    async def analyze(self, payload: ScanRequest) -> DetectorResult:
        """Execute heuristic and ML analysis on input."""
        pass
```

### 3.2 URL Feature Extraction Pipeline
The lexical extractor decomposes raw URLs into 21 quantifiable dimensions:
- Structural lengths (total URL, hostname, path, query)
- Entropy metrics (Shannon entropy across hostname and URL body)
- Lexical counts (dots, hyphens, digits, percent encodings, subdomains)
- Categorical security indicators (raw IPv4/IPv6 hostnames, punycode/IDN spoofing, suspicious TLDs, known URL shorteners, multiple schemes).

### 3.3 Natural Language Processing (NLP) Engine
The textual analyzer performs:
- Normalization (case folding, URL token extraction, whitespace cleaning)
- Multi-signal lexicon matching (Urgency triggers, Fear/Threat cues, Financial solicitations, Credential requests, OTP theft)
- Statistical TF-IDF n-gram classification for scam intent detection.

### 3.4 Hybrid Risk Engine & Weighting Formulation
The final Risk Score $R \in [0, 100]$ is computed through a calibrated weighted ensemble:
$$R = w_{\text{ML}} \cdot S_{\text{ML}} + w_{\text{rules}} \cdot S_{\text{rules}} + w_{\text{intent}} \cdot S_{\text{intent}} + w_{\text{reputation}} \cdot S_{\text{reputation}}$$

Risk Classifications:
- **0–19**: `SAFE` (Minimal to no risk detected)
- **20–39**: `LOW` (Minor non-standard characteristics)
- **40–69**: `MEDIUM` (Multiple suspicious signals present)
- **70–89**: `HIGH` (Strong phishing/scam patterns detected)
- **90–100**: `CRITICAL` (Definite known attack vectors identified)

---

## 4. Security & Data Integrity

- **Password Storage**: Passwords hashed using standard cryptographic algorithms (`Argon2id` / `bcrypt` with unique per-user salts).
- **Stateless Tokens**: Signed HMAC-SHA256 JWT tokens with configured expiration times.
- **Privacy First**: Sensitive raw message bodies are sanitized or optionally stored in truncated form based on user settings, supporting complete scan history deletion on demand.
- **Fail-Safe Inference**: Pre-loaded ML models reside in memory upon application startup, providing single-millisecond latency per scan without dynamic external network dependencies.
