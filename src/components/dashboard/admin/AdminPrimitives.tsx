import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { AdminBreakdownItem, AdminTrafficPoint } from "@/lib/admin-data";

const toneClasses: Record<AdminBreakdownItem["tone"], string> = {
  accent: "text-[#f2c078] bg-[#f2c078]/10 border-[#f2c078]/20",
  cyan: "text-[#83d6ff] bg-[#83d6ff]/10 border-[#83d6ff]/20",
  mint: "text-[#8ae3b4] bg-[#8ae3b4]/10 border-[#8ae3b4]/20",
  amber: "text-[#ffb86c] bg-[#ffb86c]/10 border-[#ffb86c]/20",
  rose: "text-[#ff8f9f] bg-[#ff8f9f]/10 border-[#ff8f9f]/20",
};

const toneStrokes: Record<AdminBreakdownItem["tone"], string> = {
  accent: "#f2c078",
  cyan: "#83d6ff",
  mint: "#8ae3b4",
  amber: "#ffb86c",
  rose: "#ff8f9f",
};

function chartPath(points: Array<{ x: number; y: number }>) {
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
    .join(" ");
}

export function AdminToneBadge({
  tone,
  children,
}: {
  tone: AdminBreakdownItem["tone"];
  children: React.ReactNode;
}) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${toneClasses[tone]}`}>
      {children}
    </span>
  );
}

export function AdminStatusBadge({ value }: { value?: string | null }) {
  const normalized = (value || "pending").toLowerCase();
  const tone =
    normalized.includes("completed") || normalized.includes("launched")
      ? "mint"
      : normalized.includes("hold") || normalized.includes("cancel")
        ? "rose"
        : normalized.includes("review") || normalized.includes("quote")
          ? "amber"
          : normalized.includes("active") || normalized.includes("develop")
            ? "cyan"
            : "accent";

  const label = value
    ? value
        .split(/[_-]+/)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ")
    : "Pending";

  return <AdminToneBadge tone={tone}>{label}</AdminToneBadge>;
}

export function AdminPageIntro({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_auto] xl:items-end">
      <div className="space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#f2c078]/80">{eyebrow}</p>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">{title}</h1>
          <p className="max-w-3xl text-sm leading-6 text-[#b8bfca] sm:text-[15px]">{description}</p>
        </div>
      </div>
      {actions ? <div className="flex flex-wrap gap-3 xl:justify-end">{actions}</div> : null}
    </div>
  );
}

export function AdminPanel({
  title,
  description,
  action,
  className = "",
  children,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(19,23,30,0.96),rgba(12,15,20,0.96))] shadow-[0_18px_70px_rgba(0,0,0,0.35)] ${className}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/8 px-6 py-5">
        <div>
          <h2 className="text-base font-semibold text-white">{title}</h2>
          {description ? <p className="mt-1 text-sm text-[#8f97a4]">{description}</p> : null}
        </div>
        {action}
      </div>
      <div className="px-6 py-5">{children}</div>
    </section>
  );
}

export function AdminMetricCard({
  label,
  value,
  meta,
  icon: Icon,
  tone = "accent",
}: {
  label: string;
  value: string;
  meta?: string;
  icon: LucideIcon;
  tone?: AdminBreakdownItem["tone"];
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(242,192,120,0.08),transparent_45%),linear-gradient(180deg,rgba(17,20,26,0.98),rgba(10,12,16,0.96))] p-5 shadow-[0_18px_45px_rgba(0,0,0,0.25)]">
      <div className="flex items-start justify-between gap-4">
        <div className={`rounded-2xl border p-3 ${toneClasses[tone]}`}>
          <Icon className="h-4 w-4" />
        </div>
        {meta ? <span className="text-[11px] uppercase tracking-[0.22em] text-[#697281]">{meta}</span> : null}
      </div>
      <div className="mt-8">
        <div className="text-[11px] uppercase tracking-[0.22em] text-[#7f8794]">{label}</div>
        <div className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-white">{value}</div>
      </div>
    </div>
  );
}

export function AdminLineChart({
  data,
  dataKey,
  strokeTone = "accent",
}: {
  data: AdminTrafficPoint[];
  dataKey: "pageViews" | "uniqueVisitors";
  strokeTone?: AdminBreakdownItem["tone"];
}) {
  const width = 560;
  const height = 220;
  const paddingX = 20;
  const paddingY = 18;
  const maxValue = Math.max(...data.map((point) => point[dataKey]), 1);
  const usableWidth = width - paddingX * 2;
  const usableHeight = height - paddingY * 2;

  const points = data.map((point, index) => ({
    x: paddingX + (usableWidth / Math.max(data.length - 1, 1)) * index,
    y: paddingY + usableHeight - (point[dataKey] / maxValue) * usableHeight,
  }));

  const line = chartPath(points);
  const area = `${line} L ${width - paddingX} ${height - paddingY} L ${paddingX} ${height - paddingY} Z`;

  return (
    <div className="space-y-4">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-[220px] w-full overflow-visible">
        {[0.25, 0.5, 0.75, 1].map((ratio) => (
          <line
            key={ratio}
            x1={paddingX}
            x2={width - paddingX}
            y1={paddingY + usableHeight - usableHeight * ratio}
            y2={paddingY + usableHeight - usableHeight * ratio}
            stroke="rgba(255,255,255,0.08)"
            strokeDasharray="3 8"
          />
        ))}
        <path d={area} fill={`url(#area-${dataKey})`} opacity={0.8} />
        <path
          d={line}
          fill="none"
          stroke={toneStrokes[strokeTone]}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((point, index) => (
          <circle
            key={`${point.x}-${point.y}`}
            cx={point.x}
            cy={point.y}
            r={index === points.length - 1 ? 5 : 3.5}
            fill={toneStrokes[strokeTone]}
            stroke="rgba(10,12,16,0.95)"
            strokeWidth="2"
          />
        ))}
        <defs>
          <linearGradient id={`area-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={toneStrokes[strokeTone]} stopOpacity="0.34" />
            <stop offset="100%" stopColor={toneStrokes[strokeTone]} stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      <div className="grid grid-cols-[repeat(7,minmax(0,1fr))] gap-2 text-[11px] uppercase tracking-[0.18em] text-[#697281] sm:grid-cols-[repeat(14,minmax(0,1fr))]">
        {data.map((point) => (
          <div key={point.date} className="truncate">
            {point.label}
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminBreakdownList({
  items,
  compact = false,
}: {
  items: AdminBreakdownItem[];
  compact?: boolean;
}) {
  const maxValue = Math.max(...items.map((item) => item.value), 1);

  return (
    <div className={compact ? "space-y-3" : "space-y-4"}>
      {items.map((item) => (
        <div key={item.label} className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: toneStrokes[item.tone] }}
              />
              <span className="text-sm text-[#c4cad3]">{item.label}</span>
            </div>
            <span className="text-sm font-semibold text-white">{item.value}</span>
          </div>
          <div className="h-2 rounded-full bg-white/6">
            <div
              className="h-full rounded-full"
              style={{
                width: `${(item.value / maxValue) * 100}%`,
                backgroundColor: toneStrokes[item.tone],
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function AdminInsightLink({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-start justify-between gap-4 rounded-[22px] border border-white/8 bg-white/[0.02] px-5 py-4 transition-all hover:border-white/18 hover:bg-white/[0.04]"
    >
      <div>
        <div className="text-sm font-medium text-white">{title}</div>
        <div className="mt-1 text-sm text-[#95a0ae]">{description}</div>
      </div>
      <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-[#f2c078] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </Link>
  );
}

export function AdminEmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[22px] border border-dashed border-white/12 bg-white/[0.02] px-5 py-10 text-center">
      <div className="text-base font-medium text-white">{title}</div>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#8f97a4]">{description}</p>
    </div>
  );
}
