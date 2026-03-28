"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, FolderOpen, FileText, MessageSquare, Settings,
  Rocket, ChevronLeft, ChevronRight, LogOut, Bell, User,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/files", label: "Files & Uploads", icon: FolderOpen },
  { href: "/dashboard/invoices", label: "Invoices", icon: FileText },
  { href: "/dashboard/messages", label: "Messages", icon: MessageSquare },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

// Mock client data
const mockClient = {
  name: "David Barth",
  email: "david@bellarestaurant.com",
  company: "Bella Restaurant",
  initials: "DB",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg-primary flex">
      {/* Sidebar - Desktop */}
      <aside
        className={`hidden md:flex flex-col border-r border-border bg-bg-secondary transition-all duration-300 ${
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
                {mockClient.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{mockClient.name}</div>
                <div className="text-text-muted text-xs truncate">{mockClient.company}</div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent text-xs font-bold">
                {mockClient.initials}
              </div>
            </div>
          )}
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
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 border-b border-border bg-bg-secondary/50 backdrop-blur-sm">
          {/* Mobile menu */}
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
            <button className="w-8 h-8 rounded-lg bg-white/[0.03] border border-border flex items-center justify-center text-text-muted hover:text-text-primary transition-colors relative">
              <Bell className="w-4 h-4" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full border-2 border-bg-primary" />
            </button>
            <button className="w-8 h-8 rounded-lg bg-white/[0.03] border border-border flex items-center justify-center text-text-muted hover:text-text-primary transition-colors">
              <User className="w-4 h-4" />
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
            <div className="mt-auto pt-6 border-t border-border">
              <Link href="/" className="flex items-center gap-3 px-4 py-3 text-text-muted">
                <LogOut className="w-5 h-5" /> Back to Website
              </Link>
            </div>
          </div>
        )}

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
