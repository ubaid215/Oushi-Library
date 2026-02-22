"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface BookStatusCount {
  status: string;
  _count: { status: number };
}

interface DashboardChartsProps {
  booksByStatus: BookStatusCount[];
}

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "#d6d3cf",
  REVIEW: "#caa660",
  PUBLISHED: "#72a072",
  ARCHIVED: "#e4a285",
};

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Draft",
  REVIEW: "In Review",
  PUBLISHED: "Published",
  ARCHIVED: "Archived",
};

// Mock monthly data — replace with real DB queries in production
const monthlyData = [
  { month: "Aug", downloads: 120, views: 540 },
  { month: "Sep", downloads: 185, views: 720 },
  { month: "Oct", downloads: 240, views: 890 },
  { month: "Nov", downloads: 310, views: 1100 },
  { month: "Dec", downloads: 280, views: 960 },
  { month: "Jan", downloads: 420, views: 1380 },
  { month: "Feb", downloads: 390, views: 1240 },
];

export default function DashboardCharts({ booksByStatus }: DashboardChartsProps) {
  const pieData = booksByStatus.map((item) => ({
    name: STATUS_LABELS[item.status] ?? item.status,
    value: item._count.status,
    color: STATUS_COLORS[item.status] ?? "#b5afd0",
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Monthly Activity */}
      <div className="card">
        <div className="card__header">
          <div>
            <p
              style={{
                fontSize: "var(--text-xs)",
                fontWeight: 600,
                letterSpacing: "var(--tracking-widest)",
                textTransform: "uppercase",
                color: "var(--color-text-tertiary)",
              }}
            >
              Trends
            </p>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-lg)",
                color: "var(--color-text-primary)",
                marginTop: "var(--space-1)",
              }}
            >
              Monthly Activity
            </h3>
          </div>
        </div>
        <div className="card__body">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={monthlyData}
              margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border-subtle)"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "var(--color-text-tertiary)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--color-text-tertiary)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border-subtle)",
                  borderRadius: "var(--radius-lg)",
                  fontSize: "12px",
                  boxShadow: "var(--shadow-md)",
                }}
                cursor={{ fill: "var(--color-parchment-100)" }}
              />
              <Bar
                dataKey="downloads"
                name="Downloads"
                fill="var(--color-dusty-400)"
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
              />
              <Bar
                dataKey="views"
                name="Views"
                fill="var(--color-sage-300)"
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", gap: "var(--space-6)", justifyContent: "center", marginTop: "var(--space-4)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: "var(--color-dusty-400)" }} />
              <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>Downloads</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: "var(--color-sage-300)" }} />
              <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>Views</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Status */}
      <div className="card">
        <div className="card__header">
          <div>
            <p
              style={{
                fontSize: "var(--text-xs)",
                fontWeight: 600,
                letterSpacing: "var(--tracking-widest)",
                textTransform: "uppercase",
                color: "var(--color-text-tertiary)",
              }}
            >
              Books
            </p>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-lg)",
                color: "var(--color-text-primary)",
                marginTop: "var(--space-1)",
              }}
            >
              Status Breakdown
            </h3>
          </div>
        </div>
        <div className="card__body">
          {pieData.length === 0 ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 220,
                color: "var(--color-text-tertiary)",
                fontSize: "var(--text-sm)",
              }}
            >
              No data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border-subtle)",
                    borderRadius: "var(--radius-lg)",
                    fontSize: "12px",
                    boxShadow: "var(--shadow-md)",
                  }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => (
                    <span style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
