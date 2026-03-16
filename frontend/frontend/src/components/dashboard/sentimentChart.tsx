"use client";

import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

import { getSentimentSummary } from "./api";

interface ChartDataItem {
  name: string;
  macro: number;
  tech: number;
  commodities: number;
}

function generateDummyData(): ChartDataItem[] {
  const data: ChartDataItem[] = [];
  const now = new Date();

  for (let i = 6; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);

    data.push({
      name: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      macro: Math.random() * 2 - 1,
      tech: Math.random() * 2 - 1,
      commodities: Math.random() * 2 - 1
    });
  }

  return data;
}

const SentimentChart: React.FC = () => {
  const [data, setData] = useState<ChartDataItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {

        const sentiment = await getSentimentSummary();

        const now = new Date();
        const generated: ChartDataItem[] = [];

        for (let i = 6; i >= 0; i--) {
          const t = new Date(now.getTime() - i * 60 * 60 * 1000);

          generated.push({
            name: t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            macro: sentiment.macro + (Math.random() - 0.5) * 0.4,
            tech: sentiment.tech + (Math.random() - 0.5) * 0.4,
            commodities: sentiment.commodities + (Math.random() - 0.5) * 0.4
          });
        }

        setData(generated);

      } catch (err) {
        console.error("Error fetching sentiment data:", err);

        // fallback if API fails
        setData(generateDummyData());
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);

  }, []);

  if (loading) return <div>Loading chart...</div>;
  if (!data.length) return <div>No data available.</div>;

  return (
  <div className="w-full h-125">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />

        <Line type="monotone" dataKey="macro" stroke="#6366f1" strokeWidth={2} />
        <Line type="monotone" dataKey="tech" stroke="#24268f" strokeWidth={2} />
        <Line type="monotone" dataKey="commodities" stroke="#9d9ff5" strokeWidth={2} />

      </LineChart>
    </ResponsiveContainer>
  </div>
);
};

export default SentimentChart;