"""
Dataset Generation & Curation Pipeline for PhishGuard AI.
Generates comprehensive synthetic and benchmark datasets for URL phishing and text scam classification.
Ensures balanced distributions, varied attack vectors, and clean ground truth.
"""

import os
import csv
import random

RANDOM_SEED = 42
random.seed(RANDOM_SEED)

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
URL_DATASET_PATH = os.path.join(CURRENT_DIR, "url_dataset.csv")
TEXT_DATASET_PATH = os.path.join(CURRENT_DIR, "text_scam_dataset.csv")

# 1. Base URL patterns
BENIGN_DOMAINS = [
    "google.com", "microsoft.com", "apple.com", "amazon.com", "github.com",
    "wikipedia.org", "netflix.com", "linkedin.com", "stackoverflow.com", "nytimes.com",
    "bbc.com", "cnn.com", "mozilla.org", "python.org", "fastapi.tiangolo.com",
    "react.dev", "nextjs.org", "tailwindcss.com", "cloudflare.com", "aws.amazon.com",
    "spotify.com", "adobe.com", "salesforce.com", "dropbox.com", "zoom.us",
    "reddit.com", "medium.com", "nature.com", "sciencedirect.com", "mit.edu",
    "stanford.edu", "harvard.edu", "nih.gov", "who.int", "un.org",
    "chase.com", "bankofamerica.com", "wellsfargo.com", "paypal.com", "stripe.com"
]

BENIGN_PATHS = [
    "", "/about", "/contact", "/terms", "/privacy", "/pricing", "/features",
    "/docs/getting-started", "/blog/2026/security-updates", "/login", "/register",
    "/products/enterprise", "/support/help-center", "/download/latest",
    "/api/v1/documentation", "/resources/whitepaper.pdf", "/search?q=machine+learning"
]

PHISHING_TARGETS = [
    "paypal", "apple-id", "microsoft-login", "chase-secure", "bankofamerica-verify",
    "netflix-billing", "amazon-security", "wellsfargo-online", "wallet-connect",
    "metamask-verify", "coinbase-recovery", "instagram-badge", "facebook-support",
    "dhl-tracking-parcel", "usps-redelivery", "irs-tax-refund", "gov-aid-payout"
]

SUSPICIOUS_DOMAINS = [
    "secure-update.xyz", "account-verification.top", "login-auth.click",
    "support-desk.live", "security-check.work", "portal-gateway.cf",
    "server-sync.ml", "online-access.tk", "auth-identity.buzz", "billing-resolve.rest"
]

PHISHING_PATHS = [
    "/verify/identity.php?session_token=",
    "/signin/secure/account_update.htm?client=",
    "/auth/re-login?redirect_to=",
    "/security/unauthorized-access-notice?id=",
    "/billing/payment-failure/update-card.php?user=",
    "/webscr?cmd=_login-run&dispatch=",
    "/confirm/kyc-documents.php?uid=",
    "/recovery/restore-wallet-key?session=",
    "/suspended/unlock-portal.aspx?auth="
]

