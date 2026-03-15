"use client"

import React, { useEffect, useState } from "react"
import { FiChevronsRight, FiTrendingDown, FiTrendingUp } from "react-icons/fi"
import { getSentimentSummary } from "./api"

export const SentimentCards = () => {

  const [data, setData] = useState({
    macro: 0,
    tech: 0,
    commodities: 0
  })

  async function load() {
    try {
      const res = await getSentimentSummary()
      setData(res)
    } catch (err) {
      console.error("API failed", err)
    }
  }

  useEffect(() => {

    load() // first load immediately

    const interval = setInterval(() => {
      load()
    }, 1000000) // refresh every 10 seconds

    return () => clearInterval(interval)

  }, [])

  const getTrend = (score:number) => {
    if (score > 1) return "BULLISH"
    if (score < -1) return "BEARISH"
    return "NEUTRAL"
  }

  return (
    <>
      <Card
        title="Macro Economic Sentiment"
        sentiment={data.macro}
        trend={getTrend(data.macro)}
        period="Last 24 hours"
      />

      <Card
        title="Tech Market Sentiment"
        sentiment={data.tech}
        trend={getTrend(data.tech)}
        period="Last 24 hours"
      />

      <Card
        title="Commodities Sentiment"
        sentiment={data.commodities}
        trend={getTrend(data.commodities)}
        period="Last 24 hours"
      />
    </>
  )
}

const Card = ({
    title,
    sentiment,
    trend,
    period,
} : {
        title: string,
        sentiment: number,
        trend: "BULLISH" | "BEARISH" | "NEUTRAL",
        period: string
}) => {
    return <div className="col-span-4 mt-4 p-4 rounded-xl shadow-sm border border-stone-300">
        <div className="flex mb-8 items-start justify-between">
            <div>
                <h3 className="text-stone-500 mb-2 text-sm font-bold"> {title} </h3>
                <p className='text-3xl font-medium  '>{sentiment.toFixed(2)}</p>
            </div>

            <span className={`text-xs flex items-center gap-1 font-medium px-2 py-1 rounded ${
                trend === "BULLISH" ? "bg-green-100 text-green-700" :
                trend === "BEARISH" ? "bg-red-100 text-red-700" :
                "bg-gray-100 text-gray-700"
            }`}>
                {trend === "BULLISH" ? <FiTrendingUp /> : trend === "BEARISH" ? <FiTrendingDown /> : <FiChevronsRight />}{trend}

            </span>
        </div>
        <span className="text-xs text-stone-500">{period}</span>
    </div>
}