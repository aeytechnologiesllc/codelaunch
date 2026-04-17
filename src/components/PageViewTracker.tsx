"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

// Generate (or reuse) a sessionId per browser session.
// Stored in sessionStorage so it resets when the tab closes.
function getSessionId(): string {
  if (typeof window === "undefined") return "";
  const existing = window.sessionStorage.getItem("cl_session_id");
  if (existing) return existing;
  const id = crypto.randomUUID();
  window.sessionStorage.setItem("cl_session_id", id);
  return id;
}

/**
 * Records a page view in Supabase whenever the pathname changes.
 * Only tracks public marketing routes — skips /dashboard, /admin, /portal, /api.
 */
export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    // Skip internal/auth-gated routes
    if (
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/admin") ||
      pathname.startsWith("/portal") ||
      pathname.startsWith("/api") ||
      pathname.startsWith("/auth")
    ) return;

    const sessionId = getSessionId();
    const referrer = typeof document !== "undefined" ? document.referrer || null : null;
    const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : null;

    // Fire and forget — don't block rendering on the insert
    supabase
      .from("page_views")
      .insert({ path: pathname, referrer, session_id: sessionId, user_agent: userAgent })
      .then(({ error }) => {
        if (error && process.env.NODE_ENV !== "production") {
          // eslint-disable-next-line no-console
          console.warn("[PageViewTracker]", error.message);
        }
      });
  }, [pathname]);

  return null;
}
