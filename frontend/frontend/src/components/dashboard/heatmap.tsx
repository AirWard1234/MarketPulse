"use client";
import React, { useEffect, useState } from 'react';
import { Treemap, ResponsiveContainer } from 'recharts';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Map your backend categories to market sectors with base sizes
const SECTOR_CONFIG = [
  { name: "Technology",              category: "tech",        baseSize: 42 },
  { name: "Energy",                  category: "commodities", baseSize: 21 },
  { name: "Financials",              category: "macro",       baseSize: 30 },
  { name: "Healthcare",              category: "tech",        baseSize: 18 },
  { name: "Industrials",             category: "macro",       baseSize: 15 },
  { name: "Materials",               category: "commodities", baseSize: 11 },
  { name: "Consumer Discretionary",  category: "tech",        baseSize: 24 },
  { name: "Consumer Staples",        category: "macro",       baseSize: 14 },
  { name: "Utilities",               category: "macro",       baseSize: 8  },
  { name: "Real Estate",             category: "macro",       baseSize: 10 },
  { name: "Telecommunications",      category: "tech",        baseSize: 12 },
];

interface SentimentSummary {
  macro: number;
  tech: number;
  commodities: number;
}

interface SectorData {
  name: string;
  size: number;
  sentiment: number;
  [key: string]: unknown; // ← add this
}

// Sentiment score is roughly -5 to +5 from your FinBERT scaled output
// Map it to a green/red/neutral color
function sentimentToColor(sentiment: number): string {
  const normalized = Math.max(-1, Math.min(1, sentiment / 2));
  const abs = Math.abs(normalized);

  // Interpolate between light (#9d9ff5) and dark (#24268f) based on sentiment strength
  const r = Math.round(157 + (36 - 157) * abs);   // 157 → 36
  const g = Math.round(159 + (38 - 159) * abs);   // 159 → 38
  const b = Math.round(245 + (143 - 245) * abs);  // 245 → 143

  return `rgb(${r},${g},${b})`;
}

// Size: boost or shrink by up to 40% based on absolute sentiment strength
function sentimentToSize(baseSize: number, sentiment: number): number {
  const normalized = Math.max(-1, Math.min(1, sentiment / 2));
  const multiplier = 1 + Math.abs(normalized) * 0.5;
  return Math.round(baseSize * multiplier);
}

interface CustomContentProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  name?: string;
  sentiment?: number;
}

const CustomContent = ({ x = 0, y = 0, width = 0, height = 0, name = '', sentiment = 0 }: CustomContentProps) => {
  const color = sentimentToColor(sentiment);
  const showLabel = width > 60 && height > 30;
  const showSentiment = width > 80 && height > 50;

  return (
    <g>
      <rect
        x={x + 1}
        y={y + 1}
        width={width - 2}
        height={height - 2}
        style={{ fill: color, stroke: '#1a1a2e', strokeWidth: 2, rx: 4 }}
        rx={4}
        ry={4}
      />
      {showLabel && (
        <text
          x={x + width / 2}
          y={y + height / 2 - (showSentiment ? 8 : 0)}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{
            fill: '#ffffff',
            fontSize: Math.min(14, width / 8),
            fontWeight: 600,
            fontFamily: 'Inter, sans-serif',
            textShadow: '0 1px 2px rgba(0,0,0,0.5)',
            pointerEvents: 'none',
          }}
        >
          {name}
        </text>
      )}
      {showSentiment && (
        <text
          x={x + width / 2}
          y={y + height / 2 + 12}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{
            fill: 'rgba(255,255,255,0.85)',
            fontSize: Math.min(12, width / 10),
            fontFamily: 'Inter, sans-serif',
            pointerEvents: 'none',
          }}
        >
          {sentiment > 0 ? '+' : ''}{sentiment.toFixed(2)}
        </text>
      )}
    </g>
  );
};

export const SimpleTreemap = () => {
  const [sentimentData, setSentimentData] = useState<SentimentSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchSentiment = async () => {
    try {
      const res = await fetch(`${API_BASE}/sentiment-summary`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: SentimentSummary = await res.json();
      setSentimentData(data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch sentiment');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSentiment();
    const interval = setInterval(fetchSentiment, 60_000); // refresh every 60s
    return () => clearInterval(interval);
  }, []);

  const treeData = React.useMemo(() => {
    if (!sentimentData) return null;

    const children: SectorData[] = SECTOR_CONFIG.map(({ name, category, baseSize }) => {
      const sentiment = sentimentData[category as keyof SentimentSummary] ?? 0;
      return {
        name,
        size: sentimentToSize(baseSize, sentiment),
        sentiment,
      };
    });

    return [{ name: 'Market', children }];
  }, [sentimentData]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 400, color: '#888' }}>
        Loading sentiment data…
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 400, gap: 12 }}>
        <span style={{ color: '#f44336' }}>Error: {error}</span>
        <button onClick={fetchSentiment} style={{ padding: '8px 16px', borderRadius: 6, border: 'none', background: '#2196f3', color: '#fff', cursor: 'pointer' }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ width: '100%' }}>
      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 12, fontSize: 12, color: '#888', alignItems: 'center' }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
    <div style={{ width: 12, height: 12, borderRadius: 2, background: '#24268f' }} />
    <span>Strong signal</span>
  </div>
  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
    <div style={{ width: 12, height: 12, borderRadius: 2, background: '#9d9ff5' }} />
    <span>Weak signal</span>
  </div>
  {lastUpdated && (
    <span style={{ marginLeft: 'auto' }}>
      Updated {lastUpdated.toLocaleTimeString()}
    </span>
  )}
</div>

      <ResponsiveContainer width="100%" aspect={5 / 4}>
        <Treemap
          data={treeData!}
          dataKey="size"
          aspectRatio={5 / 4}
          content={<CustomContent />}
        />
      </ResponsiveContainer>
    </div>
  );
};

export default SimpleTreemap;