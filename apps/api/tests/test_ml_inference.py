import pytest
from apps.api.app.ml.model_loader import model_loader
from apps.api.app.ml.url_detector import url_detector
from apps.api.app.ml.nlp_detector import nlp_detector

def test_model_loader_initialization():
    loaded = model_loader.load_all_models()
    assert loaded is True
    assert model_loader.url_model is not None
    assert model_loader.nlp_model is not None

def test_url_detector_phishing():
    model_loader.load_all_models()
    res = url_detector.analyze("http://192.168.1.50/paypal/login.php?session=9102")
    assert res["domain"] == "192.168.1.50"
    assert res["features"]["has_ip"] == 1
    assert len(res["threat_indicators"]) >= 1
    assert res["ml_score"] > 0.5

def test_url_detector_benign():
    model_loader.load_all_models()
    res = url_detector.analyze("https://www.wikipedia.org/wiki/Artificial_intelligence")
    assert res["features"]["has_https"] == 1
    assert res["features"]["has_ip"] == 0
    assert res["heuristic_score"] == 0.0

def test_nlp_detector_scam():
    model_loader.load_all_models()
    msg = "URGENT: Your bank account will be suspended! Enter your PIN and OTP immediately at http://secure-update.xyz"
    res = nlp_detector.analyze(text=msg)
    assert res["signals"]["urgency_detected"] is True
    assert res["signals"]["credential_harvesting_detected"] is True
    assert len(res["threat_indicators"]) >= 2
    assert res["nlp_ml_score"] > 0.5
