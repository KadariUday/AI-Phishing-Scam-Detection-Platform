import os
import sys
import json
import time

# Ensure project root is in sys.path
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from ml.datasets.generate_datasets import generate_url_dataset, generate_text_dataset
from ml.training.train_url_model import train_url_models
from ml.training.train_nlp_model import train_nlp_model

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
ARTIFACTS_DIR = os.path.abspath(os.path.join(CURRENT_DIR, "..", "artifacts"))
METRICS_MANIFEST_PATH = os.path.join(ARTIFACTS_DIR, "model_metrics.json")

def main():
    print("=" * 60)
    print("PHISHGUARD AI — MACHINE LEARNING TRAINING PIPELINE")
    print("=" * 60)
    start_time = time.time()
    
    os.makedirs(ARTIFACTS_DIR, exist_ok=True)
    
    # 1. Dataset Generation
    print("\n[Step 1/3] Generating datasets...")
    generate_url_dataset()
    generate_text_dataset()
    
    # 2. URL Phishing Model Training
    print("\n[Step 2/3] Training URL Phishing Classifiers...")
    url_meta = train_url_models()
    
    # 3. NLP Text Scam Model Training
    print("\n[Step 3/3] Training NLP Text Scam Classifiers...")
    nlp_metrics = train_nlp_model()
    
    elapsed = round(time.time() - start_time, 2)
    
    # 4. Consolidate Master Metrics Manifest
    master_manifest = {
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "pipeline_duration_seconds": elapsed,
        "platform_version": "1.0.0",
        "url_phishing_model": url_meta,
        "nlp_scam_model": {
            "model_type": "LogisticRegression (TF-IDF 1-3 ngrams)",
            "metrics": nlp_metrics,
            "version": "1.0.0"
        }
    }
    
    with open(METRICS_MANIFEST_PATH, "w", encoding="utf-8") as f:
        json.dump(master_manifest, f, indent=2)
        
    print("\n" + "=" * 60)
    print(f" TRAINING COMPLETE in {elapsed}s")
    print(f" Master metrics manifest written to: {METRICS_MANIFEST_PATH}")
    print("=" * 60)

if __name__ == "__main__":
    main()
