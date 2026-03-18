## About Project
MarketPulse is a project I developed that provides financial news analysis and sentiment insights. The inspiration for this project came about while working on my Bloomberg certificates at Waterloo's Bloomberg Finance Lab, I found it upsetting that I had no location freedom to access the data the terminals provided.
Therefore, I set out to develop "my own Bloomberg." While not as advanced, this project actually brought insights to my trading.

This program is a FastAPI-based backend that scraped news using Finnhub, with a React front-end.

### General Pipeline: 
- The project starts by calling ```python get_filtered_news()```, found in backend/app/routes/news.py, which fetches raw news ***asynchronously*** via ```python get_market_news()```, which is found in the same file.
  - ```python get_market_news()``` makes an HTTP GET request to Finnhub's API, and returns a list of news articles. Then we extract the headlines and summaries, using the ```python extract_headline_summary()``` function found in backend/app/service/news.py
  - Then we filter the headline and summary to keep only sentiment-driving words.
 
```python
from fastapi import APIRouter
from app.services.finnhub import get_market_news
from app.config import STOPWORDS
from app.services.classifier import classify_article


router = APIRouter()

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
```

Where:
```python

def extract_headline_summary(news_list: List[Dict]) -> List[Dict]:
    return [
        {
            "headline": article["headline"],
            "summary": article["summary"]
        }
        for article in news_list
        if "headline" in article and "summary" in article
    ]
```
STOPWORDS is just a listof Str, with the filler words and classify_article() is just a function from backend/app/services/classifier.py that looks if a specific word is found in the news article that could tie it to a specific classification. For example, if the word "oil" is found, it would set the classification to "commodities."
Note that these classifications are within large distinct listof Str. I have a list for: **TECH_COMPANIES, SEMICONDUCTOR_COMPANIES, FINANCE_COMPANIES, ENERGY_COMPANIES, DEFENSE_COMPANIES, COMMODITIES, MACRO_ENTITIES, MONETARY_POLICY, ECONOMIC_INDICATORS, GEOPOLITICAL_ENTITIES, GEOPOLITICAL_RISK, SUPPLY_SHOCK_TERMS, SAFE_HAVENS**
