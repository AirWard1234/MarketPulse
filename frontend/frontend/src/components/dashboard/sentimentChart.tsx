"use client";

import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import axios from "axios";

interface RawItem {
  [key: string]: any;
}

interface ChartDataItem {
  name: string;
  [key: string]: number | string;
}

function generateDummyData(): ChartDataItem[] {
  const keys = ["macro", "tech", "commodities"];
  const data: ChartDataItem[] = [];
  const now = new Date();

  for (let i = 6; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    const item: ChartDataItem = { name: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
    keys.forEach((k) => (item[k] = Math.random() * 2 - 1));
    data.push(item);
  }

  return data;
}

// ✅ Exported chart component
const SentimentChart: React.FC = () => {
  const [data, setData] = useState<ChartDataItem[]>([]);
  const [fields, setFields] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(".api.tsx");
        const rawData: RawItem[] = Array.isArray(res.data) ? res.data : res.data.data || [];

        if (!rawData.length) {
          const dummy = generateDummyData();
          setFields(Object.keys(dummy[0]).filter((k) => k !== "name"));
          setData(dummy);
        } else {
          const allKeys = new Set<string>();
          rawData.forEach((item) => Object.keys(item).forEach((k) => allKeys.add(k)));
          allKeys.delete("timestamp");

          const chartData: ChartDataItem[] = rawData.map((item: RawItem) => {
            const newItem: ChartDataItem = {
              name: item.timestamp
                ? new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                : "",
            };
            allKeys.forEach((key) => (newItem[key] = item[key] ?? 0));
            return newItem;
          });

          setFields(Array.from(allKeys));
          setData(chartData);
        }
      } catch (err) {
        console.error("Error fetching sentiment data:", err);
        const dummy = generateDummyData();
        setFields(Object.keys(dummy[0]).filter((k) => k !== "name"));
        setData(dummy);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 300_000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading chart...</div>;
  if (!data.length) return <div>No data available.</div>;

  return (
    <LineChart
      style={{ width: "100%", maxWidth: "900px", height: "100%", maxHeight: "70vh" }}
      data={data}
      margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-3)" />
      <XAxis dataKey="name" stroke="var(--color-text-3)" />
      <YAxis stroke="var(--color-text-3)" />
      <Tooltip
        cursor={{ stroke: "var(--color-border-2)" }}
        contentStyle={{
          backgroundColor: "var(--color-surface-raised)",
          borderColor: "var(--color-border-2)",
        }}
      />
      <Legend />
      {fields.map((key, idx) => (
        <Line
          key={key}
          type="monotone"
          dataKey={key}
          stroke={`var(--color-chart-${idx + 1})`}
          dot={{ fill: "var(--color-surface-base)" }}
          activeDot={{ r: 8 }}
        />
      ))}
    </LineChart>
  );
};

// ✅ Default export so you can import it anywhere
export default SentimentChart;