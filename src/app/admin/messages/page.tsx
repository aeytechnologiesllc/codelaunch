"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Send, Loader2, Inbox, ArrowLeft, Circle } from "lucide-react";

interface ProjectRow {
  id: string;
  name: string;
  client_name: string | null;
  client_email: string | null;
  status: string;
  last_message_at: string | null;
  last_message_preview: string | null;
  unread_count: number;
}

interface Message {
  id: string;
  project_id: string;
  sender_profile_id: string | null;
  sender_name: string;
  body: string;
  created_at: string;
}

function formatWhen(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  const now = new Date();
  const diffH = (now.getTime() - d.getTime()) / 36e5;
  if (diffH < 24) return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  if (diffH < 24 * 7) return d.toLocaleDateString("en-US", { weekday: "short" });
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function initials(name: string) {
  return name.split(/\s+/).map((p) => p[0]).filter(Boolean).join("").slice(0, 2).toUpperCase();
}

export default function AdminMessagesPage() {
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<ProjectRow | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [adminId, setAdminId] = useState<string | null>(null);
  const [adminName, setAdminName] = useState("CodeLaunch");
  const listEndRef = useRef<HTMLDivElement>(null);

  // Load admin identity + project list with message counts
  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      setAdminId(user.id);
      const { data: prof } = await supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle();
      if (prof?.full_name) setAdminName(prof.full_name);

      // Pull all projects + their latest message
      const { data: projRows } = await supabase
        .from("projects")
        .select("id, name, client_name, client_email, status, created_at")
        .order("created_at", { ascending: false });

      if (!projRows) { setLoading(false); return; }

      // For each project, fetch the latest message + unread count
      const enriched: ProjectRow[] = await Promise.all(
        projRows.map(async (p): Promise<ProjectRow> => {
          const { data: latest } = await supabase
            .from("project_messages")
            .select("body, created_at, sender_profile_id")
            .eq("project_id", p.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();
          const { count } = await supabase
            .from("project_messages")
            .select("id", { count: "exact", head: true })
            .eq("project_id", p.id);
          return {
            id: p.id,
            name: p.name,
            client_name: p.client_name,
            client_email: p.client_email,
            status: p.status,
            last_message_at: latest?.created_at || null,
            last_message_preview: latest?.body?.slice(0, 80) || null,
            unread_count: count || 0,
          };
        })
      );

      // Sort: projects with messages first, then by last message time desc
      enriched.sort((a, b) => {
        if (a.last_message_at && !b.last_message_at) return -1;
        if (!a.last_message_at && b.last_message_at) return 1;
        if (a.last_message_at && b.last_message_at)
          return new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime();
        return 0;
      });
      setProjects(enriched);
      setLoading(false);
    };
    init();
  }, []);

  const loadMessages = useCallback(async (pid: string) => {
    const { data } = await supabase
      .from("project_messages")
      .select("*")
      .eq("project_id", pid)
      .order("created_at", { ascending: true });
    if (data) setMessages(data as Message[]);
  }, []);

  // When a project is selected, load messages + subscribe to realtime
  useEffect(() => {
    if (!selectedProject) return;
    loadMessages(selectedProject.id);
    const channel = supabase
      .channel(`admin-msg-${selectedProject.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "project_messages", filter: `project_id=eq.${selectedProject.id}` },
        (payload) => {
          setMessages((prev) => {
            if (prev.some((m) => m.id === (payload.new as Message).id)) return prev;
            return [...prev, payload.new as Message];
          });
          requestAnimationFrame(() => listEndRef.current?.scrollIntoView({ behavior: "smooth" }));
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [selectedProject, loadMessages]);

  useEffect(() => {
    requestAnimationFrame(() => listEndRef.current?.scrollIntoView({ behavior: "smooth" }));
  }, [messages.length]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = draft.trim();
    if (!text || !selectedProject || !adminId || sending) return;
    setSending(true);
    const { error } = await supabase.from("project_messages").insert({
      project_id: selectedProject.id,
      sender_profile_id: adminId,
      sender_name: `${adminName} (CodeLaunch)`,
      body: text,
    });
    if (!error) {
      setDraft("");
      await loadMessages(selectedProject.id);
    }
    setSending(false);
  };

  // ─── Conversation detail view ───
  if (selectedProject) {
    return (
      <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-9rem)]">
        <div className="flex items-center gap-3 pb-4 border-b border-border mb-4">
          <button
            onClick={() => setSelectedProject(null)}
            className="w-9 h-9 rounded-lg bg-white/[0.03] border border-border flex items-center justify-center hover:bg-white/[0.06]"
            aria-label="Back to inbox"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold truncate">{selectedProject.name}</h1>
              <span className="text-[10px] px-1.5 py-0.5 bg-accent/10 text-accent rounded font-semibold capitalize">
                {selectedProject.status}
              </span>
            </div>
            <p className="text-text-muted text-xs">
              {selectedProject.client_name || "—"} · {selectedProject.client_email || "—"}
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 pb-4">
          {messages.length === 0 ? (
            <div className="text-center py-12 text-text-muted text-sm">
              No messages in this project yet. Send the first one below.
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence initial={false}>
                {messages.map((m) => {
                  const isMine = m.sender_profile_id === adminId;
                  return (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${isMine ? "flex-row-reverse" : ""}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        isMine ? "bg-red-500/10 text-red-400" : "bg-accent/10 text-accent"
                      }`}>
                        {initials(m.sender_name || "?")}
                      </div>
                      <div className={`max-w-[85%] ${isMine ? "text-right" : ""}`}>
                        <div className={`glass-card p-3.5 ${isMine ? "bg-red-500/5 border-red-500/10" : ""}`}>
                          <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap break-words text-left">{m.body}</p>
                        </div>
                        <div className="text-[10px] text-text-muted mt-1 px-1">
                          {isMine ? "You" : m.sender_name} · {formatWhen(m.created_at)}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              <div ref={listEndRef} />
            </div>
          )}
        </div>

        <form onSubmit={handleSend} className="glass-card p-3 flex items-center gap-3 flex-shrink-0">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Reply as CodeLaunch…"
            disabled={sending}
            className="flex-1 bg-transparent text-sm focus:outline-none px-2 placeholder:text-text-muted"
          />
          <button
            type="submit"
            disabled={!draft.trim() || sending}
            className="w-9 h-9 rounded-lg bg-cta flex items-center justify-center hover:bg-cta-hover transition-colors disabled:opacity-40"
            aria-label="Send"
          >
            {sending ? <Loader2 className="w-4 h-4 text-cta-text animate-spin" /> : <Send className="w-4 h-4 text-cta-text" />}
          </button>
        </form>
      </div>
    );
  }

  // ─── Inbox list view ───
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold mb-1">Messages</h1>
        <p className="text-text-muted text-sm">Every client conversation across every project.</p>
      </motion.div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="skeleton h-16 rounded-xl" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="glass-card py-16 px-6 text-center">
          <Inbox className="w-10 h-10 text-accent/60 mx-auto mb-3" />
          <h3 className="text-sm font-semibold mb-1">No projects yet</h3>
          <p className="text-text-muted text-xs">Once clients submit quotes, their conversations show up here.</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden divide-y divide-border/50">
          {projects.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedProject(p)}
              className="w-full flex items-center gap-4 p-4 hover:bg-white/[0.02] transition-colors text-left group"
            >
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-sm flex-shrink-0">
                {initials(p.client_name || p.name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-semibold truncate group-hover:text-accent transition-colors">{p.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-white/[0.03] text-text-muted rounded capitalize">{p.status}</span>
                </div>
                <p className="text-xs text-text-muted truncate">
                  {p.last_message_preview || (
                    <span className="italic">No messages yet — {p.client_email || "client"}</span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {p.unread_count > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-accent/15 text-accent text-[10px] font-bold">
                    {p.unread_count}
                  </span>
                )}
                {p.last_message_at && (
                  <div className="flex items-center gap-1 text-[10px] text-text-muted">
                    <Circle className="w-1.5 h-1.5 fill-accent text-accent" />
                    {formatWhen(p.last_message_at)}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
