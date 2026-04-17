"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Activity, Eye, TrendingUp, Users } from "lucide-react";

interface PageView {
  id: string;
  path: string;
  referrer: string | null;
  session_id: string | null;
  user_agent: string | null;
  created_at: string;
}

interface TopPage {
  path: string;
  views: number;
}

interface DailyBucket {
  date: string;
  views: number;
}

function formatWhen(iso: string) {
  const d = new Date(iso);
  const diffM = (Date.now() - d.getTime()) / 60000;
  if (diffM < 1) return "just now";
  if (diffM < 60) return `${Math.floor(diffM)}m ago`;
  if (diffM < 60 * 24) return `${Math.floor(diffM / 60)}h ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function referrerHost(ref: string | null) {
  if (!ref) return "direct";
  try {
    return new URL(ref).hostname;
  } catch {
    return ref.slice(0, 30);
  }
}

export default function AdminAnalyticsPage() {
  const [views, setViews] = useState<PageView[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      // Pull last 30 days — enough for trend + recent-visit list
      const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const { data } = await supabase
        .from("page_views")
        .select("*")
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(500);
      setViews((data as PageView[]) || []);
      setLoading(false);
    };
    load();
  }, []);

  // Derive stats
  const now = Date.now();
  const last24h = views.filter((v) => now - new Date(v.created_at).getTime() < 24 * 60 * 60 * 1000);
  const last7d = views.filter((v) => now - new Date(v.created_at).getTime() < 7 * 24 * 60 * 60 * 1000);
  const uniqueSessions30d = new Set(views.map((v) => v.session_id).filter(Boolean)).size;
  const uniqueSessions7d = new Set(last7d.map((v) => v.session_id).filter(Boolean)).size;

  // Top pages (30d)
  const topPages: TopPage[] = Object.entries(
    views.reduce<Record<string, number>>((acc, v) => {
      acc[v.path] = (acc[v.path] || 0) + 1;
      return acc;
    }, {})
  )
    .map(([path, views]) => ({ path, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 8);

  // Top referrers (30d)
  const topReferrers: TopPage[] = Object.entries(
    views.reduce<Record<string, number>>((acc, v) => {
      const host = referrerHost(v.referrer);
      acc[host] = (acc[host] || 0) + 1;
      return acc;
    }, {})
  )
    .map(([path, views]) => ({ path, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 6);

  // Daily buckets for the last 14 days
  const daily: DailyBucket[] = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - (13 - i));
    const next = new Date(d);
    next.setDate(next.getDate() + 1);
    const count = views.filter((v) => {
      const t = new Date(v.created_at).getTime();
      return t >= d.getTime() && t < next.getTime();
    }).length;
    return {
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      views: count,
    };
  });
  const maxDaily = Math.max(1, ...daily.map((d) => d.views));

  const statCards = [
    { label: "Views (24h)", value: last24h.length, icon: Eye, color: "text-accent" },
    { label: "Views (7d)", value: last7d.length, icon: TrendingUp, color: "text-amber-400" },
    { label: "Unique sessions (7d)", value: uniqueSessions7d, icon: Users, color: "text-green-400" },
    { label: "Unique sessions (30d)", value: uniqueSessions30d, icon: Activity, color: "text-blue-400" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold mb-1">Analytics</h1>
        <p className="text-text-muted text-sm">Traffic to codelynch.com — last 30 days.</p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-24 rounded-xl" />)}
        </div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {statCards.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="glass-card p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-text-muted text-[10px] uppercase tracking-wider">{s.label}</span>
                  <s.icon className={`w-4 h-4 ${s.color}`} />
                </div>
                <div className={`text-xl sm:text-2xl font-bold ${s.color}`}>{s.value.toLocaleString()}</div>
              </motion.div>
            ))}
          </div>

          {/* Daily trend */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-5 sm:p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold">Daily views — last 14 days</h2>
              <span className="text-text-muted text-xs">{last7d.length} in the last 7 days</span>
            </div>
            <div className="flex items-end gap-1 h-32">
              {daily.map((d) => (
                <div key={d.date} className="flex-1 flex flex-col items-center gap-1.5 min-w-0">
                  <div className="text-[9px] font-semibold text-text-muted">{d.views || ""}</div>
                  <div
                    className="w-full rounded-t bg-gradient-to-t from-accent/60 to-accent/30 transition-all"
                    style={{ height: `${(d.views / maxDaily) * 100}%`, minHeight: d.views > 0 ? "4px" : "0" }}
                    title={`${d.views} views on ${d.date}`}
                  />
                  <div className="text-[9px] text-text-muted truncate w-full text-center">{d.date}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Top pages + top referrers side by side on desktop */}
          <div className="grid lg:grid-cols-2 gap-5">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="glass-card p-5"
            >
              <h2 className="text-sm font-semibold mb-4">Top pages</h2>
              {topPages.length === 0 ? (
                <p className="text-text-muted text-xs">No page views yet — as visitors land on the site, they&apos;ll show up here.</p>
              ) : (
                <div className="space-y-2.5">
                  {topPages.map((p) => {
                    const pct = topPages[0] ? (p.views / topPages[0].views) * 100 : 0;
                    return (
                      <div key={p.path}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-mono truncate">{p.path}</span>
                          <span className="text-xs text-accent font-semibold flex-shrink-0 ml-2">{p.views}</span>
                        </div>
                        <div className="h-1.5 bg-bg-elevated rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-accent to-accent-hover rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-5"
            >
              <h2 className="text-sm font-semibold mb-4">Top referrers</h2>
              {topReferrers.length === 0 ? (
                <p className="text-text-muted text-xs">Once visitors start clicking in from other sites, we&apos;ll list their sources here.</p>
              ) : (
                <div className="space-y-2.5">
                  {topReferrers.map((r) => (
                    <div key={r.path} className="flex items-center justify-between text-xs">
                      <span className="truncate text-text-secondary">{r.path}</span>
                      <span className="text-accent font-semibold flex-shrink-0 ml-2">{r.views}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Recent visits */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="glass-card overflow-hidden"
          >
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="text-sm font-semibold">Recent visits</h2>
              <span className="text-text-muted text-xs">showing {Math.min(views.length, 50)} of {views.length}</span>
            </div>
            {views.length === 0 ? (
              <div className="p-8 text-center text-text-muted text-sm">
                No visits recorded yet. Browse the site in an incognito window and refresh to see them here.
              </div>
            ) : (
              <div className="divide-y divide-border/40">
                {views.slice(0, 50).map((v) => (
                  <div key={v.id} className="flex items-center gap-3 px-4 py-3 text-xs">
                    <span className="font-mono text-text-secondary flex-1 min-w-0 truncate">{v.path}</span>
                    <span className="hidden sm:inline text-text-muted truncate max-w-[180px]">from {referrerHost(v.referrer)}</span>
                    <span className="text-text-muted flex-shrink-0">{formatWhen(v.created_at)}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </>
      )}
    </div>
  );
}
