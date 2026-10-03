# API Reference Specification — PhishGuard AI

Base URL: `http://localhost:8000/api/v1`

All responses are formatted in application/JSON. Authenticated endpoints require `Authorization: Bearer <jwt_token>` header.

---

## 1. Authentication Endpoints

### `POST /auth/register`
Creates a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "full_name": "Security Analyst"
}
```

**Response (201 Created):**
```json
{
  "id": "e4b2d1c0-...",
  "email": "user@example.com",
  "full_name": "Security Analyst",
  "role": "USER",
  "created_at": "2026-10-03T12:00:00Z"
}
```

### `POST /auth/login`
Authenticates user and issues JSON Web Token.

**Request Body:**
```json
{
  "username": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOi...",
  "token_type": "bearer",
  "expires_in": 3600,
  "user": {
    "id": "e4b2d1c0-...",
    "email": "user@example.com",
    "full_name": "Security Analyst",
    "role": "USER"
  }
}
```

### `GET /auth/me`
Retrieves currently authenticated user profile.

---

## 2. Threat Analysis Endpoints

### `POST /scans/url`
Performs comprehensive feature extraction, ML inference, and risk scoring on a URL.

**Request Body:**
```json
{
  "url": "http://192.168.1.1/secure-login/bank/verify.php?token=xyz"
}
```

**Response (200 OK):**
```json
{
  "scan_id": "8f3b6c4a-...",
  "scan_type": "URL",
  "target": "http://192.168.1.1/secure-login/bank/verify.php?token=xyz",
  "risk_score": 88,
  "risk_level": "HIGH",
  "confidence": 0.94,
  "classification": "PHISHING",
  "ml_score": 0.89,
  "features": {
    "url_length": 56,
    "has_ip": true,
    "has_https": false,
    "entropy": 4.18,
    "subdomain_count": 0,
    "dot_count": 4
  },
  "threat_indicators": [
    {
      "code": "IP_HOSTNAME",
      "severity": "CRITICAL",
      "title": "IP Address Used in Hostname",
      "description": "Legitimate organizations rarely use bare IP addresses for customer portals."
    },
    {
      "code": "NO_HTTPS",
      "severity": "HIGH",
      "title": "Insecure Protocol (HTTP)",
      "description": "Communications are unencrypted and vulnerable to eavesdropping."
    }
  ],
  "explanations": [
    "Model detected high similarity to credential harvesting landing pages.",
    "Bare IP address bypasses regular domain reputation controls."
  ],
  "recommendations": [
    "Do not enter credentials or sensitive personal information.",
    "Block this URL in DNS/firewall gateways.",
    "Report domain to anti-abuse hosting authorities."
  ],
  "created_at": "2026-10-03T12:05:00Z"
}
```

### `POST /scans/message`
Analyzes SMS, WhatsApp, or social media text content.

**Request Body:**
```json
{
  "text": "URGENT: Your bank account will be suspended in 2 hours! Click http://bit.ly/bank-auth to update your KYC now or face penalties."
}
```

### `POST /scans/email`
Analyzes structured email data (sender, subject, body).

**Request Body:**
```json
{
  "sender": "security-alert@paypal-update-center.xyz",
  "subject": "Immediate Action Required: Unusual Sign-in Detected",
  "body": "Dear customer, we noticed suspicious activity. Please verify your identity immediately..."
}
```

---

## 3. History, Analytics & Reports

- `GET /scans`: Paginated scan history with filtering by type, risk level, and search keywords.
- `GET /scans/{id}`: Detailed inspection of a specific scan assessment.
- `DELETE /scans/{id}`: Secure deletion of a scan entry from user audit history.
- `GET /dashboard`: Aggregated metrics for total scans, risk level distributions, and recent detections.
- `GET /analytics`: Detailed threat indicators, daily volume trends, and scanner breakdown.
- `POST /reports/{scan_id}`: Generates a forensic downloadable PDF report for a scan.

---

## 4. Observability

- `GET /health`: Health status of the API service.
- `GET /health/db`: Database connectivity verification.
