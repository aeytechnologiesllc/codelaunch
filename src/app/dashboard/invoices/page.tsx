"use client";

import { motion } from "framer-motion";
import { FileText, CheckCircle2, Clock, Download } from "lucide-react";

const invoices = [
  { id: "INV-001", description: "Phase 1 — Project Kickoff (50%)", amount: "$3,700", date: "Mar 10, 2026", status: "paid" },
  { id: "INV-002", description: "Phase 2 — Delivery (50%)", amount: "$3,700", date: "Due Apr 18, 2026", status: "pending" },
];

export default function InvoicesPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl sm:text-2xl font-bold mb-1">Invoices</h1>
        <p className="text-text-muted text-sm">View and download your project invoices.</p>
      </motion.div>

      <div className="grid gap-4">
        {invoices.map((inv) => (
          <motion.div
            key={inv.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-5 flex flex-col sm:flex-row sm:items-center gap-4"
          >
            <div className="flex items-center gap-3 flex-1">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                inv.status === "paid" ? "bg-accent/10" : "bg-white/[0.03]"
              }`}>
                <FileText className={`w-5 h-5 ${inv.status === "paid" ? "text-accent" : "text-text-muted"}`} />
              </div>
              <div>
                <div className="text-sm font-medium">{inv.description}</div>
                <div className="text-xs text-text-muted">{inv.id} · {inv.date}</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-base font-bold">{inv.amount}</div>
                <div className={`flex items-center gap-1 text-xs justify-end ${
                  inv.status === "paid" ? "text-accent" : "text-text-muted"
                }`}>
                  {inv.status === "paid" ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                  {inv.status === "paid" ? "Paid" : "Pending"}
                </div>
              </div>
              <button className="p-2 rounded-lg hover:bg-white/[0.05] text-text-muted hover:text-accent transition-colors">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="glass-card p-5 flex items-center justify-between">
        <div>
          <div className="text-sm font-medium">Payment Plan</div>
          <div className="text-text-muted text-xs">50/50 Split — 50% upfront, 50% on delivery</div>
        </div>
        <div className="text-right">
          <div className="text-base font-bold gradient-text">$7,400</div>
          <div className="text-text-muted text-xs">Total project cost</div>
        </div>
      </div>
    </div>
  );
}
