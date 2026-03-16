export async function getSentimentSummary() {

  const res = await fetch(
    "http://127.0.0.1:8000/sentiment-summary",
    { cache: "no-store" }
  )

  if (!res.ok) {
    throw new Error("API failed")
  }

  return res.json()
}

export async function getRisk() {

  const res = await fetch("http://127.0.0.1:8000/risk", { cache: "no-store" })

  if (!res.ok) {
    throw new Error("API failed")
  }

  return res.json()
}