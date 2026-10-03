# Methodology

## 1. Research & Engineering Methodology

The methodology of **PhishGuard AI** is structured into four interlocked pipelines:

```
[ Raw Threat Input (URL, SMS, Email) ]
                  |
        +---------+---------+
        |                   |
        v                   v
[ Static Lexical Engine ]  [ NLP Intent Engine ]
- 21 Structural Features   - Tokenization & TF-IDF
- Shannon Entropy          - Urgency & Fear Signals
- Punycode & Hex Encoding  - Financial & OTP Signals
        |                   |
        +---------+---------+
                  |
                  v
[ Machine Learning Inference & Ensemble ]
- Random Forest Classifier (URL probability)
- TF-IDF Classifier (Text probability)
                  |
                  v
[ Hybrid Multi-Tier Risk Engine ]
- Weighted Risk Combination: R = w_ml*S_ml + w_nlp*S_nlp + w_rules*S_rules
- Calibrated 0-100 Risk Scoring & Tier Assignment
                  |
                  v
[ Explainable AI (XAI) & Action Generation ]
- Feature Attribution Ranking
- Exact Threat Indicator Matching
- Defensive Remediation Advice
```

---

## 2. Dataset Synthesis & Curation

To ensure high model fidelity without relying on copyrighted proprietary feeds, training datasets are compiled using:
1. **Benign Ground Truth**:
   - Curated top Alexa/Tranco 1M legitimate domains across banking, e-commerce, technology, and government sectors.
   - Standard conversational text corpora without malicious coercion.
2. **Phishing & Scam Ground Truth**:
   - Verified open-source phishing patterns (PhishTank archive patterns, OpenPhish samples, smishing/scam SMS corpora).
   - Adversarial variations incorporating homograph attacks, multiple subdomains, obfuscated IP hostnames, and shortened links.

---

## 3. Supervised Learning & Cross-Validation Strategy
- Stratified 80/20 Train-Test split maintaining class balance.
- 5-Fold Cross-Validation for hyperparameter selection.
- Evaluation on six standard statistical metrics: Accuracy, Precision, Recall, F1-Score, ROC-AUC, and PR-AUC.
