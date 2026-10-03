import os
import sys
import json
import numpy as np
import pandas as pd
import joblib

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, average_precision_score, confusion_matrix
)

from ml.features.url_features import extract_url_features, FEATURE_NAMES
from ml.datasets.generate_datasets import generate_url_dataset, URL_DATASET_PATH

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
ARTIFACTS_DIR = os.path.abspath(os.path.join(CURRENT_DIR, "..", "artifacts"))

def train_url_models():
    os.makedirs(ARTIFACTS_DIR, exist_ok=True)
    
    # 1. Ensure dataset exists
    if not os.path.exists(URL_DATASET_PATH):
        print("[ML URL] Generating dataset...")
        generate_url_dataset()
        
    df = pd.read_csv(URL_DATASET_PATH)
    print(f"[ML URL] Loaded {len(df)} samples for training.")
    
    # 2. Extract 21 static features
    print("[ML URL] Extracting 21 static features per URL...")
    feature_rows = []
    for url in df["url"]:
        feats = extract_url_features(str(url))
        feature_rows.append([feats[name] for name in FEATURE_NAMES])
        
    X = np.array(feature_rows, dtype=np.float32)
    y = df["label"].values
    
    # 3. Stratified Train-Test Split (80/20)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )
    
    # 4. Feature Scaling
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # 5. Candidate Models
    models = {
        "RandomForest": RandomForestClassifier(
            n_estimators=120, max_depth=14, random_state=42, n_jobs=-1
        ),
        "GradientBoosting": GradientBoostingClassifier(
            n_estimators=100, learning_rate=0.1, max_depth=6, random_state=42
        ),
        "LogisticRegression": LogisticRegression(
            max_iter=1000, random_state=42
        )
    }
    
    results = {}
    best_f1 = -1.0
    best_model_name = ""
    best_model_obj = None
    
    for name, clf in models.items():
        print(f"[ML URL] Training {name}...")
        clf.fit(X_train_scaled, y_train)
        
        y_pred = clf.predict(X_test_scaled)
        y_proba = clf.predict_proba(X_test_scaled)[:, 1] if hasattr(clf, "predict_proba") else y_pred
        
        acc = float(accuracy_score(y_test, y_pred))
        prec = float(precision_score(y_test, y_pred, zero_division=0))
        rec = float(recall_score(y_test, y_pred, zero_division=0))
        f1 = float(f1_score(y_test, y_pred, zero_division=0))
        roc_auc = float(roc_auc_score(y_test, y_proba))
        pr_auc = float(average_precision_score(y_test, y_proba))
        cm = confusion_matrix(y_test, y_pred).tolist()
        
        results[name] = {
            "accuracy": round(acc, 4),
            "precision": round(prec, 4),
            "recall": round(rec, 4),
            "f1_score": round(f1, 4),
            "roc_auc": round(roc_auc, 4),
            "pr_auc": round(pr_auc, 4),
            "confusion_matrix": cm
        }
        
        print(f" -> {name}: Acc={acc:.4f}, F1={f1:.4f}, ROC-AUC={roc_auc:.4f}")
        
        if f1 > best_f1:
            best_f1 = f1
            best_model_name = name
            best_model_obj = clf
            
    print(f"[ML URL] Selected champion model: {best_model_name} (F1 = {best_f1:.4f})")
    
    # 6. Feature Importances for Champion Model
    feature_importances = {}
    if hasattr(best_model_obj, "feature_importances_"):
        importances = best_model_obj.feature_importances_
        for idx, name in enumerate(FEATURE_NAMES):
            feature_importances[name] = round(float(importances[idx]), 4)
    elif hasattr(best_model_obj, "coef_"):
        coefs = np.abs(best_model_obj.coef_[0])
        total = float(np.sum(coefs)) or 1.0
        for idx, name in enumerate(FEATURE_NAMES):
            feature_importances[name] = round(float(coefs[idx] / total), 4)
            
    # Sort feature importances descending
    sorted_importances = dict(sorted(feature_importances.items(), key=lambda item: item[1], reverse=True))
    
    # 7. Serialize Artifacts
    model_save_path = os.path.join(ARTIFACTS_DIR, "url_phishing_model.joblib")
    scaler_save_path = os.path.join(ARTIFACTS_DIR, "url_scaler.joblib")
    features_meta_path = os.path.join(ARTIFACTS_DIR, "url_features.json")
    
    joblib.dump(best_model_obj, model_save_path)
    joblib.dump(scaler, scaler_save_path)
    
    meta = {
        "model_type": best_model_name,
        "feature_names": FEATURE_NAMES,
        "feature_importances": sorted_importances,
        "metrics": results[best_model_name],
        "all_model_benchmarks": results,
        "training_samples": len(df),
        "version": "1.0.0"
    }
    
    with open(features_meta_path, "w", encoding="utf-8") as f:
        json.dump(meta, f, indent=2)
        
    print(f"[ML URL] Model artifacts saved to {ARTIFACTS_DIR}")
    return meta

if __name__ == "__main__":
    train_url_models()
