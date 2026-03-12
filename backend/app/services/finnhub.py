import httpx
from app.config import FINNHUB_API_KEY

BASE_URL = "https://finnhub.io/api/v1"

async def get_market_news():
    url = f"{BASE_URL}/news?category=general&token={FINNHUB_API_KEY}"

    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        return response.json()