import pytest
from ml.features.url_features import extract_url_features, calculate_entropy, FEATURE_NAMES

def test_feature_names_count():
    assert len(FEATURE_NAMES) == 21

def test_extract_url_features_benign():
    url = "https://www.google.com/search?q=cybersecurity"
    feats = extract_url_features(url)
    
    assert feats["has_https"] == 1
    assert feats["has_ip"] == 0
    assert feats["has_punycode"] == 0
    assert feats["has_suspicious_tld"] == 0
    assert feats["domain_length"] == len("www.google.com")
    assert feats["query_parameter_count"] == 1
    assert feats["entropy"] > 0

def test_extract_url_features_ip_phishing():
    url = "http://192.168.1.1/paypal/verify.php?token=123"
    feats = extract_url_features(url)
    
    assert feats["has_ip"] == 1
    assert feats["has_https"] == 0
    assert feats["dot_count"] >= 3
    assert feats["query_parameter_count"] == 1

def test_extract_url_features_punycode():
    url = "http://xn--pypal-4ve.com/login"
    feats = extract_url_features(url)
    
    assert feats["has_punycode"] == 1

def test_extract_url_features_suspicious_tld():
    url = "http://account-security-update.xyz/verify"
    feats = extract_url_features(url)
    
    assert feats["has_suspicious_tld"] == 1

def test_calculate_entropy():
    assert calculate_entropy("") == 0.0
    assert calculate_entropy("aaaaaa") == 0.0
    assert calculate_entropy("abcdef") > 2.0
