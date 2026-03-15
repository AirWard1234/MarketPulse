from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import news
from app.db.database import engine, Base

app = FastAPI(title="Market Pulse API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(news.router)

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)