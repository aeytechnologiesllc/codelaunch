"use client";

import { motion } from "framer-motion";
import { Send } from "lucide-react";

const messages = [
  { from: "CodeLaunch", initials: "CL", text: "Hey David! Project is off to a great start. Design concepts will be ready by Thursday. Any preferences on color scheme?", time: "Mar 14, 10:30 AM", isTeam: true },
  { from: "You", initials: "DB", text: "Great to hear! We prefer warm colors — think earth tones. And can we make the order button really prominent?", time: "Mar 14, 11:45 AM", isTeam: false },
  { from: "CodeLaunch", initials: "CL", text: "Absolutely. I'll make sure the CTA stands out. Here are 2 design concepts for your review — check the Files section.", time: "Mar 16, 2:15 PM", isTeam: true },
  { from: "You", initials: "DB", text: "Love Concept A! The warm tones are perfect. Can we tweak the header font to be a bit bolder?", time: "Mar 17, 9:20 AM", isTeam: false },
  { from: "CodeLaunch", initials: "CL", text: "Done! Updated design is in your files. Weekly demo is tomorrow at 2pm — I'll walk you through the checkout flow live.", time: "Mar 20, 4:00 PM", isTeam: true },
  { from: "CodeLaunch", initials: "CL", text: "Quick update: cart & checkout are done. Starting Stripe integration today. On track for April 18 launch.", time: "Mar 26, 9:00 AM", isTeam: true },
];

export default function MessagesPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl sm:text-2xl font-bold mb-1">Messages</h1>
        <p className="text-text-muted text-sm">Direct communication with your project team.</p>
      </motion.div>

      {/* Messages */}
      <div className="space-y-4">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`flex gap-3 ${msg.isTeam ? "" : "flex-row-reverse"}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
              msg.isTeam ? "bg-accent/10 text-accent" : "bg-white/[0.05] text-text-secondary"
            }`}>
              {msg.initials}
            </div>
            <div className={`max-w-[80%] ${msg.isTeam ? "" : "text-right"}`}>
              <div className={`glass-card p-4 ${
                msg.isTeam ? "" : "bg-accent/5 border-accent/10"
              }`}>
                <p className="text-sm text-text-secondary leading-relaxed">{msg.text}</p>
              </div>
              <div className="text-[10px] text-text-muted mt-1 px-1">
                {msg.from} · {msg.time}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Input */}
      <div className="glass-card p-3 flex items-center gap-3 sticky bottom-4">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none px-2"
        />
        <button className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center hover:bg-accent-hover transition-colors">
          <Send className="w-4 h-4 text-bg-primary" />
        </button>
      </div>
    </div>
  );
}
