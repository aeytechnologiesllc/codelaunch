"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Users, Settings, Rocket, LogOut, ChevronLeft, ChevronRight, Shield,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/portal/login");
        return;
      }

      // Check admin status
      const { data } = await supabase
        .from("admin_users")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!data) {
        // Not admin — check if first user (no admins exist)
        const { data: anyAdmin } = await supabase
          .from("admin_users")
          .select("id")
          .limit(1);

        if (!anyAdmin || anyAdmin.length === 0) {
          // First user — make them admin
          await supabase.from("admin_users").insert({
            user_id: user.id,
            email: user.email,
          });
          setIsAdmin(true);
        } else {
          // Not admin, admins exist — redirect to dashboard
          router.push("/dashboard");
          return;
        }
      } else {
        setIsAdmin(true);
      }

      setUserName(user.user_metadata?.full_name || user.email?.split("@")[0] || "Admin");
      setAuthChecked(true);
    };
    check();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-8 h-8 text-accent mx-auto mb-3" />
          <p className="text-text-muted text-sm">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary flex">
      <aside className={`hidden md:flex flex-col border-r border-border bg-bg-secondary transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}>
        <div className="h-16 flex items-center px-4 border-b border-border">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-red-400" />
            </div>
            {!collapsed && <span className="text-sm font-bold tracking-tight">Admin <span className="text-red-400">Panel</span></span>}
          </Link>
        </div>

        <nav className="flex-1 py-4 px-2 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${isActive ? "bg-accent/10 text-accent font-medium" : "text-text-secondary hover:text-text-primary hover:bg-white/[0.03]"} ${collapsed ? "justify-center" : ""}`}>
                <item.icon className="w-4.5 h-4.5 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-border mt-2">
            <Link href="/dashboard" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-text-muted hover:text-text-primary hover:bg-white/[0.03] ${collapsed ? "justify-center" : ""}`}>
              <Rocket className="w-4.5 h-4.5 flex-shrink-0" />
              {!collapsed && <span>Client View</span>}
            </Link>
          </div>
        </nav>

        <div className="p-3 border-t border-border">
          {!collapsed && <div className="px-2 py-2 text-sm font-medium truncate">{userName}</div>}
          <button onClick={handleSignOut} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-text-muted hover:text-red-400 hover:bg-red-400/5 transition-all w-full ${collapsed ? "justify-center" : ""}`}>
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>

        <button onClick={() => setCollapsed(!collapsed)} className="h-10 flex items-center justify-center border-t border-border text-text-muted hover:text-text-primary transition-colors">
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 border-b border-border bg-bg-secondary/50">
          <div className="flex items-center gap-3">
            <div className="md:hidden w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
              <Shield className="w-4 h-4 text-red-400" />
            </div>
            <h1 className="text-sm font-semibold">Admin Panel</h1>
          </div>
          <button onClick={handleSignOut} className="w-8 h-8 rounded-lg bg-white/[0.03] border border-border flex items-center justify-center text-text-muted hover:text-red-400 transition-colors" title="Sign Out">
            <LogOut className="w-4 h-4" />
          </button>
        </header>
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