def generate_url_dataset(num_samples: int = 2400) -> str:
    """Generates a balanced URL phishing dataset (50% benign, 50% phishing)."""
    os.makedirs(CURRENT_DIR, exist_ok=True)
    rows = []
    
    # Generate Benign URLs
    for _ in range(num_samples // 2):
        domain = random.choice(BENIGN_DOMAINS)
        path = random.choice(BENIGN_PATHS)
        scheme = "https://" if random.random() > 0.1 else "http://"
        if random.random() > 0.7:
            sub = random.choice(["www", "app", "dev", "api", "docs", "m", "portal"])
            url = f"{scheme}{sub}.{domain}{path}"
        else:
            url = f"{scheme}{domain}{path}"
            
        rows.append({"url": url, "label": 0})  # 0 = Benign

    # Generate Phishing URLs
    for _ in range(num_samples // 2):
        pattern_type = random.choice(["ip", "punycode", "typo_subdomain", "suspicious_tld", "shortener", "hex_encoded"])
        
        if pattern_type == "ip":
            ip = f"{random.randint(11, 215)}.{random.randint(1, 254)}.{random.randint(1, 254)}.{random.randint(1, 254)}"
            path = random.choice(PHISHING_PATHS) + str(random.randint(10000, 99999))
            url = f"http://{ip}{path}"
            
        elif pattern_type == "punycode":
            target = random.choice(PHISHING_TARGETS)
            url = f"http://xn--{target}-9ya.com{random.choice(PHISHING_PATHS)}"
            
        elif pattern_type == "typo_subdomain":
            target = random.choice(PHISHING_TARGETS)
            legit_domain = random.choice(SUSPICIOUS_DOMAINS)
            path = random.choice(PHISHING_PATHS) + str(random.randint(10000, 99999))
            url = f"http://{target}.account-update.secure.{legit_domain}{path}"
            
        elif pattern_type == "suspicious_tld":
            target = random.choice(PHISHING_TARGETS)
            s_domain = random.choice(SUSPICIOUS_DOMAINS)
            path = random.choice(PHISHING_PATHS)
            url = f"http://{target}-{s_domain}{path}"
            
        elif pattern_type == "shortener":
            shortener = random.choice(["bit.ly", "tinyurl.com", "is.gd", "t.co", "cutt.ly"])
            slug = "".join(random.choices("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", k=7))
            url = f"https://{shortener}/{slug}?target={random.choice(PHISHING_TARGETS)}"
            
        else:  # hex_encoded
            target = random.choice(PHISHING_TARGETS)
            encoded = f"%2e%2f{target}%20auth%2ephp?id=" + str(random.randint(100, 999))
            url = f"http://login-verify-security.com/{encoded}"
            
        rows.append({"url": url, "label": 1})  # 1 = Phishing

    random.shuffle(rows)
    
    with open(URL_DATASET_PATH, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["url", "label"])
        writer.writeheader()
        writer.writerows(rows)
        
    print(f"[Dataset] Generated {len(rows)} URL records at: {URL_DATASET_PATH}")
    return URL_DATASET_PATH


# 2. Base Text Scam dataset patterns
BENIGN_MESSAGES = [
    "Hey, are we still meeting for lunch at 12:30 pm today?",
    "Your doctor appointment is confirmed for Thursday at 3:00 PM. Reply 1 to confirm.",
    "Hi mom, I just arrived safely at the hotel. Talk to you tonight!",
    "Your package from Amazon was delivered to your front porch.",
    "Reminder: Team sprint retro begins at 10 AM tomorrow in Room 4B.",
    "Your verification code is 482910. Do not share this with anyone. Expires in 10 mins.",
    "The weather forecast says it will rain this evening, remember to bring an umbrella.",
    "Attached is the weekly project status report for your review.",
    "Thank you for dining with us! Here is your e-receipt for $24.50.",
    "Hey! Can you send me the lecture notes from today's machine learning class?",
    "Your flight AA104 is on schedule, boarding at gate B22.",
    "Please find the meeting notes and action items from our earlier call.",
    "Happy Birthday! Hope you have a wonderful celebration with family and friends!",
    "Your subscription renews automatically on Nov 15 for $9.99/mo.",
    "Hey team, the latest code PR has been reviewed and merged into main branch."
]

SCAM_MESSAGES = [
    "URGENT: Your Bank of America debit card has been SUSPENDED due to suspicious activity. Click http://192.168.1.1/bofa-verify to unlock your card within 2 hours!",
    "FINAL NOTICE: IRS has filed a lawsuit against you for tax evasion. Call immediately at 1-800-555-0199 or police will be dispatched to your location.",
    "Congratulations! You won the $1,500,000 international lottery! Send your bank details and $200 processing fee via Western Union to claim your prize now.",
    "Security Alert: Unusual login detected on your PayPal account from Russia. If this wasn't you, verify your identity immediately at http://paypal.security-update.xyz/login",
    "Dear Customer, your Netflix subscription expired. Please update your billing credit card information at http://netflix-billing-resolve.top to prevent account cancellation.",
    "USPS: Your delivery package is on hold due to incorrect address. Pay $1.99 redelivery fee at http://usps-redelivery-support.click to avoid package return.",
    "ATTENTION: Your Wells Fargo account has been locked. Enter your OTP and debit card PIN at http://wellsfargo.verify-id.work to restore access.",
    "Earn $500 to $2,000 daily working from home! Guaranteed return on crypto investment. Deposit 0.05 BTC to double your money in 24 hours.",
    "Apple Support: Your iPhone was located near Chicago. Sign in with your Apple ID and password at http://appleid.icloud-locate.cf to view location map.",
    "URGENT: We detected an unauthorized wire transfer of $2,490 from your Chase account. Click http://chase-fraud-prevention.live immediately to cancel transfer.",
    "WhatsApp Security: Your WhatsApp account will be deleted within 24h. Send the 6-digit SMS verification code to verify your phone number.",
    "DHL Express: Package #948271 could not be delivered. Confirm payment of import duty customs fee immediately at http://dhl-express-duty.buzz"
]

def generate_text_dataset(num_samples: int = 1600) -> str:
    """Generates a balanced text scam/smishing dataset."""
    os.makedirs(CURRENT_DIR, exist_ok=True)
    rows = []
    
    # Benign texts
    for _ in range(num_samples // 2):
        base = random.choice(BENIGN_MESSAGES)
        # Add slight natural variations
        variations = [
            base,
            base + f" Ref ID: #{random.randint(1000, 9999)}",
            f"Hi there, {base.lower()}",
            base + " Thanks!"
        ]
        rows.append({"text": random.choice(variations), "label": 0})
        
    # Scam texts
    for _ in range(num_samples // 2):
        base = random.choice(SCAM_MESSAGES)
        variations = [
            base,
            base.upper(),
            f"URGENT NOTICE [{random.randint(100, 999)}]: " + base,
            base + f" Reference Case #{random.randint(100000, 999999)}."
        ]
        rows.append({"text": random.choice(variations), "label": 1})
        
    random.shuffle(rows)
    
    with open(TEXT_DATASET_PATH, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["text", "label"])
        writer.writeheader()
        writer.writerows(rows)
        
    print(f"[Dataset] Generated {len(rows)} Text Scam records at: {TEXT_DATASET_PATH}")
    return TEXT_DATASET_PATH

if __name__ == "__main__":
    generate_url_dataset()
    generate_text_dataset()
