"use client";

import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

export type ContentPostRow = {
  id: string;
  publishedAt: string;
  topic: string;
  hook: string;
  format: string;
  composite: number;
  views: number;
  engagementRate: number;
};

type Props = { rows: ContentPostRow[] };

export function ContentPostsTable({ rows }: Props) {
  const [q, setQ] = useState("");
  const [topic, setTopic] = useState<string>("all");
  const [formatFilter, setFormatFilter] = useState<string>("all");

  const topics = useMemo(() => {
    const s = new Set(rows.map((r) => r.topic).filter(Boolean));
    return [...s].sort();
  }, [rows]);
  const formats = useMemo(() => {
    const s = new Set(rows.map((r) => r.format).filter(Boolean));
    return [...s].sort();
  }, [rows]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (topic !== "all" && r.topic !== topic) return false;
      if (formatFilter !== "all" && r.format !== formatFilter) return false;
      if (!needle) return true;
      const hay = `${r.topic} ${r.hook} ${r.format} ${r.id}`.toLowerCase();
      return hay.includes(needle);
    });
  }, [rows, q, topic, formatFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
        <div className="grid gap-2 sm:min-w-[200px]">
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Topic, hook, format…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="grid gap-2 sm:min-w-[160px]">
          <Label>Topic</Label>
          <Select value={topic} onValueChange={(v) => setTopic(v ?? "all")}>
            <SelectTrigger>
              <SelectValue placeholder="All topics" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All topics</SelectItem>
              {topics.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2 sm:min-w-[160px]">
          <Label>Format</Label>
          <Select value={formatFilter} onValueChange={(v) => setFormatFilter(v ?? "all")}>
            <SelectTrigger>
              <SelectValue placeholder="All formats" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All formats</SelectItem>
              {formats.map((f) => (
                <SelectItem key={f} value={f}>
                  {f}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="pb-2 text-sm text-muted-foreground sm:ml-auto">
          Showing {filtered.length} of {rows.length}
        </p>
      </div>

      <div className="overflow-x-auto rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Topic</TableHead>
              <TableHead>Hook</TableHead>
              <TableHead>Format</TableHead>
              <TableHead className="text-right">Score</TableHead>
              <TableHead className="text-right">Views</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                  {format(new Date(r.publishedAt), "MMM d, HH:mm")}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{r.topic || "—"}</Badge>
                </TableCell>
                <TableCell className="max-w-[160px] truncate text-xs">{r.hook}</TableCell>
                <TableCell className="text-xs">{r.format}</TableCell>
                <TableCell className="text-right font-mono text-xs">{r.composite.toFixed(3)}</TableCell>
                <TableCell className="text-right text-xs">
                  {r.views.toLocaleString()}
                  <span className="ml-2 text-muted-foreground">
                    ER {(r.engagementRate * 100).toFixed(2)}%
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {!filtered.length && (
        <p className="py-6 text-center text-sm text-muted-foreground">No posts match filters.</p>
      )}
    </div>
  );
}
