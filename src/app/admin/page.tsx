"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { ArrowUpRight, Package, DollarSign, Clock, Users } from "lucide-react";

interface Quote {
  id: string;
  quote_number: string;
  client_name: string;
  client_email: string;
  company_name: string;
  project_type: string;
  total_price: number;
  estimated_weeks: number;
  status: string;
  created_at: string;
}

interface Project {
  id: string;
  name: string;
  status: string;
  progress: number;
  quote_id: string;
  milestones: { id: string; title: string; status: string }[];
}

export default function AdminOverview() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: q } = await supabase
        .from("quotes")
        .select("*")
        .order("created_at", { ascending: false });

      const { data: p } = await supabase
        .from("projects")
        .select("*, milestones(*)");

      setQuotes(q || []);
      setProjects(p || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const getProjectForQuote = (quoteId: string) => projects.find((p) => p.quote_id === quoteId);

  const stats = {
    totalQuotes: quotes.length,
    activeProjects: projects.filter((p) => p.status !== "launched").length,
    totalRevenue: quotes.reduce((sum, q) => sum + (q.total_price || 0), 0),
    completedProjects: projects.filter((p) => p.status === "launched").length,
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-text-muted text-sm">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold mb-1">Admin Dashboard</h1>
        <p className="text-text-muted text-sm">Manage quotes, projects, and client milestones.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Quotes", value: stats.totalQuotes, icon: Package, color: "text-accent" },
          { label: "Active Projects", value: stats.activeProjects, icon: Clock, color: "text-amber-400" },
          { label: "Revenue", value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: "text-green-400" },
          { label: "Completed", value: stats.completedProjects, icon: Users, color: "text-blue-400" },
        ].map((stat) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-text-muted text-xs uppercase tracking-wider">{stat.label}</span>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Quotes list */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="text-sm font-semibold">All Quotes</h2>
          <span className="text-text-muted text-xs">{quotes.length} total</span>
        </div>

        {quotes.length === 0 ? (
          <div className="p-8 text-center text-text-muted text-sm">No quotes yet. Clients will appear here after using the pricing calculator.</div>
        ) : (
          <div className="divide-y divide-border/50">
            {quotes.map((quote) => {
              const project = getProjectForQuote(quote.id);
              return (
                <Link
                  key={quote.id}
                  href={`/admin/projects/${quote.id}`}
                  className="flex items-center gap-4 p-4 hover:bg-white/[0.02] transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold group-hover:text-accent transition-colors truncate">{quote.client_name || "Unknown"}</span>
                      <span className="text-text-muted text-[10px] font-mono">{quote.quote_number}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-text-muted">
                      <span>{quote.project_type || "—"}</span>
                      <span>{quote.company_name || "—"}</span>
                      <span>{new Date(quote.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {project ? (
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-bg-elevated rounded-full overflow-hidden">
                          <div className="h-full bg-accent rounded-full" style={{ width: `${project.progress}%` }} />
                        </div>
                        <span className="text-xs text-accent font-medium">{project.progress}%</span>
                      </div>
                    ) : (
                      <span className="px-2 py-0.5 bg-amber-400/10 text-amber-400 rounded text-[10px] font-semibold">New Quote</span>
                    )}

                    <span className="text-sm font-semibold text-accent">${(quote.total_price || 0).toLocaleString()}</span>
                    <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
