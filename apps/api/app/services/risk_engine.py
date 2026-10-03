from typing import Dict, Any, Tuple

class RiskEngine:
    """
    Centralized Hybrid Risk Engine for PhishGuard AI.
    Combines ML prediction probabilities, heuristic rule penalties,
    and NLP intent signals to compute a normalized 0-100 Risk Score.
    """

    # Configurable engine weights
    URL_WEIGHT_ML = 0.55
    URL_WEIGHT_HEURISTIC = 0.45

    TEXT_WEIGHT_NLP_ML = 0.45
    TEXT_WEIGHT_INTENT = 0.35
    TEXT_WEIGHT_EMBEDDED_URL = 0.20

    @staticmethod
    def calculate_risk_level(score: int) -> Tuple[str, str]:
        """
        Maps a 0-100 score to (Risk Level, Classification).
        Tiers:
          0 - 19:  SAFE     -> BENIGN
          20 - 39: LOW      -> SUSPICIOUS / UNVERIFIED
          40 - 69: MEDIUM   -> SUSPICIOUS
          70 - 89: HIGH     -> PHISHING / SCAM
          90 - 100: CRITICAL -> PHISHING / MALICIOUS SCAM
        """
        if score >= 90:
            return "CRITICAL", "PHISHING"
        elif score >= 70:
            return "HIGH", "PHISHING"
        elif score >= 40:
            return "MEDIUM", "SUSPICIOUS"
        elif score >= 20:
            return "LOW", "SUSPICIOUS"
        else:
            return "SAFE", "BENIGN"

    def evaluate_url_risk(self, ml_score: float, heuristic_score: float, indicator_count: int) -> Dict[str, Any]:
        """Calculates final risk score and confidence for a URL."""
        # Baseline weighted combination
        combined_raw = (ml_score * 100 * self.URL_WEIGHT_ML) + (heuristic_score * self.URL_WEIGHT_HEURISTIC)
        
        # High indicator boost
        if indicator_count >= 3:
            combined_raw = max(combined_raw, 75.0)
        elif indicator_count >= 2:
            combined_raw = max(combined_raw, 45.0)
            
        final_score = int(min(100, max(0, round(combined_raw))))
        risk_level, classification = self.calculate_risk_level(final_score)
        
        # Confidence calculation
        confidence = round(0.85 + (abs(final_score - 50) / 100.0) * 0.14, 2)
        
        return {
            "risk_score": final_score,
            "risk_level": risk_level,
            "classification": classification,
            "confidence": confidence
        }

    def evaluate_text_risk(
        self,
        nlp_ml_score: float,
        heuristic_intent_score: float,
        max_embedded_url_risk: float,
        indicator_count: int
    ) -> Dict[str, Any]:
        """Calculates final risk score and confidence for messages / emails."""
        raw = (
            (nlp_ml_score * 100 * self.TEXT_WEIGHT_NLP_ML) +
            (heuristic_intent_score * self.TEXT_WEIGHT_INTENT) +
            (max_embedded_url_risk * 100 * self.TEXT_WEIGHT_EMBEDDED_URL)
        )
        
        # Severe trigger boost (e.g. credential harvesting + urgent threat)
        if indicator_count >= 3 or max_embedded_url_risk > 0.8:
            raw = max(raw, 80.0)
        elif indicator_count >= 2:
            raw = max(raw, 50.0)
            
        final_score = int(min(100, max(0, round(raw))))
        risk_level, _ = self.calculate_risk_level(final_score)
        
        classification = "SCAM" if final_score >= 70 else ("SUSPICIOUS" if final_score >= 20 else "BENIGN")
        confidence = round(0.86 + (abs(final_score - 50) / 100.0) * 0.13, 2)

        return {
            "risk_score": final_score,
            "risk_level": risk_level,
            "classification": classification,
            "confidence": confidence
        }

risk_engine = RiskEngine()
