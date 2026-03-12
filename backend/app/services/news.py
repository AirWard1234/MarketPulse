from typing import List, Dict


def extract_headline_summary(news_list: List[Dict]) -> List[Dict]:
    return [
        {
            "headline": article["headline"],
            "summary": article["summary"]
        }
        for article in news_list
        if "headline" in article and "summary" in article
    ]


def concatenate_news_text(news_list: List[Dict]) -> List[str]:
    return [
        article["headline"] + " " + article["summary"]
        for article in news_list
    ]