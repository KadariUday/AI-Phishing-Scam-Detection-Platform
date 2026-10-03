# Implementation Details

## 1. Technology Stack Implementation

- **Frontend**: Next.js 14 App Router, React 18, TypeScript, Tailwind CSS, Lucide React icons, Recharts for interactive analytics, and Framer Motion for subtle micro-interactions.
- **Backend API**: Python 3.11/3.12/3.13, FastAPI asynchronous application framework, Pydantic v2 data validation schemas, SQLAlchemy 2.0 ORM with asyncpg/aiosqlite drivers.
- **Machine Learning**: scikit-learn, numpy, pandas, joblib for model serialization.
- **Security & Cryptography**: Passlib (Argon2 / bcrypt), PyJWT, python-multipart.

## 2. URL Feature Extraction Code Implementation
The core feature extraction algorithm computes 21 quantitative signals from an arbitrary URL. Key algorithmic segments include:
- Safe URL schema and domain normalization without DNS lookups.
- IPv4/IPv6 regex parsing preventing obfuscated decimal/octal IP evasion.
- Shannon entropy computation across distinct URL partitions:
  $$H = -\sum_{i=1}^{k} \left(\frac{f_i}{N}\right) \log_2\left(\frac{f_i}{N}\right)$$
- Punycode detection (`xn--`) for Internationalized Domain Name spoofing.

## 3. NLP Intent Analysis Implementation
- Stopword filtering and punctuation tokenization.
- Psychological trigger dictionary mapping across urgency, fear, authority, and financial coercion categories.
- TF-IDF bi-gram and tri-gram vectorization feeding a calibrated Logistic Regression classifier.
