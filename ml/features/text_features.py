"""
NLP Feature & Intent Extraction Engine for PhishGuard AI.
Extracts social engineering indicators, psychological triggers, and lexical markers.
"""

import re
from typing import Dict, Any, List, Set

# Regex for detecting embedded URLs within text
URL_EXTRACT_REGEX = re.compile(r"https?://[^\s<>\"']+|www\.[^\s<>\"']+", re.IGNORECASE)

# Psychological triggers & social engineering lexical dictionaries
URGENCY_KEYWORDS: Set[str] = {
    "urgent", "immediately", "act now", "action required", "within 24 hours",
    "within 12 hours", "within 2 hours", "expires today", "suspended",
    "final notice", "immediate action", "time-sensitive", "deadline",
    "account terminated", "restricted immediately", "warning"
}

FEAR_THREAT_KEYWORDS: Set[str] = {
    "lawsuit", "arrest", "legal action", "police", "court", "warrant",
    "penalty", "prosecution", "suspended permanently", "security breach",
    "unauthorized transaction", "compromised", "fraudulent activity", "hacked",
    "fine", "custody", "fbi", "irs", "customs"
}

FINANCIAL_SCAM_KEYWORDS: Set[str] = {
    "winner", "lottery", "prize", "claimed", "reward", "inheritance",
    "crypto", "bitcoin", "eth", "wire transfer", "gift card", "apple pay",
    "western union", "cash app", "zelle", "refund", "overpayment",
    "guaranteed return", "investment opportunity", "double your money",
    "congratulations you won", "million dollars", "grant approved"
}

CREDENTIAL_OTP_KEYWORDS: Set[str] = {
    "password", "pin", "otp", "one-time password", "verification code",
    "passcode", "security code", "ssn", "social security", "card number",
    "cvv", "cctv", "security question", "mothers maiden name",
    "secret phrase", "seed phrase", "private key", "login credentials"
}

SPOOFED_BRANDS: Set[str] = {
    "paypal", "apple", "microsoft", "amazon", "netflix", "bank of america",
    "wells fargo", "chase", "citibank", "dhl", "fedex", "usps", "google",
    "facebook", "meta", "instagram", "coinbase", "binance", "metamask",
    "dropbox", "linkedin", "whatsapp", "telegram"
}


def clean_text(text: str) -> str:
    """Normalizes raw input text for NLP analysis."""
    if not text or not isinstance(text, str):
        return ""
    # Lowercase
    cleaned = text.lower()
    # Replace multiple whitespaces and newlines
    cleaned = re.sub(r"\s+", " ", cleaned).strip()
    return cleaned


def extract_text_intent_signals(text: str) -> Dict[str, Any]:
    """
    Analyzes input text to identify social engineering triggers, embedded URLs,
    and intent categories.
    """
    cleaned = clean_text(text)
    
    # 1. Extract embedded URLs
    extracted_urls = URL_EXTRACT_REGEX.findall(text)
    has_links = 1 if len(extracted_urls) > 0 else 0
    
    # 2. Check keyword triggers
    urgency_matches = [k for k in URGENCY_KEYWORDS if k in cleaned]
    fear_matches = [k for k in FEAR_THREAT_KEYWORDS if k in cleaned]
    financial_matches = [k for k in FINANCIAL_SCAM_KEYWORDS if k in cleaned]
    credential_matches = [k for k in CREDENTIAL_OTP_KEYWORDS if k in cleaned]
    brand_matches = [k for k in SPOOFED_BRANDS if k in cleaned]
    
    # 3. Compute signal score
    signal_score = 0
    if urgency_matches:
        signal_score += 25
    if fear_matches:
        signal_score += 30
    if credential_matches:
        signal_score += 35
    if financial_matches:
        signal_score += 25
    if has_links and (urgency_matches or credential_matches or fear_matches):
        signal_score += 20
        
    signal_score = min(100, signal_score)
    
    return {
        "text_length": len(text),
        "word_count": len(cleaned.split()),
        "has_urls": has_links,
        "extracted_urls": extracted_urls,
        "urgency_detected": len(urgency_matches) > 0,
        "urgency_matches": urgency_matches,
        "fear_threat_detected": len(fear_matches) > 0,
        "fear_threat_matches": fear_matches,
        "financial_scam_detected": len(financial_matches) > 0,
        "financial_scam_matches": financial_matches,
        "credential_harvesting_detected": len(credential_matches) > 0,
        "credential_matches": credential_matches,
        "brand_impersonation_detected": len(brand_matches) > 0,
        "brand_matches": brand_matches,
        "heuristic_intent_score": signal_score
    }
