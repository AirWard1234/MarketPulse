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
**STOPWORDS** is just a listof Str, with the filler words and classify_article() is just a function from backend/app/services/classifier.py that looks if a specific word is found in the news article that could tie it to a specific classification. 

For example, if the word "oil" is found, it would set the classification to "commodities."
Note that these classifications are within large distinct listof Str. I have a list for: 
1. TECH_COMPANIES,
2. SEMICONDUCTOR_COMPANIES,
3. FINANCE_COMPANIES,
4. ENERGY_COMPANIES,
5. DEFENSE_COMPANIES,
6. COMMODITIES,
7. MACRO_ENTITIES,
8. MONETARY_POLICY,
9. ECONOMIC_INDICATORS,
10. GEOPOLITICAL_ENTITIES,
11. GEOPOLITICAL_RISK,
12. SUPPLY_SHOCK_TERMS,
13. SAFE_HAVENS

- We then take this information and pass it onto varias functions in backend/app/services/sentiment.py
- Without going into too much detail, as this part of the code was well over 200 lines, I will explain the general structure of this code in the **Sentiment.py** section
- Finally, the the scoring gets combined into our get_filtered_news() with the addition of sentiment_score = float(compute_enhanced_sentiment(text, classification)).
- Now the function is constantly called in frontend/frontend/src/components/dashboard/api.tsx and used to display data.


### Sentiment.py
This file is by far the most important and complex part of the project.

We first have a class called FinBertSentimentAnalyzer and initalize it by loading the FinBERT model and tokenizer and setting up the device by checking if the GPU or CPU is available by using:
```python 
self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
```

We also define a label list of ['negative', 'positive', 'neutral'] to interpert the outputs

Then we assign a sentiment score for a given text using FinBERT
- Take the text, thats reduced to 10k characters if needed, and convert it to model inputs using the tokenizer
- Then we generate a confidence score and a sentiment_score then scale the score by 5 to make it easier to interperet:

```python
        neg_prob, neu_prob, pos_prob = probs
        confidence = float(max(probs) - 0.33)
        sentiment_score = float(pos_prob - neg_prob)
        scaled_score = sentiment_score * 5
```

We then also score the following based on relevent key words, like specific geopolicital risk, using get_aspect_sentiment()

Then get a simple scoring based on positive and negative keywords using get_lexicon_score()

There are a few functions that also check for risk, and boost scoring by 5% if our classification includes 'macro' and if the confidence exceeds 0.7

We then compute the general score in compute_sentiment() by calling all the various funcitons mentioned above and adjusting the weighting of the scores based on our rules found in calculate_dynamic_weights(). Our scoring is then called by the get_filtered_news() function, which then is used for our API calls. 

