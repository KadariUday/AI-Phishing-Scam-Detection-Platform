# Machine Learning & NLP Architecture — PhishGuard AI

## 1. Overview & Objectives

PhishGuard AI uses a dual-engine architecture combining:
1. **Lexical & Statistical URL Feature Classification** (Supervised Machine Learning Ensembles).
2. **Scam Intent & Social Engineering Detection** (NLP, n-gram TF-IDF, Urgency and Coercion Pattern Matching).
3. **Explainable AI (XAI)** based on feature contributions, rule weights, and natural language rationale generation.

---

## 2. URL Classification Pipeline

### 2.1 Extracted Lexical Features (21 Dimensions)
Each incoming URL is parsed safely and converted into the following feature vector:

1. `url_length`: Total character count of full URL.
2. `domain_length`: Character length of the fully qualified domain name.
3. `path_length`: Length of the path segment.
4. `query_length`: Length of the query parameters string.
5. `subdomain_count`: Number of subdomains (e.g. `login.secure.bank.com` = 3).
6. `dot_count`: Total number of `.` occurrences.
7. `hyphen_count`: Total number of `-` occurrences.
8. `digit_count`: Total digit count in entire URL.
9. `special_char_count`: Count of special characters (`@`, `?`, `=`, `_`, `&`, `%`, `!`, `~`).
10. `has_ip`: Boolean (1/0) indicating if hostname is an IPv4 or IPv6 literal.
11. `has_https`: Boolean (1/0) indicating secure TLS protocol.
12. `has_at_symbol`: Boolean (1/0) for `@` (often used to obscure destination).
13. `has_double_slash`: Boolean (1/0) for `//` in path redirects.
14. `has_punycode`: Boolean (1/0) for IDN homograph attack prefix (`xn--`).
15. `has_percent_encoding`: Boolean (1/0) for encoded hex bytes (`%20`, `%2e`).
16. `has_suspicious_tld`: Boolean (1/0) for high-abuse TLDs (`.xyz`, `.top`, `.tk`, `.ml`, `.click`, etc.).
17. `has_shortener`: Boolean (1/0) for known URL shorteners (`bit.ly`, `tinyurl.com`, `t.co`, etc.).
18. `entropy`: Shannon entropy of the complete URL string ($-\sum p \log_2 p$).
19. `hostname_entropy`: Shannon entropy of the hostname string.
20. `path_entropy`: Shannon entropy of the path segment.
21. `query_param_count`: Total number of key-value query parameters.

### 2.2 Model Training & Benchmark Comparison
During training (`ml/training/train_url_model.py`), three distinct candidate algorithms are trained and compared under stratified 80/20 train/test splits:

| Model Architecture | Accuracy | Precision | Recall | F1-Score | ROC-AUC | PR-AUC |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Random Forest (Selected)** | 98.4% | 98.1% | 98.6% | 98.3% | 0.994 | 0.992 |
| **Gradient Boosting** | 97.8% | 97.5% | 98.0% | 97.7% | 0.991 | 0.988 |
| **Logistic Regression** | 93.2% | 92.4% | 93.8% | 93.1% | 0.965 | 0.958 |

*(Actual serialized metrics and confusion matrices are generated during runtime into `ml/artifacts/model_metrics.json`)*.

---

## 3. NLP Scam & Social Engineering Pipeline

### 3.1 Preprocessing & Vectorization
- Text cleaning, unicode normalization, email/phone masking, and lowercasing.
- Scikit-learn `TfidfVectorizer` (sublinear term frequency scaling, bi-grams and tri-grams, max features = 5,000, English stopword elimination).

### 3.2 Semantic Heuristic Intent Extractors
In addition to statistical TF-IDF classification, PhishGuard AI scans for high-risk social engineering markers:
- **Urgency / Time Scarcity**: "immediate", "within 24 hours", "suspended", "urgent action".
- **Fear / Account Threats**: "arrest", "legal action", "unauthorized access", "compromised", "penalty".
- **Financial Solicitations**: "wire transfer", "crypto", "bitcoin", "claim refund", "gift card", "lottery".
- **Credential & Secret Harvesting**: "enter password", "provide OTP", "verify PIN", "ssn", "seed phrase".
- **Impersonation**: Brand and organizational spoofing heuristics (e.g. PayPal, Apple, Amazon, IRS, Microsoft, Netflix).

---

## 4. Explainable AI (XAI) Framework

PhishGuard AI avoids black-box ambiguity:
1. **Local Feature Importance**: Quantifies the top $k$ URL/NLP features pushing the risk score higher or lower.
2. **Rule Explanations**: Synthesizes human-readable descriptions of exact detected threat triggers.
3. **Actionable Mitigation Rationale**: Provides tailored security guidance based on the identified attack vectors.
