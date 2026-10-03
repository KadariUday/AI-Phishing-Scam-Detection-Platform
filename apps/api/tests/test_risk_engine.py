import pytest
from apps.api.app.services.risk_engine import risk_engine

def test_risk_level_mapping():
    assert risk_engine.calculate_risk_level(95) == ("CRITICAL", "PHISHING")
    assert risk_engine.calculate_risk_level(75) == ("HIGH", "PHISHING")
    assert risk_engine.calculate_risk_level(50) == ("MEDIUM", "SUSPICIOUS")
    assert risk_engine.calculate_risk_level(25) == ("LOW", "SUSPICIOUS")
    assert risk_engine.calculate_risk_level(5) == ("SAFE", "BENIGN")

def test_evaluate_url_risk_safe():
    assessment = risk_engine.evaluate_url_risk(ml_score=0.02, heuristic_score=0.0, indicator_count=0)
    assert assessment["risk_score"] < 20
    assert assessment["risk_level"] == "SAFE"
    assert assessment["classification"] == "BENIGN"

def test_evaluate_url_risk_phishing():
    assessment = risk_engine.evaluate_url_risk(ml_score=0.95, heuristic_score=85.0, indicator_count=3)
    assert assessment["risk_score"] >= 70
    assert assessment["risk_level"] in ["HIGH", "CRITICAL"]
    assert assessment["classification"] == "PHISHING"
