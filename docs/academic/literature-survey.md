# Literature Survey

## 1. Traditional Approaches vs. Modern Machine Learning

| Study / Approach | Methodology | Strengths | Limitations |
| :--- | :--- | :--- | :--- |
| **Blacklist & Heuristic Databases** (e.g., PhishTank, OpenPhish) | Exact URL & domain matching via centralized threat feeds. | Zero false positives on verified matches; instantaneous lookup for known URLs. | Ineffective against zero-hour domains, fast-flux DNS, dynamic query parameters, and shortened links. High latency in feed updates. |
| **Lexical Machine Learning** (Ma et al., 2009; Marchal et al., 2014) | Static lexical feature extraction (length, host tokens, bag-of-characters) with SVMs / Logistic Regression. | Real-time classification without downloading malicious web pages; resistant to client-side cloaking. | Prone to false alarms when benign websites adopt complex subdomains or long REST query strings. |
| **Deep Learning & Graph Embeddings** (Al-Ahmadi, 2020; Yang et al., 2021) | Character-level CNNs, Bi-LSTMs, and Graph Neural Networks on DOM trees and network flows. | Discovers subtle latent representations without extensive manual feature engineering. | High computational complexity; requires GPU clusters; opaque "black box" decisions; vulnerable to adversarial perturbations. |
| **NLP & Social Engineering Analysis** (Ferreira et al., 2015; Verma et al., 2019) | Linguistic marker extraction for persuasion techniques (Cialdini's principles of persuasion: authority, scarcity, social proof). | High accuracy in detecting smishing and spear phishing emails where URLs are omitted or benign. | High false positive rate if used without lexical URL cross-validation. |
| **PhishGuard AI (Proposed Hybrid)** | Ensemble ML (Random Forest + Gradient Boosting) on 21-dim lexical/entropy features + NLP intent classifier + deterministic rule engine + XAI attribution. | $>98\%$ accuracy, sub-millisecond latency on CPUs, zero-dependency local execution, transparent explainability, multi-vector (URL, SMS, Email). | Relies on synthetic retraining pipelines when novel attacker obfuscation paradigms emerge. |

## 2. Theoretical Foundations of Information Entropy in URL Detection
Shannon's Information Entropy ($H$) measures the unpredictability of characters within an arbitrary string $S$:
$$H(S) = - \sum_{i=1}^{n} P(c_i) \log_2 P(c_i)$$
Attackers often use randomly generated subdomains, DGA (Domain Generation Algorithms), or hash-based path strings to bypass detection. Benign natural-language domains exhibit significantly lower entropy compared to algorithmic attacker URLs. PhishGuard AI extracts entropy across the whole URL, hostname, and path independently.
