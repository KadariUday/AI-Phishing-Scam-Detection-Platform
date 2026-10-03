# Future Scope

The architecture of **PhishGuard AI** is purposefully designed with an extensible `DetectorInterface` to support future capabilities:

1. **Browser Extension for Real-Time Zero-Hour Protection**:
   - Manifest V3 Chrome/Firefox/Edge extension performing on-the-fly URL classification before page load, displaying interactive threat warning banners.
2. **Multilingual NLP Intent Analysis**:
   - Integration of lightweight multilingual transformer models (e.g., MiniLM, distilled multilingual BERT) for cross-lingual scam detection across Spanish, Hindi, French, German, and Mandarin.
3. **Computer Vision & Visual Brand Impersonation (QR & Screenshot OCR)**:
   - Lightweight MobileNet/YOLO modules for detecting spoofed brand logos (PayPal, Microsoft, Google) on destination landing pages and decoding suspicious Quishing (QR code phishing) vectors.
4. **Decentralized Threat Intelligence Feed Sharing**:
   - Privacy-preserving cryptographic hashing of confirmed threat indicators for federated threat telemetry exchange among enterprise instances.
5. **Automated SOAR (Security Orchestration, Automation, and Response) Webhooks**:
   - Webhook integrations with SIEM platforms (Splunk, Elastic SIEM, Microsoft Sentinel) for automated quarantine actions.
