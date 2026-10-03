# Security Model & Threat Boundaries — PhishGuard AI

## 1. Threat Model & Design Principles

PhishGuard AI is constructed under strict defensive principles:
- **Defense in Depth**: Multiple independent layers of inspection (deterministic rules, lexical entropy analysis, statistical ML, and NLP intent detection).
- **Least Privilege**: Stateless JWT credentials with strict role validation (USER vs ADMIN).
- **Zero Raw Code Execution**: Content submitted by users is parsed lexically and textually without executing untrusted scripts, active HTTP fetches that could trigger SSRF, or sandboxed execution of malicious binaries.

---

## 2. Server-Side Request Forgery (SSRF) Protection

When processing URLs:
- The system parses URLs locally using Python's standard `urllib.parse` and custom regex/entropy extractors.
- It does **not** make uncontrolled raw external HTTP requests to user-provided IPs or internal intranet addresses (`127.0.0.1`, `10.0.0.0/8`, `192.168.0.0/16`, `169.254.169.254`).
- All feature extraction happens statically on the URL string itself.

---

## 3. Data Privacy & GDPR/CCPA Compliance

- **User Data Deletion**: Users maintain full sovereignty to delete past scan records from the database.
- **Credential Masking**: High-entropy strings, passwords, or personal credentials accidentally pasted in message bodies can be masked or purged.
- **No Third-Party Telemetry Leaks**: No user scan queries are transmitted to third-party commercial search engines or advertising networks.

---

## 4. API Hardening

- **Rate Limiting**: Configured at both global (60 requests/minute) and scan-specific (20 scans/minute) thresholds.
- **Input Validation**: Enforced through Pydantic v2 schemas restricting maximum payload lengths (URLs max 2048 chars, messages max 10000 chars).
- **CORS Policy**: Configured strictly to trusted frontend origins.
- **Security Headers**: Standard headers configured (X-Content-Type-Options: nosniff, X-Frame-Options: DENY, Content-Security-Policy).
