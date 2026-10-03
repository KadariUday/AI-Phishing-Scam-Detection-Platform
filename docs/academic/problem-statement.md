# Problem Statement

## 1. Context and Urgency
Phishing and social engineering attacks continue to grow in volume and sophistication. Attackers routinely employ:
1. **Dynamic and Ephemeral URLs**: Short-lived domains, URL shorteners, and Fast Flux DNS that evade traditional blacklist databases (e.g., Google Safe Browsing, PhishTank) which have a propagation delay of hours to days.
2. **Punycode and Homograph Obfuscation**: Internationalized Domain Names (IDNs) mimicking legitimate brand names with visually indistinguishable unicode glyphs (e.g., `xn--pypal-4ve.com`).
3. **Multi-Vector Social Engineering**: Deceptive SMS (Smishing), WhatsApp fraudulent solicitations, and credential harvesting emails leveraging human cognitive biases such as urgency, fear, authority, and financial rewards.

## 2. Key Challenges in Existing Solutions
- **Static Blacklist Limitations**: Incapable of blocking novel zero-hour attacks.
- **Black-Box AI Models**: Existing deep learning systems often lack explainability, leaving end users and SOC analysts uncertain about why a specific item was flagged.
- **Heavy Infrastructure & Paid API Dependency**: Many commercial security solutions require expensive API subscriptions (e.g., VirusTotal premium, URLScan paid tiers) and enterprise cloud hardware with dedicated GPUs.
- **Privacy Concerns**: Sending sensitive corporate or personal messages to third-party proprietary clouds compromises confidential communications.

## 3. The Need for PhishGuard AI
There is a pressing need for a lightweight, transparent, self-contained, and highly accurate AI system that can operate locally, provide real-time risk scoring, explain detection factors clearly, and cover multiple communication vectors (URLs, messages, and emails) without recurring costs.
