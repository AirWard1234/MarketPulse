from app.config import (
    TECH_COMPANIES,
    SEMICONDUCTOR_COMPANIES,
    FINANCE_COMPANIES,
    ENERGY_COMPANIES,
    DEFENSE_COMPANIES,
    COMMODITIES,
    MACRO_ENTITIES,
    MONETARY_POLICY,
    ECONOMIC_INDICATORS,
    GEOPOLITICAL_ENTITIES,
    GEOPOLITICAL_RISK,
    SUPPLY_SHOCK_TERMS,
    SAFE_HAVENS
)


def find_match(text: str, keywords: set):
    """Return first matching keyword if found."""
    for keyword in keywords:
        if keyword in text:
            return keyword
    return None


def classify_article(text: str) -> dict:
    text_lower = text.lower()

    result = {
        "equity": None,
        "sector": None,
        "commodity": None,
        "macro": None,
        "risk": None
    }

    company = find_match(text_lower, TECH_COMPANIES)
    if company:
        result["equity"] = company
        result["sector"] = "tech"

    company = find_match(text_lower, SEMICONDUCTOR_COMPANIES)
    if company:
        result["equity"] = company
        result["sector"] = "semiconductors"

    company = find_match(text_lower, FINANCE_COMPANIES)
    if company:
        result["equity"] = company
        result["sector"] = "financials"

    company = find_match(text_lower, ENERGY_COMPANIES)
    if company:
        result["equity"] = company
        result["sector"] = "energy"

    company = find_match(text_lower, DEFENSE_COMPANIES)
    if company:
        result["equity"] = company
        result["sector"] = "defense"

    commodity = find_match(text_lower, COMMODITIES)
    if commodity:
        result["commodity"] = commodity

    if find_match(text_lower, SUPPLY_SHOCK_TERMS):
        result["risk"] = "supply_shock"

    if find_match(text_lower, MACRO_ENTITIES):
        result["macro"] = "central_bank"

    if find_match(text_lower, MONETARY_POLICY):
        result["macro"] = "monetary_policy"

    if find_match(text_lower, ECONOMIC_INDICATORS):
        result["macro"] = "economic_data"

    if find_match(text_lower, GEOPOLITICAL_ENTITIES):
        result["macro"] = "geopolitics"

    if find_match(text_lower, GEOPOLITICAL_RISK):
        result["risk"] = "geopolitical_risk"

    if find_match(text_lower, SAFE_HAVENS):
        result["risk"] = "risk_off"

    return result