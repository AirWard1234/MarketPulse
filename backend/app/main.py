from fastapi import FastAPI
from app.routes import news

app = FastAPI(title="Market Pulse API")

app.include_router(news.router)