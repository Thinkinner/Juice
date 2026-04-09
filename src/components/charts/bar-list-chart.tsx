"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function BarListChart({
  data,
  dataKey,
}: {
  data: { key: string; avg: number; n: number }[];
  dataKey: string;
}) {
  const chartData = data.map((d) => ({ name: d.key, avg: d.avg, n: d.n }));
  if (!chartData.length) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">No data</div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
        <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
        <Tooltip
          contentStyle={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: 8,
          }}
        />
        <Bar dataKey="avg" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name={dataKey} />
      </BarChart>
    </ResponsiveContainer>
  );
}
