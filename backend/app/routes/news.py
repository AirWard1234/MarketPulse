from fastapi import APIRouter
from app.services.news import concatenate_news_text, extract_headline_summary
from app.services.finnhub import get_market_news
from app.config import STOPWORDS
from app.services.classifier import classify_article
from app.services.sentiment import compute_enhanced_sentiment

router = APIRouter()

@router.get("/news")
async def news():
    return await get_market_news()

@router.get("/news-filtered")
async def news_filtered():
    raw_news = await get_market_news()
    articles = extract_headline_summary(raw_news)

    filtered_articles = []

    for article in articles:

        filtered_headline = " ".join(
            word for word in article["headline"].split()
            if word.lower() not in STOPWORDS
        )

        filtered_summary = " ".join(
            word for word in article["summary"].split()
            if word.lower() not in STOPWORDS
        )

        text = filtered_headline + " " + filtered_summary

        classification = classify_article(text)

        sentiment_score = float(compute_enhanced_sentiment(text, classification))

        filtered_articles.append({
            "headline": filtered_headline,
            "summary": filtered_summary,
            "classification": classification,
            "sentiment": sentiment_score
        })

    return filtered_articles