"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, FolderOpen, FileText, MessageSquare, Settings,
  Rocket, ChevronLeft, ChevronRight, LogOut, Bell, User,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/files", label: "Files & Uploads", icon: FolderOpen },
  { href: "/dashboard/invoices", label: "Invoices", icon: FileText },
  { href: "/dashboard/messages", label: "Messages", icon: MessageSquare },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userInitials, setUserInitials] = useState("U");
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // Not authenticated — redirect to login
        router.push("/portal/login");
        return;
      }
      setAuthChecked(true);
      if (user) {
        const name = user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
        setUserName(name);
        setUserEmail(user.email || "");
        const parts = name.split(" ");
        setUserInitials(parts.map((p: string) => p[0]).join("").toUpperCase().slice(0, 2));
      }
    };
    getUser();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  // Show loading while checking auth
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mx-auto mb-3">
            <Rocket className="w-5 h-5 text-accent" />
          </div>
          <p className="text-text-muted text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen dashboard-ambient flex">
      {/* Sidebar - Desktop */}
      <aside
        className={`hidden md:flex flex-col border-r border-border bg-bg-secondary/60 backdrop-blur-xl transition-all duration-300 ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-border">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
              <Rocket className="w-4 h-4 text-accent" />
            </div>
            {!collapsed && (
              <span className="text-sm font-bold tracking-tight">
                Code<span className="text-accent">Launch</span>
              </span>
            )}
          </Link>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 px-2 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  isActive
                    ? "bg-accent/10 text-accent font-medium"
                    : "text-text-secondary hover:text-text-primary hover:bg-white/[0.03]"
                } ${collapsed ? "justify-center" : ""}`}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="w-4.5 h-4.5 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="p-3 border-t border-border">
          {!collapsed ? (
            <div className="flex items-center gap-3 px-2 py-2">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent text-xs font-bold flex-shrink-0">
                {userInitials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{userName || "Loading..."}</div>
                <div className="text-text-muted text-xs truncate">{userEmail}</div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent text-xs font-bold">
                {userInitials}
              </div>
            </div>
          )}

          {/* Sign Out */}
          <button
            onClick={handleSignOut}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-text-muted hover:text-red-400 hover:bg-red-400/5 transition-all w-full mt-1 ${collapsed ? "justify-center" : ""}`}
            title={collapsed ? "Sign Out" : undefined}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="h-10 flex items-center justify-center border-t border-border text-text-muted hover:text-text-primary transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 border-b border-border bg-bg-secondary/40 backdrop-blur-xl">
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="md:hidden flex items-center gap-2 text-text-secondary"
          >
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <Rocket className="w-4 h-4 text-accent" />
            </div>
          </button>

          <div className="hidden md:block">
            <h1 className="text-sm font-semibold">
              {navItems.find((item) => pathname === item.href)?.label || "Dashboard"}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-lg bg-white/[0.03] border border-border flex items-center justify-center text-text-muted hover:text-text-primary transition-colors relative">
              <Bell className="w-4 h-4" />
            </button>
            <button
              onClick={handleSignOut}
              className="w-10 h-10 rounded-lg bg-white/[0.03] border border-border flex items-center justify-center text-text-muted hover:text-red-400 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Mobile nav overlay */}
        {mobileNavOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-bg-primary/95 backdrop-blur-xl flex flex-col p-6">
            <button onClick={() => setMobileNavOpen(false)} className="self-end text-text-muted mb-6">Close</button>
            <nav className="space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileNavOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base ${
                      isActive ? "bg-accent/10 text-accent font-medium" : "text-text-secondary"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="mt-auto pt-6 border-t border-border space-y-2">
              <button onClick={handleSignOut} className="flex items-center gap-3 px-4 py-3 text-red-400 w-full">
                <LogOut className="w-5 h-5" /> Sign Out
              </button>
              <Link href="/" className="flex items-center gap-3 px-4 py-3 text-text-muted">
                Back to Website
              </Link>
            </div>
          </div>
        )}

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto dashboard-grid">
          {children}
        </main>
      </div>
    </div>
  );
}
