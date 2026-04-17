"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import {
  Activity, Eye, TrendingUp, TrendingDown, Users, Globe, Smartphone, Monitor,
  Tablet, Search, Share2, Link2, MousePointer2, ArrowRight, Clock,
  FileText, DollarSign,
} from "lucide-react";

interface PageView {
  id: string;
  path: string;
  referrer: string | null;
  session_id: string | null;
  user_agent: string | null;
  created_at: string;
}

interface Quote {
  id: string;
  total_price: number | string | null;
  created_at: string;
}

type RangeKey = "24h" | "7d" | "30d" | "90d";

const ranges: { key: RangeKey; label: string; hours: number }[] = [
  { key: "24h", label: "24 hours", hours: 24 },
  { key: "7d", label: "7 days", hours: 24 * 7 },
  { key: "30d", label: "30 days", hours: 24 * 30 },
  { key: "90d", label: "90 days", hours: 24 * 90 },
];

// ─── User-agent parsing ─────────────────────────────────────
function parseUA(ua: string | null) {
  const s = (ua || "").toLowerCase();
  if (!s) return { device: "Unknown", browser: "Unknown", os: "Unknown" };

  // Device
  let device: "Mobile" | "Tablet" | "Desktop" = "Desktop";
  if (/ipad|tablet/.test(s)) device = "Tablet";
  else if (/mobile|android|iphone|ipod/.test(s)) device = "Mobile";

  // Browser
  let browser = "Other";
  if (/edg\//.test(s)) browser = "Edge";
  else if (/chrome\//.test(s) && !/edg\//.test(s)) browser = "Chrome";
  else if (/firefox\//.test(s)) browser = "Firefox";
  else if (/safari\//.test(s) && !/chrome/.test(s)) browser = "Safari";
  else if (/opr\//.test(s) || /opera/.test(s)) browser = "Opera";

  // OS
  let os = "Other";
  if (/windows/.test(s)) os = "Windows";
  else if (/iphone|ipad|ipod/.test(s)) os = "iOS";
  else if (/mac os x/.test(s)) os = "macOS";
  else if (/android/.test(s)) os = "Android";
  else if (/linux/.test(s)) os = "Linux";

  return { device, browser, os };
}

// ─── Referrer classification ────────────────────────────────
function classifyReferrer(ref: string | null): {
  category: "Direct" | "Search" | "Social" | "Referral";
  source: string;
} {
  if (!ref) return { category: "Direct", source: "Direct" };
  try {
    const host = new URL(ref).hostname.replace(/^www\./, "");
    if (host.includes("codelynch.com")) return { category: "Direct", source: "Direct" };
    if (/google\.|bing\.|duckduckgo\.|yahoo\.|yandex\./.test(host)) return { category: "Search", source: host };
    if (/twitter\.|t\.co|x\.com|facebook\.|fb\.|linkedin\.|reddit\.|instagram\.|tiktok\.|youtube\.|pinterest\./.test(host))
      return { category: "Social", source: host };
    return { category: "Referral", source: host };
  } catch {
    return { category: "Direct", source: "Unknown" };
  }
}

function relativeTime(iso: string) {
  const d = new Date(iso);
  const diffS = (Date.now() - d.getTime()) / 1000;
  if (diffS < 60) return "just now";
  if (diffS < 3600) return `${Math.floor(diffS / 60)}m ago`;
  if (diffS < 86400) return `${Math.floor(diffS / 3600)}h ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function pct(n: number, total: number) {
  if (!total) return 0;
  return (n / total) * 100;
}

function fmt(n: number) {
  return n.toLocaleString();
}

// ─── Sparkline SVG ──────────────────────────────────────────
function Sparkline({ values, color = "#a78bfa", height = 32 }: { values: number[]; color?: string; height?: number }) {
  if (values.length < 2) return <div style={{ height }} className="opacity-20" />;
  const max = Math.max(...values, 1);
  const w = 100;
  const points = values
    .map((v, i) => `${(i / (values.length - 1)) * w},${height - (v / max) * (height - 2) - 1}`)
    .join(" ");
  const areaPath =
    `M0,${height} ` +
    values
      .map((v, i) => `L${(i / (values.length - 1)) * w},${height - (v / max) * (height - 2) - 1}`)
      .join(" ") +
    ` L${w},${height} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" className="w-full" style={{ height }}>
      <path d={areaPath} fill={color} opacity={0.12} />
      <polyline points={points} fill="none" stroke={color} strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

// ─── Donut SVG ──────────────────────────────────────────────
interface DonutSlice { label: string; value: number; color: string }
function Donut({ slices, size = 140 }: { slices: DonutSlice[]; size?: number }) {
  const total = slices.reduce((a, s) => a + s.value, 0);
  if (!total) {
    return (
      <div className="flex items-center justify-center" style={{ width: size, height: size }}>
        <div className="rounded-full border-[14px] border-bg-elevated" style={{ width: size, height: size }} />
      </div>
    );
  }
  const r = size / 2 - 12;
  const c = 2 * Math.PI * r;
  // Pre-compute cumulative offsets so the render loop stays pure
  const withOffsets = slices.reduce<{ slice: DonutSlice; dash: number; offset: number }[]>((acc, s) => {
    const prev = acc[acc.length - 1];
    const prevEnd = prev ? prev.offset + prev.dash : 0;
    const dash = (s.value / total) * c;
    acc.push({ slice: s, dash, offset: prevEnd });
    return acc;
  }, []);
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={14} />
        {withOffsets.map(({ slice, dash, offset }) => (
          <circle
            key={slice.label}
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={slice.color}
            strokeWidth={14}
            strokeDasharray={`${dash} ${c - dash}`}
            strokeDashoffset={-offset}
            strokeLinecap="butt"
          />
        ))}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-xl font-bold">{fmt(total)}</div>
        <div className="text-[9px] text-text-muted uppercase tracking-wider">total</div>
      </div>
    </div>
  );
}

// ─── Area Chart SVG ─────────────────────────────────────────
interface Bucket { label: string; value: number; date: Date }
function AreaChart({ buckets, color = "#a78bfa", highlight = "#fbbf24" }: { buckets: Bucket[]; color?: string; highlight?: string }) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const max = Math.max(1, ...buckets.map((b) => b.value));
  const w = 1000;
  const h = 180;
  const padX = 10;
  const padY = 12;
  const stepX = (w - padX * 2) / Math.max(1, buckets.length - 1);
  const x = (i: number) => padX + i * stepX;
  const y = (v: number) => padY + (h - padY * 2) * (1 - v / max);

  const linePoints = buckets.map((b, i) => `${x(i)},${y(b.value)}`).join(" ");
  const areaPath =
    `M${padX},${h - padY} ` +
    buckets.map((b, i) => `L${x(i)},${y(b.value)}`).join(" ") +
    ` L${w - padX},${h - padY} Z`;

  const gridLines = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div className="relative w-full" style={{ aspectRatio: `${w} / ${h}` }}>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Grid */}
        {gridLines.map((g) => (
          <line
            key={g}
            x1={padX}
            x2={w - padX}
            y1={padY + (h - padY * 2) * g}
            y2={padY + (h - padY * 2) * g}
            stroke="rgba(255,255,255,0.04)"
            strokeDasharray="2 3"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        <path d={areaPath} fill="url(#areaFill)" />
        <polyline
          points={linePoints}
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        {buckets.map((b, i) => (
          <circle
            key={i}
            cx={x(i)}
            cy={y(b.value)}
            r={hoverIdx === i ? 5 : 0}
            fill={highlight}
            stroke={color}
            strokeWidth={2}
          />
        ))}
        {/* Hover regions */}
        {buckets.map((b, i) => {
          const rectW = stepX;
          return (
            <rect
              key={`hover-${i}`}
              x={x(i) - rectW / 2}
              y={0}
              width={rectW}
              height={h}
              fill="transparent"
              onMouseEnter={() => setHoverIdx(i)}
              onMouseLeave={() => setHoverIdx(null)}
              style={{ cursor: "pointer" }}
            />
          );
        })}
      </svg>
      {/* Tooltip */}
      {hoverIdx != null && (
        <div
          className="absolute pointer-events-none -translate-x-1/2 -translate-y-full text-[11px] bg-bg-elevated border border-border rounded-lg px-2.5 py-1.5 shadow-xl whitespace-nowrap"
          style={{
            left: `${(x(hoverIdx) / w) * 100}%`,
            top: `${(y(buckets[hoverIdx].value) / h) * 100}%`,
            marginTop: -8,
          }}
        >
          <div className="font-semibold">{fmt(buckets[hoverIdx].value)} views</div>
          <div className="text-text-muted">{buckets[hoverIdx].label}</div>
        </div>
      )}
    </div>
  );
}

// ─── Main page ──────────────────────────────────────────────
export default function AdminAnalyticsPage() {
  const [range, setRange] = useState<RangeKey>("7d");
  const [views, setViews] = useState<PageView[]>([]);
  const [prevViews, setPrevViews] = useState<PageView[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loadedAt, setLoadedAt] = useState<number>(0); // frozen "now" for render-pure derivations
  const [loading, setLoading] = useState(true);

  // Reload whenever range changes. Pulls current + previous period for % deltas.
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const hours = ranges.find((r) => r.key === range)!.hours;
      const now = Date.now();
      const start = new Date(now - hours * 3600 * 1000).toISOString();
      const prevStart = new Date(now - 2 * hours * 3600 * 1000).toISOString();

      const [{ data: current }, { data: prior }, { data: q }] = await Promise.all([
        supabase
          .from("page_views")
          .select("*")
          .gte("created_at", start)
          .order("created_at", { ascending: false })
          .limit(5000),
        supabase
          .from("page_views")
          .select("id, path, session_id, created_at")
          .gte("created_at", prevStart)
          .lt("created_at", start)
          .limit(5000),
        supabase
          .from("quotes")
          .select("id, total_price, created_at")
          .gte("created_at", start)
          .order("created_at", { ascending: false }),
      ]);

      setViews((current as PageView[]) || []);
      setPrevViews((prior as PageView[]) || []);
      setQuotes((q as Quote[]) || []);
      setLoadedAt(now);
      setLoading(false);
    };
    load();
  }, [range]);

  // ─── Derive all the metrics ─────────────────────────────
  const m = useMemo(() => {
    const sessions = new Set(views.map((v) => v.session_id).filter(Boolean));
    const prevSessions = new Set(prevViews.map((v) => v.session_id).filter(Boolean));

    // Group views per session for engagement metrics
    const sessionPageCount = new Map<string, number>();
    for (const v of views) {
      if (!v.session_id) continue;
      sessionPageCount.set(v.session_id, (sessionPageCount.get(v.session_id) || 0) + 1);
    }
    const totalSessions = sessionPageCount.size;
    const singlePageSessions = Array.from(sessionPageCount.values()).filter((c) => c === 1).length;
    const bounceRate = totalSessions ? (singlePageSessions / totalSessions) * 100 : 0;
    const avgPagesPerSession =
      totalSessions
        ? Array.from(sessionPageCount.values()).reduce((a, b) => a + b, 0) / totalSessions
        : 0;

    // Conversion metrics
    const pricingSessions = new Set(views.filter((v) => v.path === "/pricing").map((v) => v.session_id).filter(Boolean));
    const convRate = sessions.size ? (quotes.length / sessions.size) * 100 : 0;

    // Revenue
    const totalRevenue = quotes.reduce((s, q) => s + Number(q.total_price || 0), 0);

    // Delta helpers
    const delta = (cur: number, prev: number) => {
      if (!prev && !cur) return 0;
      if (!prev) return 100;
      return ((cur - prev) / prev) * 100;
    };

    // ─── Time bucketing ──────────────────────────
    const hours = ranges.find((r) => r.key === range)!.hours;
    // Bucket by hour if range <= 48h, else by day
    const bucketByHour = hours <= 48;
    const bucketMs = bucketByHour ? 3600 * 1000 : 24 * 3600 * 1000;
    const bucketCount = bucketByHour ? hours : Math.ceil(hours / 24);
    const now = loadedAt || 0;
    const buckets: Bucket[] = Array.from({ length: bucketCount }).map((_, i) => {
      const d = new Date(now - (bucketCount - 1 - i) * bucketMs);
      if (bucketByHour) d.setMinutes(0, 0, 0);
      else d.setHours(0, 0, 0, 0);
      return {
        label: bucketByHour
          ? d.toLocaleTimeString("en-US", { hour: "numeric", hour12: true }) + " · " + d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
          : d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
        date: d,
        value: 0,
      };
    });
    for (const v of views) {
      const t = new Date(v.created_at).getTime();
      const idx = Math.floor((t - (buckets[0]?.date.getTime() || 0)) / bucketMs);
      if (idx >= 0 && idx < buckets.length) buckets[idx].value++;
    }

    // Sparklines (7 mini points for each KPI)
    const sparkCount = 7;
    const sparkMs = (hours / sparkCount) * 3600 * 1000;
    const viewSpark: number[] = Array(sparkCount).fill(0);
    const sessionSpark: number[] = Array(sparkCount).fill(0);
    const sessionsPerBucket: Set<string>[] = Array(sparkCount).fill(0).map(() => new Set());
    for (const v of views) {
      const t = new Date(v.created_at).getTime();
      const bucketStart = now - hours * 3600 * 1000;
      const idx = Math.floor((t - bucketStart) / sparkMs);
      if (idx >= 0 && idx < sparkCount) {
        viewSpark[idx]++;
        if (v.session_id) sessionsPerBucket[idx].add(v.session_id);
      }
    }
    for (let i = 0; i < sparkCount; i++) sessionSpark[i] = sessionsPerBucket[i].size;

    // Hour-of-day heatmap (24 bars)
    const hourHeat = Array(24).fill(0);
    for (const v of views) {
      hourHeat[new Date(v.created_at).getHours()]++;
    }
    const hourMax = Math.max(1, ...hourHeat);

    // Traffic sources
    const sourceCats: Record<string, number> = { Direct: 0, Search: 0, Social: 0, Referral: 0 };
    const referrerList: Record<string, number> = {};
    for (const v of views) {
      const c = classifyReferrer(v.referrer);
      sourceCats[c.category]++;
      if (c.category !== "Direct") {
        referrerList[c.source] = (referrerList[c.source] || 0) + 1;
      }
    }
    const topReferrers = Object.entries(referrerList)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([source, count]) => ({ source, count }));

    // Devices / Browsers / OS
    const devices: Record<string, number> = { Mobile: 0, Desktop: 0, Tablet: 0, Unknown: 0 };
    const browsers: Record<string, number> = {};
    const osList: Record<string, number> = {};
    for (const v of views) {
      const { device, browser, os } = parseUA(v.user_agent);
      devices[device] = (devices[device] || 0) + 1;
      browsers[browser] = (browsers[browser] || 0) + 1;
      osList[os] = (osList[os] || 0) + 1;
    }
    const browsersRanked = Object.entries(browsers).sort((a, b) => b[1] - a[1]);
    const osRanked = Object.entries(osList).sort((a, b) => b[1] - a[1]);

    // Top pages (with unique sessions)
    const pageMap = new Map<string, { views: number; sessions: Set<string> }>();
    for (const v of views) {
      if (!pageMap.has(v.path)) pageMap.set(v.path, { views: 0, sessions: new Set() });
      const entry = pageMap.get(v.path)!;
      entry.views++;
      if (v.session_id) entry.sessions.add(v.session_id);
    }
    const topPages = Array.from(pageMap.entries())
      .map(([path, d]) => ({ path, views: d.views, sessions: d.sessions.size }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    // Entry / exit pages
    const sessionViews = new Map<string, PageView[]>();
    for (const v of views) {
      if (!v.session_id) continue;
      if (!sessionViews.has(v.session_id)) sessionViews.set(v.session_id, []);
      sessionViews.get(v.session_id)!.push(v);
    }
    const entryCount: Record<string, number> = {};
    const exitCount: Record<string, number> = {};
    for (const list of sessionViews.values()) {
      list.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      entryCount[list[0].path] = (entryCount[list[0].path] || 0) + 1;
      exitCount[list[list.length - 1].path] = (exitCount[list[list.length - 1].path] || 0) + 1;
    }
    const entryPages = Object.entries(entryCount).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const exitPages = Object.entries(exitCount).sort((a, b) => b[1] - a[1]).slice(0, 5);

    return {
      views: views.length,
      uniqueSessions: sessions.size,
      prevViews: prevViews.length,
      prevSessions: prevSessions.size,
      totalSessions,
      bounceRate,
      avgPagesPerSession,
      pricingSessions: pricingSessions.size,
      quotes: quotes.length,
      convRate,
      totalRevenue,
      buckets,
      viewSpark,
      sessionSpark,
      hourHeat,
      hourMax,
      sourceCats,
      topReferrers,
      devices,
      browsersRanked,
      osRanked,
      topPages,
      entryPages,
      exitPages,
      delta,
    };
  }, [views, prevViews, quotes, range, loadedAt]);

  // ─── Render ─────────────────────────────────────────────
  const kpis = [
    { label: "Page Views", value: fmt(m.views), delta: m.delta(m.views, m.prevViews), spark: m.viewSpark, icon: Eye, color: "text-accent" },
    { label: "Unique Visitors", value: fmt(m.uniqueSessions), delta: m.delta(m.uniqueSessions, m.prevSessions), spark: m.sessionSpark, icon: Users, color: "text-amber-400" },
    { label: "Quotes Submitted", value: fmt(m.quotes), delta: 0, spark: [], icon: FileText, color: "text-green-400" },
    { label: "Conversion Rate", value: `${m.convRate.toFixed(1)}%`, delta: 0, spark: [], icon: TrendingUp, color: "text-blue-400" },
    { label: "Pages / Session", value: m.avgPagesPerSession.toFixed(1), delta: 0, spark: [], icon: MousePointer2, color: "text-pink-400" },
    { label: "Bounce Rate", value: `${m.bounceRate.toFixed(0)}%`, delta: 0, spark: [], icon: Activity, color: "text-violet-400" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header + range selector */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold mb-1">Analytics</h1>
          <p className="text-text-muted text-sm">Traffic, engagement, and conversions on codelynch.com.</p>
        </div>
        <div className="inline-flex glass-card p-1 gap-1 self-start">
          {ranges.map((r) => (
            <button
              key={r.key}
              onClick={() => setRange(r.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                range === r.key
                  ? "bg-accent/15 text-accent"
                  : "text-text-muted hover:text-text-primary hover:bg-white/[0.03]"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-32 rounded-xl" />)}
        </div>
      ) : (
        <>
          {/* KPI grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {kpis.map((k, i) => {
              const positive = k.delta >= 0;
              return (
                <motion.div
                  key={k.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="glass-card p-4 sm:p-5 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-text-muted text-[10px] sm:text-xs uppercase tracking-wider">{k.label}</span>
                    <k.icon className={`w-4 h-4 ${k.color}`} />
                  </div>
                  <div className={`text-2xl sm:text-3xl font-bold ${k.color} mb-1.5`}>{k.value}</div>
                  <div className="flex items-center justify-between gap-2">
                    {k.delta !== 0 && (
                      <span className={`inline-flex items-center gap-0.5 text-[10px] font-semibold ${positive ? "text-accent" : "text-red-400"}`}>
                        {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {Math.abs(k.delta).toFixed(0)}%
                        <span className="text-text-muted font-normal ml-0.5">vs prev</span>
                      </span>
                    )}
                    {k.spark.length > 0 && (
                      <div className="flex-1 max-w-[80px]">
                        <Sparkline values={k.spark} color="#a78bfa" height={24} />
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Main trend chart */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="glass-card p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold">Views over time</h2>
                <p className="text-text-muted text-xs mt-0.5">Hover the chart to see exact counts.</p>
              </div>
              <span className="text-[10px] text-text-muted uppercase tracking-wider">
                {range === "24h" ? "by hour" : "by day"}
              </span>
            </div>
            <AreaChart buckets={m.buckets} />
          </motion.div>

          {/* Conversion funnel */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-5 sm:p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold">Conversion funnel</h2>
              <span className="text-[10px] text-text-muted uppercase tracking-wider">Visitor → Lead</span>
            </div>
            <div className="space-y-3">
              {(() => {
                const funnel = [
                  { label: "Total visitors", value: m.uniqueSessions, icon: Globe, color: "#a78bfa" },
                  { label: "Viewed pricing page", value: m.pricingSessions, icon: DollarSign, color: "#fbbf24" },
                  { label: "Submitted a quote", value: m.quotes, icon: FileText, color: "#34d399" },
                ];
                const max = Math.max(1, funnel[0].value);
                return funnel.map((f, i) => {
                  const width = (f.value / max) * 100;
                  const prev = i > 0 ? funnel[i - 1].value : null;
                  const conversion = prev ? pct(f.value, prev) : null;
                  return (
                    <div key={f.label}>
                      <div className="flex items-center gap-3 mb-1.5">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${f.color}15` }}>
                          <f.icon className="w-4 h-4" style={{ color: f.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-sm font-medium">{f.label}</span>
                            <div className="flex items-center gap-3">
                              {conversion != null && (
                                <span className="text-xs text-text-muted">
                                  {conversion.toFixed(1)}% converted
                                </span>
                              )}
                              <span className="text-sm font-bold" style={{ color: f.color }}>{fmt(f.value)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="h-2.5 bg-bg-elevated rounded-full overflow-hidden ml-11">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${width}%` }}
                          transition={{ duration: 0.8, ease: "easeOut", delay: i * 0.1 }}
                          className="h-full rounded-full"
                          style={{ background: `linear-gradient(90deg, ${f.color} 0%, ${f.color}99 100%)` }}
                        />
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </motion.div>

          {/* Sources + Devices */}
          <div className="grid lg:grid-cols-2 gap-4">
            {/* Traffic sources */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className="glass-card p-5 sm:p-6">
              <h2 className="text-sm font-semibold mb-4">Traffic sources</h2>
              <div className="flex items-center gap-5 mb-4">
                <Donut
                  slices={[
                    { label: "Direct", value: m.sourceCats.Direct, color: "#a78bfa" },
                    { label: "Search", value: m.sourceCats.Search, color: "#fbbf24" },
                    { label: "Social", value: m.sourceCats.Social, color: "#ec4899" },
                    { label: "Referral", value: m.sourceCats.Referral, color: "#34d399" },
                  ]}
                  size={130}
                />
                <div className="flex-1 space-y-2">
                  {[
                    { label: "Direct", value: m.sourceCats.Direct, icon: Link2, color: "#a78bfa" },
                    { label: "Search", value: m.sourceCats.Search, icon: Search, color: "#fbbf24" },
                    { label: "Social", value: m.sourceCats.Social, icon: Share2, color: "#ec4899" },
                    { label: "Referral", value: m.sourceCats.Referral, icon: Globe, color: "#34d399" },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center gap-2 text-xs">
                      <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                      <s.icon className="w-3 h-3 text-text-muted" />
                      <span className="flex-1">{s.label}</span>
                      <span className="font-semibold">{fmt(s.value)}</span>
                      <span className="text-text-muted">{pct(s.value, m.views).toFixed(0)}%</span>
                    </div>
                  ))}
                </div>
              </div>
              {m.topReferrers.length > 0 && (
                <div className="pt-4 border-t border-border">
                  <h3 className="text-[10px] text-text-muted uppercase tracking-wider mb-2 font-semibold">Top referring sites</h3>
                  <div className="space-y-1.5">
                    {m.topReferrers.map((r) => (
                      <div key={r.source} className="flex items-center justify-between text-xs">
                        <span className="text-text-secondary truncate">{r.source}</span>
                        <span className="text-accent font-semibold flex-shrink-0 ml-2">{fmt(r.count)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Devices + browsers */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }} className="glass-card p-5 sm:p-6">
              <h2 className="text-sm font-semibold mb-4">Devices & browsers</h2>
              <div className="grid grid-cols-3 gap-2 mb-5">
                {[
                  { label: "Desktop", value: m.devices.Desktop || 0, icon: Monitor, color: "#a78bfa" },
                  { label: "Mobile", value: m.devices.Mobile || 0, icon: Smartphone, color: "#fbbf24" },
                  { label: "Tablet", value: m.devices.Tablet || 0, icon: Tablet, color: "#ec4899" },
                ].map((d) => (
                  <div key={d.label} className="glass-card p-3 text-center">
                    <d.icon className="w-5 h-5 mx-auto mb-1.5" style={{ color: d.color }} />
                    <div className="text-lg font-bold">{fmt(d.value)}</div>
                    <div className="text-[10px] text-text-muted">{d.label}</div>
                    <div className="text-[10px] font-semibold" style={{ color: d.color }}>
                      {pct(d.value, m.views).toFixed(0)}%
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-[10px] text-text-muted uppercase tracking-wider mb-2 font-semibold">Browsers</h3>
                  <div className="space-y-1.5">
                    {m.browsersRanked.slice(0, 5).map(([name, count]) => (
                      <div key={name} className="flex items-center justify-between text-xs">
                        <span className="text-text-secondary">{name}</span>
                        <span className="text-accent font-semibold">{fmt(count)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-[10px] text-text-muted uppercase tracking-wider mb-2 font-semibold">OS</h3>
                  <div className="space-y-1.5">
                    {m.osRanked.slice(0, 5).map(([name, count]) => (
                      <div key={name} className="flex items-center justify-between text-xs">
                        <span className="text-text-secondary">{name}</span>
                        <span className="text-accent font-semibold">{fmt(count)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Hour-of-day heatmap + Top pages */}
          <div className="grid lg:grid-cols-2 gap-4">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }} className="glass-card p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold">When visitors come by</h2>
                <span className="text-[10px] text-text-muted uppercase tracking-wider">hour of day</span>
              </div>
              <div className="flex items-end gap-1 h-36">
                {m.hourHeat.map((count, h) => {
                  const intensity = count / m.hourMax;
                  return (
                    <div key={h} className="flex-1 flex flex-col items-center gap-1 min-w-0 group">
                      <div className="text-[8px] text-text-muted opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
                        {count}
                      </div>
                      <div
                        className="w-full rounded-t transition-all"
                        style={{
                          height: `${Math.max(intensity * 100, count > 0 ? 4 : 2)}%`,
                          background: `linear-gradient(180deg, rgba(167,139,250,${0.25 + intensity * 0.6}) 0%, rgba(167,139,250,${0.1 + intensity * 0.3}) 100%)`,
                          minHeight: 4,
                        }}
                        title={`${count} views at ${h}:00`}
                      />
                      {h % 3 === 0 && (
                        <div className="text-[9px] text-text-muted">{h}</div>
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="text-[10px] text-text-muted mt-3">
                Times shown in your browser&apos;s local timezone.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-5 sm:p-6">
              <h2 className="text-sm font-semibold mb-4">Top pages</h2>
              {m.topPages.length === 0 ? (
                <p className="text-text-muted text-xs">Nothing yet — as visitors arrive they&apos;ll show up here.</p>
              ) : (
                <div className="space-y-2">
                  {m.topPages.map((p, i) => {
                    const maxViews = m.topPages[0].views;
                    const w = (p.views / maxViews) * 100;
                    return (
                      <div key={p.path}>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <span className="text-text-muted text-[10px] w-4 text-right">{i + 1}</span>
                            <span className="font-mono truncate">{p.path}</span>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <span className="text-text-muted">{fmt(p.sessions)} <span className="text-[9px]">visitors</span></span>
                            <span className="text-accent font-semibold">{fmt(p.views)}</span>
                          </div>
                        </div>
                        <div className="h-1 bg-bg-elevated rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-accent/70 to-accent/30 rounded-full" style={{ width: `${w}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>

          {/* Entry + Exit pages */}
          <div className="grid lg:grid-cols-2 gap-4">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34 }} className="glass-card p-5 sm:p-6">
              <h2 className="text-sm font-semibold mb-1">Entry pages</h2>
              <p className="text-text-muted text-[11px] mb-4">First page visitors land on.</p>
              {m.entryPages.length === 0 ? (
                <p className="text-text-muted text-xs">—</p>
              ) : (
                <div className="space-y-2">
                  {m.entryPages.map(([path, count]) => (
                    <div key={path} className="flex items-center justify-between text-xs">
                      <span className="font-mono truncate text-text-secondary">{path}</span>
                      <span className="text-accent font-semibold flex-shrink-0 ml-2">{fmt(count)}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }} className="glass-card p-5 sm:p-6">
              <h2 className="text-sm font-semibold mb-1">Exit pages</h2>
              <p className="text-text-muted text-[11px] mb-4">Last page before leaving.</p>
              {m.exitPages.length === 0 ? (
                <p className="text-text-muted text-xs">—</p>
              ) : (
                <div className="space-y-2">
                  {m.exitPages.map(([path, count]) => (
                    <div key={path} className="flex items-center justify-between text-xs">
                      <span className="font-mono truncate text-text-secondary">{path}</span>
                      <span className="text-red-400 font-semibold flex-shrink-0 ml-2">{fmt(count)}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Live activity feed */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }} className="glass-card overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent status-dot-live" />
                <h2 className="text-sm font-semibold">Live activity</h2>
              </div>
              <span className="text-[10px] text-text-muted uppercase tracking-wider">
                last {Math.min(views.length, 30)} of {fmt(views.length)}
              </span>
            </div>
            {views.length === 0 ? (
              <div className="p-8 text-center text-text-muted text-sm">
                No visits recorded in this time range.
              </div>
            ) : (
              <div className="divide-y divide-border/40 max-h-[480px] overflow-y-auto">
                {views.slice(0, 30).map((v) => {
                  const ref = classifyReferrer(v.referrer);
                  const ua = parseUA(v.user_agent);
                  const DeviceIcon = ua.device === "Mobile" ? Smartphone : ua.device === "Tablet" ? Tablet : Monitor;
                  return (
                    <div key={v.id} className="flex items-center gap-3 px-4 py-3 text-xs hover:bg-white/[0.02] transition-colors">
                      <DeviceIcon className="w-3.5 h-3.5 text-text-muted flex-shrink-0" />
                      <span className="font-mono text-text-secondary flex-1 min-w-0 truncate">{v.path}</span>
                      <span className="hidden sm:flex items-center gap-1 text-text-muted truncate max-w-[160px]">
                        <ArrowRight className="w-3 h-3" />
                        {ref.source}
                      </span>
                      <span className="hidden md:inline text-text-muted">{ua.browser} · {ua.os}</span>
                      <span className="text-text-muted flex-shrink-0 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {relativeTime(v.created_at)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </>
      )}
    </div>
  );
}
