const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const longDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const compactNumberFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatShortDate(value?: string | null) {
  if (!value) return "Not set";
  return shortDateFormatter.format(new Date(value));
}

export function formatLongDate(value?: string | null) {
  if (!value) return "Not set";
  return longDateFormatter.format(new Date(value));
}

export function formatCurrency(value?: number | null) {
  if (typeof value !== "number") return "$0";
  return currencyFormatter.format(value);
}

export function formatCompactNumber(value?: number | null) {
  if (typeof value !== "number") return "0";
  return compactNumberFormatter.format(value);
}

export function formatFileSize(sizeBytes?: number | null) {
  if (!sizeBytes) return "Unknown size";
  if (sizeBytes < 1024) return `${sizeBytes} B`;
  if (sizeBytes < 1024 * 1024) return `${Math.round(sizeBytes / 1024)} KB`;
  if (sizeBytes < 1024 * 1024 * 1024) {
    return `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${(sizeBytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

export function formatStatusLabel(value?: string | null) {
  if (!value) return "Not set";

  return value
    .split(/[_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function formatRelativeTime(value?: string | null) {
  if (!value) return "Just now";

  const date = new Date(value);
  const diff = date.getTime() - Date.now();
  const minutes = Math.round(diff / (1000 * 60));
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (Math.abs(minutes) < 60) {
    return `${Math.abs(minutes)} min ${minutes >= 0 ? "from now" : "ago"}`;
  }

  if (Math.abs(hours) < 24) {
    return `${Math.abs(hours)} hr ${hours >= 0 ? "from now" : "ago"}`;
  }

  return `${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"} ${days >= 0 ? "from now" : "ago"}`;
}
