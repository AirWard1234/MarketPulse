import os
from dotenv import load_dotenv

load_dotenv()

FINNHUB_API_KEY = os.getenv("FINNHUB_API_KEY")
FINBERT_TOKENIZER =  os.getenv("FINBERT_TOKENIZER")
FINBERT_MODEL = os.getenv("FINBERT_MODEL")

# TEXT CLEANING

STOPWORDS = {
    "the","a","an","and","or","but","if","while","is","are","was","were",
    "be","been","being","to","of","in","on","for","with","at","by","from",
    "about","as","into","like","through","after","over","between","out",
    "against","during","without","before","under","around","among"
}

NEWS_FILLER = {
    "reuters","bloomberg","report","reports","reported","says","said",
    "according","sources","source","update","breaking","exclusive",
    "analysts","analyst","comment","statement","spokesperson"
}

MARKET_FILLER = {
    "markets","market","investors","traders","stocks","shares",
    "sector","global","economy","economic","financial"
}

# SENTIMENT WORDS

POSITIVE_WORDS = {
    "growth","surge","beat","profit","profits","record","rally",
    "bullish","upgrade","strong","expand","expansion","gain",
    "rebound","optimistic","outperform","improvement",
    "stimulus","easing","liquidity"
}

NEGATIVE_WORDS = {
    "loss","losses","decline","drop","plunge","fall","miss",
    "downgrade","weak","slowdown","recession","cut","cuts",
    "layoffs","bankruptcy","risk","crisis","collapse",
    "tightening","inflation surge","rate hike"
}

# COMPANIES

TECH_COMPANIES = {
    "apple","microsoft","amazon","google","alphabet","meta",
    "nvidia","tesla","intel","amd","netflix","salesforce"
}

SEMICONDUCTOR_COMPANIES = {
    "nvidia","amd","intel","tsmc","qualcomm",
    "broadcom","asml"
}

FINANCE_COMPANIES = {
    "jpmorgan","goldman","goldman sachs","morgan stanley",
    "bank of america","citigroup","wells fargo","blackrock",
    "visa","mastercard"
}

ENERGY_COMPANIES = {
    "exxon","exxonmobil","chevron","shell","bp","totalenergies"
}

DEFENSE_COMPANIES = {
    "lockheed","lockheed martin",
    "raytheon","northrop","northrop grumman",
    "boeing","general dynamics"
}

# COMMODITIES

COMMODITIES = {
    "oil","crude","wti","brent",
    "natural gas","lng",
    "gold","silver","platinum","palladium",
    "copper","nickel","aluminum","lithium",
    "wheat","corn","soybeans","coffee","sugar"
}

# CENTRAL BANKS / MACRO INSTITUTIONS

MACRO_ENTITIES = {
    "federal reserve","fed",
    "ecb","european central bank",
    "bank of england","boj","bank of japan",
    "opec",
    "imf","world bank"
}

# MONETARY POLICY

MONETARY_POLICY = {
    "interest rate","rates",
    "rate hike","rate cut",
    "inflation","deflation",
    "cpi","ppi",
    "quantitative easing","qe",
    "tightening","qt",
    "liquidity",
    "bond yields","treasury yields",
    "stimulus",
    "monetary policy"
}

# ECONOMIC INDICATORS

ECONOMIC_INDICATORS = {
    "gdp","employment","unemployment",
    "jobless claims","payrolls",
    "consumer spending",
    "retail sales",
    "industrial production",
    "manufacturing","services",
    "pmi",
    "housing","housing starts","home sales"
}

# GEOPOLITICAL ENTITIES

GEOPOLITICAL_ENTITIES = {
    "united states","us","u.s.","america",
    "china","beijing",
    "russia","moscow",
    "iran","tehran",
    "israel",
    "ukraine",
    "europe","european union","eu",
    "uk","united kingdom","britain",
    "japan","tokyo",
    "india",
    "saudi arabia","saudi",
    "uae","united arab emirates",
    "qatar",
    "turkey",
    "north korea","south korea"
}

# GEOPOLITICAL RISK TERMS

GEOPOLITICAL_RISK = {
    "war","conflict","attack","strike","missile",
    "military","sanctions","retaliation",
    "tensions","ceasefire","invasion",
    "troops","naval","airstrike",
    "blockade","strait","shipping route"
}

# SUPPLY SHOCK / ENERGY EVENTS

SUPPLY_SHOCK_TERMS = {
    "supply disruption","supply cut","production cut",
    "output cut","inventory draw","inventory build",
    "export ban","export restrictions",
    "shipping disruption","pipeline","refinery"
}

# SAFE HAVEN ASSETS

SAFE_HAVENS = {
    "gold","silver",
    "treasuries","us treasuries",
    "yen","japanese yen",
    "swiss franc",
    "vix","volatility"
}