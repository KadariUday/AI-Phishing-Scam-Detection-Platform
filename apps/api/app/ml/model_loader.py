import os
import json
import logging
import joblib
from typing import Optional, Dict, Any
from apps.api.app.core.config import settings

logger = logging.getLogger("phishguard.ml")

class ModelLoader:
    _instance: Optional["ModelLoader"] = None
    
    url_model: Any = None
    url_scaler: Any = None
    url_features_meta: Optional[Dict[str, Any]] = None
    nlp_model: Any = None
    nlp_vectorizer: Any = None
    metrics_manifest: Optional[Dict[str, Any]] = None
    is_loaded: bool = False

    @classmethod
    def get_instance(cls) -> "ModelLoader":
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def load_all_models(self) -> bool:
        """Loads all serialized models, scalers, vectorizers, and metrics manifests into memory."""
        try:
            logger.info("Initializing ML models and vectorizers from artifacts...")
            
            # Load URL Model & Scaler
            if os.path.exists(settings.URL_MODEL_PATH) and os.path.exists(settings.URL_SCALER_PATH):
                self.url_model = joblib.load(settings.URL_MODEL_PATH)
                self.url_scaler = joblib.load(settings.URL_SCALER_PATH)
                logger.info(f"Loaded URL Model from: {settings.URL_MODEL_PATH}")
            else:
                logger.warning("URL model or scaler file not found. Running training fallback if needed.")
                
            # Load URL Metadata
            if os.path.exists(settings.URL_FEATURE_NAMES_PATH):
                with open(settings.URL_FEATURE_NAMES_PATH, "r", encoding="utf-8") as f:
                    self.url_features_meta = json.load(f)
                    
            # Load NLP Model & Vectorizer
            if os.path.exists(settings.NLP_MODEL_PATH) and os.path.exists(settings.NLP_VECTORIZER_PATH):
                self.nlp_model = joblib.load(settings.NLP_MODEL_PATH)
                self.nlp_vectorizer = joblib.load(settings.NLP_VECTORIZER_PATH)
                logger.info(f"Loaded NLP Model from: {settings.NLP_MODEL_PATH}")
            else:
                logger.warning("NLP model or vectorizer file not found.")
                
            # Load Master Metrics
            if os.path.exists(settings.METRICS_MANIFEST_PATH):
                with open(settings.METRICS_MANIFEST_PATH, "r", encoding="utf-8") as f:
                    self.metrics_manifest = json.load(f)
                    
            self.is_loaded = True
            logger.info("All ML artifacts loaded successfully.")
            return True
        except Exception as e:
            logger.error(f"Error loading ML artifacts: {str(e)}", exc_info=True)
            self.is_loaded = False
            return False

model_loader = ModelLoader.get_instance()
