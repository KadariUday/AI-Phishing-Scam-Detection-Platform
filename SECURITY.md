# Security Policy — PhishGuard AI

## Defensive Purpose and Boundaries

PhishGuard AI is an educational and enterprise-grade defensive cybersecurity platform designed solely to detect, analyze, and explain phishing URLs, social engineering scams, and deceptive content.

### Strictly Out of Scope
The following activities and mechanisms are strictly prohibited and intentionally omitted from this codebase:
- Credential harvesting or phishing page hosting.
- Generation of deceptive lures, payloads, or exploit vectors.
- Automated invasive active port scanning or web vulnerability exploitation.
- Persistence mechanisms or bypassing security controls.

All sample threat vectors used in automated test suites and demonstration modes are synthetic or sanitized indicators.

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability within PhishGuard AI, please report it responsibly:

1. **Email**: Send details to `security@phishguard.ai` or create a private GitHub Security Advisory.
2. **Details to Include**:
   - Description of the vulnerability and attack vector.
   - Steps to reproduce or proof-of-concept script.
   - Impact assessment and suggested mitigations.
3. **Response Timeline**:
   - Initial acknowledgement: Within 24-48 hours.
   - Patch triage and advisory: Within 7 business days.

Please do not publicly disclose vulnerabilities until a fix has been released.
