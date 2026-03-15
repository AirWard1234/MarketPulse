from fastapi import APIRouter
from app.services.news import concatenate_news_text, extract_headline_summary
from app.services.finnhub import get_market_news
from app.config import STOPWORDS
from app.services.classifier import classify_article
from app.services.sentiment import compute_enhanced_sentiment
from app.db.database import AsyncSessionLocal
from app.db.models import SentimentSnapshot
from sqlalchemy import select
from app.services.news import get_filtered_news

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

@router.get("/sentiment-summary")
async def sentiment_summary():

    articles = await get_filtered_news()

    macro_scores = []
    tech_scores = []
    commodity_scores = []

    for article in articles:
        sentiment = article["sentiment"]
        classification = article["classification"]

        if classification.get("macro"):
            macro_scores.append(sentiment)

        if classification.get("commodity"):
            commodity_scores.append(sentiment)

        if classification.get("equity"):
            tech_scores.append(sentiment)

    def avg(lst):
        return sum(lst) / len(lst) if lst else 0

    macro = avg(macro_scores)
    tech = avg(tech_scores)
    commodities = avg(commodity_scores)

    async with AsyncSessionLocal() as session:
        snapshot = SentimentSnapshot(
            macro=macro,
            tech=tech,
            commodities=commodities
        )
        session.add(snapshot)
        await session.commit()

    return {
        "macro": macro,
        "tech": tech,
        "commodities": commodities,
        
    }

@router.get("/risk")
async def risk():
    articles = await get_filtered_news()
    
    risk_scores = []

    for article in articles:
        sentiment = article["sentiment"]
        classification = article["classification"]

        if classification.get("risk"):
            risk_scores.append(sentiment)

    def avg(lst):
        return sum(lst) / len(lst) if lst else 0

    return {
        "risk": avg(risk_scores),
    }

@router.get("/sentiment-history")
async def sentiment_history():
    
    async with AsyncSessionLocal() as session:
        result = await session.execute(
            select(SentimentSnapshot)
            .order_by(SentimentSnapshot.timestamp)
            .limit(200)
        )

        rows = result.scalars().all()

    return [
        {
            "time": row.timestamp.isoformat(),
            "macro": row.macro,
            "tech": row.tech,
            "commodities": row.commodities,
        }
        for row in rows
        
    ]