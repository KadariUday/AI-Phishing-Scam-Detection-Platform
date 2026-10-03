"""
URL Feature Extraction Engine for PhishGuard AI.
Extracts 21 static lexical, structural, and information-theoretic (Shannon entropy) features.
Safe execution: No external HTTP/DNS network queries (SSRF-safe).
"""

import math
import re
from typing import Dict, Any, List
from urllib.parse import urlparse, parse_qs

# Known high-abuse Top-Level Domains commonly seen in phishing campaigns
SUSPICIOUS_TLDS = {
    "xyz", "top", "work", "loan", "click", "gq", "cf", "ga", "ml", "tk",
    "country", "stream", "download", "racing", "win", "accountant", "party",
    "faith", "cricket", "date", "space", "bid", "link", "club", "buzz", "rest", "cam"
}

# Known URL shortener services
URL_SHORTENERS = {
    "bit.ly", "tinyurl.com", "goo.gl", "ow.ly", "is.gd", "buff.ly", "adf.ly",
    "bit.do", "t.co", "tiny.cc", "lnkd.in", "db.tt", "qr.ae", "ift.tt", "cutt.ly",
    "rebrand.ly", "shorte.st", "bl.ink"
}

# IPv4 regex pattern matching bare IP addresses
IPV4_REGEX = re.compile(
    r"^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}"
    r"(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
)

# IPv6 regex pattern
IPV6_REGEX = re.compile(r"^\[?[0-9a-fA-F:]+\]?$")

# Special characters to tally
SPECIAL_CHARS = set("@?=_&%!~$,;:+*#^()[]{}|\\")

FEATURE_NAMES = [
    "url_length",
    "domain_length",
    "path_length",
    "query_length",
    "subdomain_count",
    "dot_count",
    "hyphen_count",
    "digit_count",
    "special_character_count",
    "has_ip",
    "has_https",
    "has_at_symbol",
    "has_double_slash",
    "has_punycode",
    "has_percent_encoding",
    "has_suspicious_tld",
    "has_shortener",
    "entropy",
    "hostname_entropy",
    "path_entropy",
    "query_parameter_count",
]


def calculate_entropy(text: str) -> float:
    """
    Computes the Shannon Entropy of a string: H = -sum(p * log2(p)).
    Returns 0.0 for empty strings.
    """
    if not text:
        return 0.0
    
    length = len(text)
    freq: Dict[str, int] = {}
    for char in text:
        freq[char] = freq.get(char, 0) + 1
        
    entropy = 0.0
    for count in freq.values():
        prob = count / length
        entropy -= prob * math.log2(prob)
        
    return round(entropy, 4)


def extract_url_features(url: str) -> Dict[str, Any]:
    """
    Extracts 21 static features from a URL string safely without dynamic requests.
    Handles schemes, malformed URLs, and relative paths gracefully.
    """
    if not url or not isinstance(url, str):
        url = ""
    
    url_clean = url.strip()
    
    # Ensure scheme for standard parsing if missing
    if not re.match(r"^[a-zA-Z][a-zA-Z0-9+-.]*://", url_clean):
        parsed = urlparse("http://" + url_clean)
        has_original_scheme = False
    else:
        parsed = urlparse(url_clean)
        has_original_scheme = True

    hostname = (parsed.hostname or "").lower()
    path = parsed.path or ""
    query = parsed.query or ""
    
    # 1. Structural Lengths
    url_length = len(url_clean)
    domain_length = len(hostname)
    path_length = len(path)
    query_length = len(query)

    # 2. Subdomains & Dots
    dot_count = url_clean.count(".")
    domain_parts = hostname.split(".")
    # Subdomain count: total parts minus domain name and TLD (if parts >= 2)
    subdomain_count = max(0, len(domain_parts) - 2) if len(domain_parts) >= 2 else 0

    # 3. Lexical Counts
    hyphen_count = url_clean.count("-")
    digit_count = sum(1 for c in url_clean if c.isdigit())
    special_char_count = sum(1 for c in url_clean if c in SPECIAL_CHARS)

    # 4. IP Hostname Check
    is_ip = 0
    clean_host = hostname.strip("[]")
    if IPV4_REGEX.match(clean_host) or (":" in clean_host and IPV6_REGEX.match(hostname)):
        is_ip = 1

    # 5. HTTPS Check
    has_https = 1 if (has_original_scheme and parsed.scheme.lower() == "https") else 0

    # 6. At Symbol (@) in URL (can be used to obscure target host)
    has_at_symbol = 1 if "@" in url_clean else 0

    # 7. Double Slash (//) in path (often used in open redirects)
    has_double_slash = 1 if "//" in path else 0

    # 8. Punycode (IDN homograph attack indicator)
    has_punycode = 1 if "xn--" in hostname.lower() else 0

    # 9. Percent Encoding (%20, %2e, etc.)
    has_percent_encoding = 1 if "%" in url_clean else 0

    # 10. Suspicious TLD
    tld = domain_parts[-1] if domain_parts else ""
    has_suspicious_tld = 1 if tld in SUSPICIOUS_TLDS else 0

    # 11. Known Shortener
    has_shortener = 1 if hostname in URL_SHORTENERS or any(hostname.endswith("." + s) for s in URL_SHORTENERS) else 0

    # 12. Entropy Metrics
    entropy = calculate_entropy(url_clean)
    hostname_entropy = calculate_entropy(hostname)
    path_entropy = calculate_entropy(path)

    # 13. Query Parameters Count
    try:
        query_params = parse_qs(query)
        query_param_count = len(query_params)
    except Exception:
        query_param_count = 0

    return {
        "url_length": url_length,
        "domain_length": domain_length,
        "path_length": path_length,
        "query_length": query_length,
        "subdomain_count": subdomain_count,
        "dot_count": dot_count,
        "hyphen_count": hyphen_count,
        "digit_count": digit_count,
        "special_character_count": special_char_count,
        "has_ip": is_ip,
        "has_https": has_https,
        "has_at_symbol": has_at_symbol,
        "has_double_slash": has_double_slash,
        "has_punycode": has_punycode,
        "has_percent_encoding": has_percent_encoding,
        "has_suspicious_tld": has_suspicious_tld,
        "has_shortener": has_shortener,
        "entropy": entropy,
        "hostname_entropy": hostname_entropy,
        "path_entropy": path_entropy,
        "query_parameter_count": query_param_count,
    }


def feature_dict_to_vector(features: Dict[str, Any]) -> List[float]:
    """Converts a feature dictionary to an ordered feature vector matching FEATURE_NAMES."""
    return [float(features.get(name, 0.0)) for name in FEATURE_NAMES]
