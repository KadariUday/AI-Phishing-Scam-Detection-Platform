import numpy as np
from typing import Dict, Any, List, Tuple
from urllib.parse import urlparse

from ml.features.url_features import extract_url_features, FEATURE_NAMES, feature_dict_to_vector
from apps.api.app.ml.model_loader import model_loader
from apps.api.app.schemas.scan import ThreatIndicator

class URLDetector:
    """Performs static lexical analysis, heuristic inspection, and ML inference on URLs."""

    def analyze(self, url: str) -> Dict[str, Any]:
        features = extract_url_features(url)
        indicators: List[ThreatIndicator] = []
        heuristic_score = 0
        
        parsed = urlparse(url if "://" in url else "http://" + url)
        domain = parsed.hostname or ""

        # 1. Rule Heuristics
        if features["has_ip"]:
            heuristic_score += 45
            indicators.append(ThreatIndicator(
                code="IP_HOSTNAME",
                severity="CRITICAL",
                title="Bare IP Address in Hostname",
                description="The URL uses a raw IP address instead of a standard domain name, a hallmark of evasion and rogue servers."
            ))
            
        if features["has_punycode"]:
            heuristic_score += 40
            indicators.append(ThreatIndicator(
                code="PUNYCODE_HOMOGRAPH",
                severity="HIGH",
                title="Punycode / Homograph Domain Detected",
                description="Domain uses internationalized characters ('xn--') that visually imitate trusted brand names."
            ))
            
        if features["has_suspicious_tld"]:
            heuristic_score += 30
            indicators.append(ThreatIndicator(
                code="SUSPICIOUS_TLD",
                severity="HIGH",
                title="High-Risk Top-Level Domain (TLD)",
                description=f"The domain uses a TLD known for high abuse and malicious campaign registration rates."
            ))
            
        if features["has_shortener"]:
            heuristic_score += 25
            indicators.append(ThreatIndicator(
                code="URL_SHORTENER",
                severity="MEDIUM",
                title="URL Shortening Service",
                description="Shortened links obscure the final landing destination and are frequently used to bypass basic filters."
            ))
            
        if features["entropy"] > 4.5:
            heuristic_score += 25
            indicators.append(ThreatIndicator(
                code="HIGH_ENTROPY",
                severity="MEDIUM",
                title="High Shannon Entropy",
                description="Unusual randomness in the URL structure, often indicative of dynamic session hashes or domain generation algorithms (DGA)."
            ))
            
        if not features["has_https"]:
            heuristic_score += 20
            indicators.append(ThreatIndicator(
                code="NO_HTTPS",
                severity="MEDIUM",
                title="Unencrypted Protocol (HTTP)",
                description="Communications are transmitted over unencrypted HTTP, leaving data vulnerable to interception."
            ))
            
        if features["subdomain_count"] >= 3:
            heuristic_score += 20
            indicators.append(ThreatIndicator(
                code="EXCESSIVE_SUBDOMAINS",
                severity="MEDIUM",
                title="Excessive Subdomain Depth",
                description=f"Hostname contains {features['subdomain_count']} subdomains, commonly used to disguise fraudulent destination servers."
            ))
            
        if features["has_at_symbol"]:
            heuristic_score += 35
            indicators.append(ThreatIndicator(
                code="AT_SYMBOL_OBFUSCATION",
                severity="HIGH",
                title="@ Character in URL",
                description="The @ character can cause browsers to discard leading credentials and route to an unexpected destination."
            ))

        heuristic_score = min(100, heuristic_score)

        # 2. ML Inference
        ml_prob = 0.0
        if model_loader.url_model is not None and model_loader.url_scaler is not None:
            try:
                vec = np.array([feature_dict_to_vector(features)], dtype=np.float32)
                vec_scaled = model_loader.url_scaler.transform(vec)
                probs = model_loader.url_model.predict_proba(vec_scaled)
                ml_prob = float(probs[0][1])  # probability of class 1 (phishing)
            except Exception:
                ml_prob = heuristic_score / 100.0
        else:
            ml_prob = heuristic_score / 100.0

        return {
            "domain": domain,
            "features": features,
            "threat_indicators": indicators,
            "heuristic_score": float(heuristic_score),
            "ml_score": float(round(ml_prob, 4))
        }

url_detector = URLDetector()
