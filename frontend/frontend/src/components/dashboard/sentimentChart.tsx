"use client";
import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from "recharts";

interface ChartDataItem {
  name: string;
  macro: number;
  tech: number;
  commodities: number;
}

async function getSentimentHistory(): Promise<ChartDataItem[]> {
  const res = await fetch("http://127.0.0.1:8000/sentiment-history", { cache: "no-store" });
  if (!res.ok) throw new Error("API failed");
  const data = await res.json();
  return data.map((row: { time: string; macro: number; tech: number; commodities: number }) => ({
    name: new Date(row.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    macro: row.macro,
    tech: row.tech,
    commodities: row.commodities,
  }));
}

const SentimentChart: React.FC = () => {
  const [data, setData] = useState<ChartDataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setError(null);
        const history = await getSentimentHistory();
        setData(history);
      } catch (err) {
        console.error("Error fetching sentiment history:", err);
        setError("Failed to load sentiment data.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading chart...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!data.length) return <div>No data available.</div>;

  return (
    <div className="w-full h-100">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="macro" stroke="#6366f1" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="tech" stroke="#24268f" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="commodities" stroke="#9d9ff5" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SentimentChart;