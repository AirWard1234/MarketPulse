import torch
import numpy as np
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from typing import Dict, List
import re

# Import your existing config
from app.config import (
    POSITIVE_WORDS,
    NEGATIVE_WORDS,
    COMMODITIES,
    SUPPLY_SHOCK_TERMS,
    GEOPOLITICAL_RISK,
    SAFE_HAVENS,
    MACRO_ENTITIES,
    MONETARY_POLICY,
    ECONOMIC_INDICATORS
)


class FinBertSentimentAnalyzer:
    """Enhanced sentiment analyzer using FinBERT"""

    def __init__(self, model_name: str = "ProsusAI/finbert"):
        """Initialize FinBERT model and tokenizer"""
        print(f"Loading FinBERT model: {model_name}")
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForSequenceClassification.from_pretrained(model_name)
        self.model.to(self.device)
        self.model.eval()
        self.labels = ['negative', 'neutral', 'positive']
        self.cache = {}
        print(f"FinBERT loaded on {self.device}")

    def get_finbert_score(self, text: str) -> Dict:
        """Get sentiment score from FinBERT"""
        if len(text) > 10000:
            text = text[:10000]

        inputs = self.tokenizer(
            text,
            return_tensors="pt",
            truncation=True,
            max_length=512,
            padding=True
        )
        inputs = {k: v.to(self.device) for k, v in inputs.items()}

        with torch.no_grad():
            outputs = self.model(**inputs)
            probs = torch.nn.functional.softmax(outputs.logits, dim=-1)[0].cpu().numpy()

        neg_prob, neu_prob, pos_prob = probs
        confidence = float(max(probs) - 0.33)
        sentiment_score = float(pos_prob - neg_prob)
        scaled_score = sentiment_score * 5

        return {
            'score': scaled_score,
            'raw_score': sentiment_score,
            'confidence': confidence,
            'probabilities': {
                'negative': float(neg_prob),
                'neutral': float(neu_prob),
                'positive': float(pos_prob)
            },
            'predicted_label': self.labels[int(np.argmax(probs))]
        }

    def get_aspect_sentiment(self, text: str, aspect_keywords: List[str]) -> float:
        """Get sentiment for specific aspects"""
        if not aspect_keywords:
            return 0.0

        sentences = re.split(r'[.!?]+', text)
        relevant_sentences = [
            s.strip() for s in sentences
            if any(k.lower() in s.lower() for k in aspect_keywords) and len(s.strip()) > 10
        ]

        if not relevant_sentences:
            return 0.0

        combined_text = ' '.join(relevant_sentences[:5])
        return float(self.get_finbert_score(combined_text)['score'])

    def get_lexicon_score(self, text: str) -> float:
        """Lexicon-based scoring"""
        words = text.lower().split()
        positive = sum(word in POSITIVE_WORDS for word in words)
        negative = sum(word in NEGATIVE_WORDS for word in words)
        return float(positive - negative)

    def calculate_dynamic_weights(self, classification: Dict, finbert_confidence: float, text_length: int) -> Dict[str, float]:
        """Dynamic weighting for sentiment components"""
        weights = {'finbert': 0.6, 'lexicon': 0.2, 'aspect': 0.2}

        if finbert_confidence > 0.8:
            weights['finbert'] += 0.2
            weights['lexicon'] -= 0.1
            weights['aspect'] -= 0.1
        elif finbert_confidence < 0.4:
            weights['finbert'] -= 0.2
            weights['lexicon'] += 0.1
            weights['aspect'] += 0.1

        if classification.get('risk'):
            weights['aspect'] += 0.15
            weights['finbert'] -= 0.1
            weights['lexicon'] -= 0.05

        if classification.get('commodity'):
            weights['lexicon'] += 0.1
            weights['finbert'] -= 0.05
            weights['aspect'] -= 0.05

        if classification.get('macro'):
            weights['finbert'] += 0.1
            weights['lexicon'] -= 0.05
            weights['aspect'] -= 0.05

        if text_length < 50:
            weights['lexicon'] += 0.2
            weights['finbert'] -= 0.2
        elif text_length > 500:
            weights['finbert'] += 0.1
            weights['aspect'] += 0.1
            weights['lexicon'] -= 0.2

        total = sum(weights.values())
        return {k: float(v / total) for k, v in weights.items()}

    def get_aspect_keywords_from_classification(self, classification: Dict) -> List[str]:
        """Extract aspect keywords based on classification"""
        aspect_keywords = []

        if classification.get('commodity'):
            aspect_keywords.extend(list(COMMODITIES))

        if classification.get('risk'):
            risk_type = classification['risk']
            if risk_type == 'supply_shock':
                aspect_keywords.extend(list(SUPPLY_SHOCK_TERMS))
            elif risk_type == 'geopolitical_risk':
                aspect_keywords.extend(list(GEOPOLITICAL_RISK))
            elif risk_type == 'risk_off':
                aspect_keywords.extend(list(SAFE_HAVENS))

        if classification.get('macro'):
            aspect_keywords.extend(list(MACRO_ENTITIES))
            aspect_keywords.extend(list(MONETARY_POLICY))
            aspect_keywords.extend(list(ECONOMIC_INDICATORS))

        return list(set(aspect_keywords))

    def apply_classification_adjustments(self, score: float, classification: Dict, confidence: float) -> float:
        # Example: boost score if macro and high confidence
        if classification.get('macro') and confidence > 0.7:
            score *= 1.05
        return float(score)

    def compute_sentiment(self, text: str, classification: Dict) -> float:
        """Compute combined sentiment score"""
        cache_key = hash(text[:200])
        if cache_key in self.cache:
            return self.cache[cache_key]

        finbert_result = self.get_finbert_score(text)
        lexicon_score = self.get_lexicon_score(text)
        aspect_keywords = self.get_aspect_keywords_from_classification(classification)
        aspect_score = self.get_aspect_sentiment(text, aspect_keywords) if aspect_keywords else 0.0

        text_length = len(text.split())
        weights = self.calculate_dynamic_weights(classification, finbert_result['confidence'], text_length)

        combined_score = (
            weights['finbert'] * finbert_result['score'] +
            weights['lexicon'] * lexicon_score +
            weights['aspect'] * aspect_score
        )

        final_score = self.apply_classification_adjustments(combined_score, classification, finbert_result['confidence'])
        final_score = float(final_score)

        self.cache[cache_key] = final_score
        return final_score

    def get_sentiment_details(self, text: str, classification: Dict) -> Dict:
        """Return detailed sentiment analysis for JSON serialization"""
        finbert_result = self.get_finbert_score(text)
        lexicon_score = self.get_lexicon_score(text)
        aspect_keywords = self.get_aspect_keywords_from_classification(classification)
        aspect_score = self.get_aspect_sentiment(text, aspect_keywords) if aspect_keywords else 0.0
        text_length = len(text.split())
        weights = self.calculate_dynamic_weights(classification, finbert_result['confidence'], text_length)

        combined_score = (
            weights['finbert'] * finbert_result['score'] +
            weights['lexicon'] * lexicon_score +
            weights['aspect'] * aspect_score
        )

        final_score = self.apply_classification_adjustments(combined_score, classification, finbert_result['confidence'])

        return {
            'final_score': float(final_score),
            'components': {
                'finbert': {
                    'score': float(finbert_result['score']),
                    'confidence': float(finbert_result['confidence']),
                    'probabilities': {k: float(v) for k, v in finbert_result['probabilities'].items()},
                    'predicted_label': finbert_result['predicted_label']
                },
                'lexicon': {'score': float(lexicon_score)},
                'aspect': {'score': float(aspect_score), 'keywords': aspect_keywords[:10]}
            },
            'weights': {k: float(v) for k, v in weights.items()},
            'classification': classification,
            'text_length': text_length
        }


# Singleton instance for FastAPI usage
_analyzer_instance = None

def get_sentiment_analyzer() -> FinBertSentimentAnalyzer:
    """Get or create the FinBERT sentiment analyzer singleton"""
    global _analyzer_instance
    if _analyzer_instance is None:
        _analyzer_instance = FinBertSentimentAnalyzer()
    return _analyzer_instance


def compute_enhanced_sentiment(text: str, classification: Dict) -> float:
    """Convenience function to compute enhanced sentiment score"""
    analyzer = get_sentiment_analyzer()
    return analyzer.compute_sentiment(text, classification)

