"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Message {
  id: string;
  project_id: string;
  sender_profile_id: string | null;
  sender_name: string;
  body: string;
  created_at: string;
}

function formatTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
  if (sameDay) {
    return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  }
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
    ", " +
    d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function initialsFrom(name: string) {
  return name
    .split(/\s+/)
    .map((n) => n[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function MessagesPage() {
  const [projectId, setProjectId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("You");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const listEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      listEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    });
  }, []);

  const loadMessages = useCallback(async (pid: string) => {
    const { data } = await supabase
      .from("project_messages")
      .select("*")
      .eq("project_id", pid)
      .order("created_at", { ascending: true });
    if (data) setMessages(data as Message[]);
  }, []);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      setUserId(user.id);

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle();
      if (profile?.full_name) setUserName(profile.full_name);
      else if (user.email) setUserName(user.email.split("@")[0]);

      const { data: projects } = await supabase
        .from("projects")
        .select("id")
        .eq("client_profile_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1);
      if (projects && projects.length > 0) {
        const pid = projects[0].id;
        setProjectId(pid);
        await loadMessages(pid);
      }
      setLoading(false);
    };
    init();
  }, [loadMessages]);

  // Real-time updates via Supabase channel
  useEffect(() => {
    if (!projectId) return;
    const channel = supabase
      .channel(`project-messages-${projectId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "project_messages", filter: `project_id=eq.${projectId}` },
        (payload) => {
          setMessages((prev) => {
            if (prev.some((m) => m.id === (payload.new as Message).id)) return prev;
            return [...prev, payload.new as Message];
          });
          scrollToBottom();
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [projectId, scrollToBottom]);

  useEffect(() => {
    if (!loading) scrollToBottom();
  }, [loading, messages.length, scrollToBottom]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = draft.trim();
    if (!text || !projectId || !userId || sending) return;
    setSending(true);
    const { error } = await supabase.from("project_messages").insert({
      project_id: projectId,
      sender_profile_id: userId,
      sender_name: userName,
      body: text,
    });
    if (!error) {
      setDraft("");
      // Realtime channel will append it — but optimistic reload as fallback
      await loadMessages(projectId);
    }
    setSending(false);
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-8rem)] sm:h-[calc(100vh-10rem)]">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-shrink-0 mb-4"
      >
        <h1 className="text-xl sm:text-2xl font-bold mb-1">Messages</h1>
        <p className="text-text-muted text-sm">Direct communication with your project team.</p>
      </motion.div>

      {/* Scrollable message list */}
      <div className="flex-1 overflow-y-auto min-h-0 pb-4">
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className={`flex gap-3 ${i % 2 ? "flex-row-reverse" : ""}`}>
                <div className="skeleton w-8 h-8 rounded-full flex-shrink-0" />
                <div className="skeleton h-14 w-2/3 rounded-2xl" />
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card py-14 px-6 text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-accent/[0.08] border border-accent/10 flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-6 h-6 text-accent/80" />
            </div>
            <h3 className="text-sm font-semibold mb-1.5">
              {projectId ? "Start the conversation" : "No active project yet"}
            </h3>
            <p className="text-text-muted text-xs max-w-sm mx-auto leading-relaxed">
              {projectId
                ? "Send a message below — your project team will see it and reply here. You'll also get an email notification."
                : "Once your project kicks off, this is where you'll talk to your project team."}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => {
                const isMine = msg.sender_profile_id === userId;
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.02, 0.15) }}
                    className={`flex gap-3 ${isMine ? "flex-row-reverse" : ""}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      isMine ? "bg-white/[0.05] text-text-secondary" : "bg-accent/10 text-accent"
                    }`}>
                      {initialsFrom(msg.sender_name || (isMine ? "You" : "CL"))}
                    </div>
                    <div className={`max-w-[85%] sm:max-w-[75%] ${isMine ? "text-right" : ""}`}>
                      <div className={`glass-card p-3.5 ${
                        isMine ? "bg-accent/5 border-accent/10" : ""
                      }`}>
                        <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap break-words text-left">
                          {msg.body}
                        </p>
                      </div>
                      <div className="text-[10px] text-text-muted mt-1 px-1">
                        {isMine ? "You" : msg.sender_name} · {formatTime(msg.created_at)}
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

      {/* Input */}
      <form
        onSubmit={handleSend}
        className={`glass-card p-3 flex items-center gap-3 flex-shrink-0 ${
          !projectId ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={projectId ? "Type a message..." : "No active project"}
          disabled={!projectId || sending}
          className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none px-2"
        />
        <button
          type="submit"
          disabled={!draft.trim() || sending || !projectId}
          className="w-9 h-9 rounded-lg bg-cta flex items-center justify-center hover:bg-cta-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Send message"
        >
          {sending ? <Loader2 className="w-4 h-4 text-cta-text animate-spin" /> : <Send className="w-4 h-4 text-cta-text" />}
        </button>
      </form>
    </div>
  );
}
