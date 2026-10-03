import os
import sys
import json
import pandas as pd
import joblib

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, average_precision_score, confusion_matrix
)

from ml.features.text_features import clean_text
from ml.datasets.generate_datasets import generate_text_dataset, TEXT_DATASET_PATH

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
ARTIFACTS_DIR = os.path.abspath(os.path.join(CURRENT_DIR, "..", "artifacts"))

def train_nlp_model():
    os.makedirs(ARTIFACTS_DIR, exist_ok=True)
    
    # 1. Ensure dataset exists
    if not os.path.exists(TEXT_DATASET_PATH):
        print("[ML NLP] Generating text dataset...")
        generate_text_dataset()
        
    df = pd.read_csv(TEXT_DATASET_PATH)
    print(f"[ML NLP] Loaded {len(df)} text samples.")
    
    # 2. Clean texts
    cleaned_texts = [clean_text(str(t)) for t in df["text"]]
    y = df["label"].values
    
    # 3. Train-Test Split (80/20)
    X_train_raw, X_test_raw, y_train, y_test = train_test_split(
        cleaned_texts, y, test_size=0.20, random_state=42, stratify=y
    )
    
    # 4. TF-IDF Vectorization
    vectorizer = TfidfVectorizer(
        ngram_range=(1, 3),
        max_features=5000,
        sublinear_tf=True,
        stop_words="english"
    )
    
    X_train_vec = vectorizer.fit_transform(X_train_raw)
    X_test_vec = vectorizer.transform(X_test_raw)
    
    # 5. Classifier
    clf = LogisticRegression(C=2.5, max_iter=1000, random_state=42)
    clf.fit(X_train_vec, y_train)
    
    # 6. Evaluation
    y_pred = clf.predict(X_test_vec)
    y_proba = clf.predict_proba(X_test_vec)[:, 1]
    
    acc = float(accuracy_score(y_test, y_pred))
    prec = float(precision_score(y_test, y_pred, zero_division=0))
    rec = float(recall_score(y_test, y_pred, zero_division=0))
    f1 = float(f1_score(y_test, y_pred, zero_division=0))
    roc_auc = float(roc_auc_score(y_test, y_proba))
    pr_auc = float(average_precision_score(y_test, y_proba))
    cm = confusion_matrix(y_test, y_pred).tolist()
    
    metrics = {
        "accuracy": round(acc, 4),
        "precision": round(prec, 4),
        "recall": round(rec, 4),
        "f1_score": round(f1, 4),
        "roc_auc": round(roc_auc, 4),
        "pr_auc": round(pr_auc, 4),
        "confusion_matrix": cm,
        "vocabulary_size": len(vectorizer.vocabulary_)
    }
    
    print(f"[ML NLP] Text Model: Acc={acc:.4f}, F1={f1:.4f}, ROC-AUC={roc_auc:.4f}")
    
    # 7. Serialize
    model_save_path = os.path.join(ARTIFACTS_DIR, "nlp_scam_model.joblib")
    vectorizer_save_path = os.path.join(ARTIFACTS_DIR, "nlp_vectorizer.joblib")
    
    joblib.dump(clf, model_save_path)
    joblib.dump(vectorizer, vectorizer_save_path)
    
    print(f"[ML NLP] Saved NLP model & vectorizer to {ARTIFACTS_DIR}")
    return metrics

if __name__ == "__main__":
    train_nlp_model()
