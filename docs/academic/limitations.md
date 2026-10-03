# System Limitations

While **PhishGuard AI** provides high detection accuracy and explainable insights, the following technical limitations are acknowledged:

1. **Static Feature Bounds**:
   - The primary URL model operates purely statically on the URL string itself. Compromised legitimate websites (e.g., a hacked sub-page on a high-reputation domain like `wordpress.com`) that maintain clean URL syntax may score lower on lexical indicators until flagged by NLP or domain heuristics.
2. **Encrypted or Paywalled Destination Pages**:
   - Because PhishGuard AI does not perform intrusive dynamic headless browser rendering of destination web pages (to maintain privacy, avoid SSRF attacks, and eliminate heavy computing overhead), it relies on static URL syntax and submitted text contents.
3. **Language Limitations in NLP**:
   - The NLP classifier is currently optimized for English language scam patterns. Multi-lingual smishing attacks in regional languages require expanded tokenization and training corpora.
4. **Adversarial Perturbation**:
   - Highly sophisticated attackers designing URLs with mimicry of benign entropy profiles may require regular model retraining with updated synthetic adversarial samples.
