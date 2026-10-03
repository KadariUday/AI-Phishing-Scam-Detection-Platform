from typing import List, Dict, Any, Tuple
from apps.api.app.schemas.scan import ThreatIndicator

class XAIService:
    """Explainable AI & Defensive Countermeasure Service."""

    def generate_url_explanations(
        self,
        features: Dict[str, Any],
        indicators: List[ThreatIndicator],
        risk_level: str
    ) -> Tuple[List[str], List[str]]:
        explanations: List[str] = []
        recommendations: List[str] = []

        if risk_level in ["SAFE", "LOW"] and not indicators:
            explanations.append("The URL adheres to standard domain naming conventions and demonstrates benign lexical entropy.")
            explanations.append("Secure HTTPS protocol is employed without deceptive subdomains or raw IP references.")
            recommendations.append("The target appears standard, but always verify TLS certificate authenticity when logging in.")
            recommendations.append("Ensure your browser and operating system security updates are active.")
            return explanations, recommendations

        # Specific indicator explanations
        for ind in indicators:
            if ind.code == "IP_HOSTNAME":
                explanations.append("The hostname consists of a direct IP address rather than a registered domain name, commonly used to bypass reputation filtering.")
            elif ind.code == "PUNYCODE_HOMOGRAPH":
                explanations.append("Internationalized domain spoofing ('xn--') detected. Visual characters mimic a recognized brand to deceive users.")
            elif ind.code == "SUSPICIOUS_TLD":
                explanations.append("The top-level domain has an abnormally high statistical correlation with malicious phishing campaigns.")
            elif ind.code == "URL_SHORTENER":
                explanations.append("A URL shortener is masking the true destination endpoint.")
            elif ind.code == "HIGH_ENTROPY":
                explanations.append(f"Shannon entropy of {features.get('entropy', 0):.2f} indicates pseudo-random character sequences characteristic of algorithmic generation.")
            elif ind.code == "NO_HTTPS":
                explanations.append("Communication channel is unencrypted (HTTP). Any entered credentials or session data can be intercepted.")
            elif ind.code == "EXCESSIVE_SUBDOMAINS":
                explanations.append("An unusually deep subdomain hierarchy is used to mask the actual root domain.")

        # Recommendations based on risk severity
        if risk_level in ["CRITICAL", "HIGH"]:
            recommendations.append("DO NOT click the link, visit the webpage, or enter any usernames, passwords, or personal details.")
            recommendations.append("Block this domain/URL in perimeter firewall and enterprise DNS filter lists.")
            recommendations.append("If credentials were submitted on this link, immediately change passwords and revoke active sessions.")
            recommendations.append("Report the fraudulent URL to your internal security team and anti-phishing hosting authorities.")
        elif risk_level == "MEDIUM":
            recommendations.append("Exercise caution. Inspect the destination domain carefully before entering sensitive information.")
            recommendations.append("Confirm the origin with the supposed sender via an alternate verified communication channel.")
        else:
            recommendations.append("No immediate threats identified, but remain vigilant against unverified requests.")

        return explanations, recommendations

    def generate_text_explanations(
        self,
        signals: Dict[str, Any],
        indicators: List[ThreatIndicator],
        risk_level: str
    ) -> Tuple[List[str], List[str]]:
        explanations: List[str] = []
        recommendations: List[str] = []

        if risk_level == "SAFE" and not indicators:
            explanations.append("No prominent social engineering patterns, coercive language, or credential harvesting signals were identified.")
            recommendations.append("Message appears routine. Continue following general cyber hygiene practices.")
            return explanations, recommendations

        if signals.get("urgency_detected"):
            explanations.append("Message leverages artificial urgency to trigger hasty decision-making before the recipient can verify authenticity.")
        if signals.get("fear_threat_detected"):
            explanations.append("Threats of legal consequences, police action, or immediate account suspension are classic intimidation tactics.")
        if signals.get("credential_harvesting_detected"):
            explanations.append("Message directly solicits authentication factors (passwords, PINs, OTP codes, or secret recovery keys).")
        if signals.get("financial_scam_detected"):
            explanations.append("Unsolicited promises of lottery winnings, crypto gains, wire transfers, or gift card payments detected.")
        if signals.get("brand_impersonation_detected"):
            explanations.append("Message references well-known corporate entities without official domain validation.")

        if risk_level in ["CRITICAL", "HIGH"]:
            recommendations.append("Do NOT respond to the message or call any phone numbers provided in the text.")
            recommendations.append("NEVER disclose OTP codes, passwords, card PINs, or recovery seed phrases to anyone.")
            recommendations.append("Delete the message and block the sender's phone number / email address.")
            recommendations.append("Contact the legitimate organization directly using official verified contact details.")
        elif risk_level == "MEDIUM":
            recommendations.append("Verify the sender's identity through official external channels before taking any requested action.")
            recommendations.append("Do not click any embedded links until their validity has been confirmed.")
        else:
            recommendations.append("Remain cautious when unexpected requests are received.")

        return explanations, recommendations

xai_service = XAIService()
