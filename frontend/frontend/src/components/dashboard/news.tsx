"use client";
import React, { useEffect, useState } from "react";
import { getNews } from "./api";

interface NewsArticle {
  headline: string;
  summary: string;
  sentiment: number;
  classification: Record<string, boolean>;
}

export const News = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNews() {
      try {
        const data = await getNews();
        setArticles(data);
      } catch (err) {
        console.error("Failed to fetch news:", err);
        setError("Failed to load news.");
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  if (loading) return <div className="text-sm text-stone-500 p-2">Loading news...</div>;
  if (error) return <div className="text-sm text-red-500 p-2">{error}</div>;
  if (!articles.length) return <div className="text-sm text-stone-500 p-2">No articles found.</div>;

  return (
    <div className="h-full overflow-y-auto">
  <div className="pb-4">
    <table className="w-full table-auto">
      <TableHead />
      <tbody>
        {articles.map((article, i) => (
          <TableRow key={i} order={i} headline={article.headline} summary={article.summary} sentiment={article.sentiment} />
        ))}
      </tbody>
    </table>
  </div>
</div>
  );
};

const TableHead = () => {
  return (
    <thead>
      <tr className="text-sm font-normal text-stone-500">
        <th className="text-start p-1.5">Headline</th>
        <th className="text-start p-1.5">Summary</th>
        <th className="text-start p-1.5">Sentiment</th>
      </tr>
    </thead>
  );
};

const TableRow = ({
  headline,
  summary,
  sentiment,
  order,
}: {
  headline: string;
  summary: string;
  sentiment: number;
  order: number;
}) => {
  const sentimentColor =
    sentiment > 0.2 ? "text-green-600" : sentiment < -0.2 ? "text-red-500" : "text-stone-500";

  return (
    <tr className={order % 2 ? "bg-stone-100 text-sm" : "text-sm"}>
      <td className="p-1.5 font-medium">{headline}</td>
      <td className="p-1.5 text-stone-600">{summary}</td>
      <td className={`p-1.5 font-semibold ${sentimentColor}`}>
        {sentiment > 0 ? "+" : ""}{sentiment.toFixed(2)}
      </td>
    </tr>
  );
};