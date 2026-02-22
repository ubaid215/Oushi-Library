"use client";

import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

interface ChartData {
  name: string;
  value: number;
}

interface AnalyticsChartsProps {
  booksByLanguage: ChartData[];
  fatwaByLanguage: ChartData[];
}

const COLORS = [
  "var(--color-dusty-400)",
  "var(--color-sage-400)",
  "var(--color-terracotta-300)",
  "var(--color-parchment-500)",
  "var(--color-dusty-600)",
];

export default function AnalyticsCharts({ booksByLanguage, fatwaByLanguage }: AnalyticsChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="card">
        <div className="card__header">
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-lg)", color: "var(--color-text-primary)" }}>
            Books by Language
          </h3>
        </div>
        <div className="card__body">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={booksByLanguage} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} paddingAngle={3}>
                {booksByLanguage.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "var(--color-surface)", border: "1px solid var(--color-border-subtle)", borderRadius: "var(--radius-lg)", fontSize: 12 }} />
              <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <div className="card__header">
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-lg)", color: "var(--color-text-primary)" }}>
            Fatawa by Language
          </h3>
        </div>
        <div className="card__body">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={fatwaByLanguage} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-subtle)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--color-text-tertiary)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--color-text-tertiary)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "var(--color-surface)", border: "1px solid var(--color-border-subtle)", borderRadius: "var(--radius-lg)", fontSize: 12 }} />
              <Bar dataKey="value" name="Count" fill="var(--color-terracotta-300)" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
