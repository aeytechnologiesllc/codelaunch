"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const STORAGE_KEY = "codelaunch-analytics-session";

function getSessionId() {
  const existing = window.localStorage.getItem(STORAGE_KEY);
  if (existing) return existing;

  const created = crypto.randomUUID();
  window.localStorage.setItem(STORAGE_KEY, created);
  return created;
}

export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    const payload = {
      path: pathname,
      referrer: document.referrer || null,
      sessionId: getSessionId(),
    };

    void fetch("/api/analytics/page-view", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  }, [pathname]);

  return null;
}
