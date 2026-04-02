"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  FileText,
  Files,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  Rocket,
  Settings,
  Shield,
  Users2,
} from "lucide-react";
import { signOut } from "@/lib/auth";
import type { ProfileRecord } from "@/lib/portal-data";

interface DashboardShellProps {
  children: React.ReactNode;
  profile: ProfileRecord;
  isAdmin: boolean;
}

interface NavItem {
  href: string;
  label: string;
  eyebrow: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function DashboardShell({ children, profile, isAdmin }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const navItems = useMemo<NavItem[]>(() => {
    if (isAdmin) {
      return [
        { href: "/dashboard", label: "Command", eyebrow: "Overview", icon: LayoutDashboard },
        { href: "/dashboard/intake", label: "Intake", eyebrow: "Requests", icon: ClipboardList },
        { href: "/dashboard/projects", label: "Projects", eyebrow: "Delivery", icon: FolderKanban },
        { href: "/dashboard/clients", label: "Clients", eyebrow: "Relationships", icon: Users2 },
        { href: "/dashboard/messages", label: "Messages", eyebrow: "Comms", icon: MessageSquareText },
        { href: "/dashboard/files", label: "Files", eyebrow: "Assets", icon: Files },
        { href: "/dashboard/invoices", label: "Invoices", eyebrow: "Billing", icon: FileText },
        { href: "/dashboard/settings", label: "Settings", eyebrow: "Preferences", icon: Settings },
      ];
    }

    return [
      { href: "/dashboard", label: "Overview", eyebrow: "Portal", icon: LayoutDashboard },
      { href: "/dashboard/messages", label: "Messages", eyebrow: "Comms", icon: MessageSquareText },
      { href: "/dashboard/files", label: "Files", eyebrow: "Assets", icon: Files },
      { href: "/dashboard/invoices", label: "Invoices", eyebrow: "Billing", icon: FileText },
      { href: "/dashboard/settings", label: "Settings", eyebrow: "Account", icon: Settings },
    ];
  }, [isAdmin]);

  const activeItem =
    navItems.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`)) ?? navItems[0];

  const initials = (profile.full_name || profile.email || "CL")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut();
    router.push("/");
    router.refresh();
  };

  const shellClassName = isAdmin
    ? "min-h-screen bg-[#07090d] text-white"
    : "min-h-screen bg-bg-primary text-text-primary";

  const asideClassName = isAdmin
    ? "border-r border-white/8 bg-[linear-gradient(180deg,#0f1218_0%,#090c10_100%)]"
    : "border-r border-border bg-bg-secondary";

  const headerClassName = isAdmin
    ? "border-b border-white/8 bg-[rgba(8,10,14,0.82)] backdrop-blur-xl"
    : "border-b border-border bg-bg-secondary/50 backdrop-blur-sm";

  return (
    <div className={shellClassName}>
      {isAdmin ? (
        <>
          <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(242,192,120,0.12),transparent_32%),radial-gradient(circle_at_top_right,rgba(131,214,255,0.12),transparent_34%),linear-gradient(180deg,#06070a_0%,#0a0d12_100%)]" />
          <div className="pointer-events-none fixed inset-y-0 left-[22rem] hidden w-px bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.15),transparent)] xl:block" />
        </>
      ) : null}

      <div className="relative z-10 flex min-h-screen">
        <aside
          className={`hidden md:flex flex-col transition-all duration-300 ${asideClassName} ${
            collapsed ? "w-20" : "w-[19rem]"
          }`}
        >
          <div className="border-b border-white/8 px-5 py-5">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-[linear-gradient(145deg,rgba(242,192,120,0.2),rgba(131,214,255,0.08))] shadow-[0_12px_28px_rgba(0,0,0,0.28)]">
                <Rocket className="h-4.5 w-4.5 text-[#f2c078]" />
              </div>
              {!collapsed ? (
                <div>
                  <div className="text-[11px] uppercase tracking-[0.26em] text-[#7b8491]">
                    {isAdmin ? "Operator Suite" : "Client Portal"}
                  </div>
                  <div className="mt-1 text-base font-semibold tracking-[-0.03em] text-white">
                    Code<span className="text-[#f2c078]">Launch</span>
                  </div>
                </div>
              ) : null}
            </Link>
          </div>

          <div className="flex-1 px-3 py-4">
            {!collapsed ? (
              <div className="mb-4 rounded-[22px] border border-white/8 bg-white/[0.025] px-4 py-4">
                <div className="text-[11px] uppercase tracking-[0.24em] text-[#7d8795]">
                  {isAdmin ? "Admin Workspace" : "Portal Workspace"}
                </div>
                <p className="mt-2 text-sm leading-6 text-[#b8bfca]">
                  {isAdmin
                    ? "Review intake, manage builds, and keep client delivery moving from one control room."
                    : "Track your build, keep the conversation in one place, and stay current on every milestone."}
                </p>
              </div>
            ) : null}

            <nav className="space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex items-center gap-3 rounded-[20px] border px-3 py-3 transition-all ${
                      isActive
                        ? "border-[#f2c078]/25 bg-[linear-gradient(135deg,rgba(242,192,120,0.18),rgba(131,214,255,0.08))] text-white shadow-[0_16px_30px_rgba(0,0,0,0.22)]"
                        : "border-transparent text-[#9ba4b1] hover:border-white/8 hover:bg-white/[0.04] hover:text-white"
                    } ${collapsed ? "justify-center px-2" : ""}`}
                    title={collapsed ? item.label : undefined}
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
                        isActive ? "bg-black/25" : "bg-white/[0.04] group-hover:bg-white/[0.07]"
                      }`}
                    >
                      <item.icon className="h-4.5 w-4.5" />
                    </div>
                    {!collapsed ? (
                      <div className="min-w-0">
                        <div className="text-[11px] uppercase tracking-[0.22em] text-[#7d8795]">
                          {item.eyebrow}
                        </div>
                        <div className="mt-1 truncate text-sm font-medium">{item.label}</div>
                      </div>
                    ) : null}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="border-t border-white/8 px-4 py-4">
            <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-[linear-gradient(145deg,rgba(242,192,120,0.12),rgba(255,255,255,0.04))] text-sm font-semibold text-white">
                {initials}
              </div>
              {!collapsed ? (
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-white">{profile.full_name || "Portal User"}</div>
                  <div className="truncate text-xs text-[#8d96a4]">
                    {isAdmin ? "Operations console" : profile.company_name || "Client workspace"}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <button
            onClick={() => setCollapsed((current) => !current)}
            className="flex h-12 items-center justify-center border-t border-white/8 text-[#7d8795] transition hover:text-white"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className={`sticky top-0 z-20 ${headerClassName}`}>
            <div className="flex h-20 items-center justify-between gap-4 px-4 sm:px-6">
              <button
                onClick={() => setMobileNavOpen((current) => !current)}
                className="md:hidden flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-[#c3cad4]"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#f2c078]/15">
                  <Rocket className="h-4 w-4 text-[#f2c078]" />
                </div>
                Menu
              </button>

              <div className="hidden min-w-0 md:block">
                <div className="text-[11px] uppercase tracking-[0.24em] text-[#7c8592]">
                  {activeItem.eyebrow}
                </div>
                <h1 className="mt-1 text-xl font-semibold tracking-[-0.03em] text-white">
                  {activeItem.label}
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-[#c3cad4] sm:inline-flex">
                  <Shield className="h-3.5 w-3.5 text-[#f2c078]" />
                  {isAdmin ? "Admin control mode" : "Portal communication"}
                </div>
                <button
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-[#d0d6de] transition hover:bg-white/[0.08] hover:text-white disabled:opacity-60"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">{signingOut ? "Signing out..." : "Sign out"}</span>
                </button>
              </div>
            </div>
          </header>

          {mobileNavOpen ? (
            <div className="fixed inset-0 z-50 bg-[rgba(6,7,10,0.94)] p-6 backdrop-blur-xl md:hidden">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.24em] text-[#7d8795]">
                    {isAdmin ? "Operator Suite" : "Portal"}
                  </div>
                  <div className="mt-1 text-lg font-semibold text-white">CodeLaunch</div>
                </div>
                <button onClick={() => setMobileNavOpen(false)} className="text-[#aeb6c1]">
                  Close
                </button>
              </div>

              <nav className="mt-8 space-y-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileNavOpen(false)}
                      className={`flex items-center gap-3 rounded-2xl border px-4 py-4 ${
                        isActive
                          ? "border-[#f2c078]/25 bg-[linear-gradient(135deg,rgba(242,192,120,0.18),rgba(131,214,255,0.08))] text-white"
                          : "border-white/8 bg-white/[0.03] text-[#b7bfca]"
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <div>
                        <div className="text-[11px] uppercase tracking-[0.22em] text-[#7d8795]">{item.eyebrow}</div>
                        <div className="mt-1 text-sm font-medium">{item.label}</div>
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </div>
          ) : null}

          <main className="flex-1 overflow-y-auto px-4 pb-8 pt-6 sm:px-6 lg:px-8">
            <div className={isAdmin ? "mx-auto flex w-full max-w-[1600px] flex-col gap-8" : ""}>{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
