from typing import Dict, Any, List
from ml.features.text_features import clean_text, extract_text_intent_signals
from apps.api.app.ml.model_loader import model_loader
from apps.api.app.ml.url_detector import url_detector
from apps.api.app.schemas.scan import ThreatIndicator

class NLPDetector:
    """Performs natural language processing, social engineering intent detection, and ML scam classification."""

    def analyze(self, text: str, sender: str = "", subject: str = "") -> Dict[str, Any]:
        full_text = f"{sender} {subject} {text}".strip()
        cleaned = clean_text(full_text)
        signals = extract_text_intent_signals(full_text)
        indicators: List[ThreatIndicator] = []
        
        # 1. Intent Rule Indicators
        if signals["urgency_detected"]:
            indicators.append(ThreatIndicator(
                code="URGENCY_TRIGGER",
                severity="HIGH",
                title="Artificial Urgency & Time Scarcity",
                description=f"Message uses coercive urgency triggers ({', '.join(signals['urgency_matches'][:3])}) to induce panic and hasty compliance."
            ))

        if signals["fear_threat_detected"]:
            indicators.append(ThreatIndicator(
                code="FEAR_COERCION",
                severity="CRITICAL",
                title="Intimidation & Legal / Account Threat",
                description=f"Message threatens penalties, suspension, or legal consequences ({', '.join(signals['fear_threat_matches'][:3])}) characteristic of extortion scams."
            ))

        if signals["credential_harvesting_detected"]:
            indicators.append(ThreatIndicator(
                code="CREDENTIAL_HARVESTING",
                severity="CRITICAL",
                title="Sensitive Credential / OTP Request",
                description=f"Direct request for confidential authentication factors ({', '.join(signals['credential_matches'][:3])}). Legitimate entities never solicit OTPs via unverified channels."
            ))

        if signals["financial_scam_detected"]:
            indicators.append(ThreatIndicator(
                code="FINANCIAL_SOLICITATION",
                severity="HIGH",
                title="Unsolicited Financial / Crypto / Prize Claims",
                description=f"Lure involving lottery, wire transfers, crypto, or refunds ({', '.join(signals['financial_scam_matches'][:3])})."
            ))

        if signals["brand_impersonation_detected"]:
            indicators.append(ThreatIndicator(
                code="BRAND_IMPERSONATION",
                severity="HIGH",
                title="Brand / Service Impersonation",
                description=f"Mentions major recognizable organizations ({', '.join(signals['brand_matches'][:3])}) commonly targeted by spoofers."
            ))

        # 2. Inspect embedded URLs
        embedded_url_analyses = []
        max_url_risk = 0.0
        for u in signals["extracted_urls"]:
            u_res = url_detector.analyze(u)
            embedded_url_analyses.append(u_res)
            if u_res["ml_score"] > max_url_risk:
                max_url_risk = u_res["ml_score"]
            # Merge indicators from embedded URLs
            indicators.extend(u_res["threat_indicators"])

        # 3. NLP ML Model Inference
        nlp_ml_score = 0.0
        if model_loader.nlp_model is not None and model_loader.nlp_vectorizer is not None:
            try:
                vec = model_loader.nlp_vectorizer.transform([cleaned])
                probs = model_loader.nlp_model.predict_proba(vec)
                nlp_ml_score = float(probs[0][1])
            except Exception:
                nlp_ml_score = signals["heuristic_intent_score"] / 100.0
        else:
            nlp_ml_score = signals["heuristic_intent_score"] / 100.0

        return {
            "signals": signals,
            "threat_indicators": indicators,
            "heuristic_intent_score": float(signals["heuristic_intent_score"]),
            "nlp_ml_score": float(round(nlp_ml_score, 4)),
            "embedded_urls": signals["extracted_urls"],
            "max_url_risk": float(round(max_url_risk, 4))
        }

nlp_detector = NLPDetector()
