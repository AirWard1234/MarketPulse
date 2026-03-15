from sqlalchemy import Column, Integer, Float, String, DateTime
from datetime import datetime
from app.db.database import Base

class SentimentSnapshot(Base):
    __tablename__ = "sentiment_snapshots"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

    macro = Column(Float)
    tech = Column(Float)
    commodities = Column(Float)