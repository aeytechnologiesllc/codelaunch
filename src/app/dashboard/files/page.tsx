"use client";

import { motion } from "framer-motion";
import { Upload, FileImage, FileText, File, Download, Trash2, FolderOpen } from "lucide-react";

const files = [
  { name: "brand-guidelines.pdf", type: "pdf", size: "2.4 MB", uploaded: "Mar 10, 2026", by: "You", category: "References" },
  { name: "logo-full-color.png", type: "image", size: "840 KB", uploaded: "Mar 10, 2026", by: "You", category: "Brand Assets" },
  { name: "logo-white.svg", type: "image", size: "12 KB", uploaded: "Mar 10, 2026", by: "You", category: "Brand Assets" },
  { name: "menu-items-spreadsheet.xlsx", type: "document", size: "156 KB", uploaded: "Mar 11, 2026", by: "You", category: "Content" },
  { name: "competitor-screenshots.zip", type: "archive", size: "8.2 MB", uploaded: "Mar 12, 2026", by: "You", category: "References" },
  { name: "wireframes-v1.fig", type: "document", size: "3.1 MB", uploaded: "Mar 14, 2026", by: "CodeLaunch", category: "Design" },
  { name: "design-concept-A.fig", type: "document", size: "5.8 MB", uploaded: "Mar 16, 2026", by: "CodeLaunch", category: "Design" },
  { name: "design-concept-B.fig", type: "document", size: "5.4 MB", uploaded: "Mar 16, 2026", by: "CodeLaunch", category: "Design" },
  { name: "approved-design-final.fig", type: "document", size: "6.2 MB", uploaded: "Mar 18, 2026", by: "CodeLaunch", category: "Design" },
  { name: "checkout-flow-v2.fig", type: "document", size: "2.1 MB", uploaded: "Mar 26, 2026", by: "CodeLaunch", category: "Design" },
  { name: "weekly-demo-recording-1.mp4", type: "video", size: "48 MB", uploaded: "Mar 21, 2026", by: "CodeLaunch", category: "Demos" },
  { name: "weekly-demo-recording-2.mp4", type: "video", size: "52 MB", uploaded: "Mar 28, 2026", by: "CodeLaunch", category: "Demos" },
];

const categories = ["All", "References", "Brand Assets", "Content", "Design", "Demos"];

function FileIcon({ type }: { type: string }) {
  switch (type) {
    case "image": return <FileImage className="w-5 h-5 text-accent" />;
    case "pdf": return <FileText className="w-5 h-5 text-red-400" />;
    default: return <File className="w-5 h-5 text-text-muted" />;
  }
}

export default function FilesPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl sm:text-2xl font-bold mb-1">Files & Uploads</h1>
        <p className="text-text-muted text-sm">Upload references, brand assets, and content. Download deliverables from the team.</p>
      </motion.div>

      {/* Upload area */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-8 text-center border-dashed border-2 border-border hover:border-accent/30 transition-colors cursor-pointer group"
      >
        <Upload className="w-10 h-10 text-text-muted mx-auto mb-3 group-hover:text-accent transition-colors" />
        <p className="text-sm font-medium mb-1">Drop files here or click to upload</p>
        <p className="text-text-muted text-xs">PNG, JPG, PDF, DOCX, ZIP up to 50MB</p>
      </motion.div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat, i) => (
          <button
            key={cat}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              i === 0 ? "bg-accent/10 text-accent" : "text-text-muted hover:text-text-primary hover:bg-white/[0.03]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* File list */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card overflow-hidden"
      >
        {/* Header */}
        <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-3 border-b border-border text-xs text-text-muted font-medium">
          <div className="col-span-5">File</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-2">Uploaded</div>
          <div className="col-span-1">Size</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* Rows */}
        {files.map((file, i) => (
          <div
            key={file.name}
            className={`grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-5 py-3.5 items-center hover:bg-white/[0.02] transition-colors ${
              i < files.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <div className="sm:col-span-5 flex items-center gap-3">
              <FileIcon type={file.type} />
              <div>
                <div className="text-sm font-medium truncate">{file.name}</div>
                <div className="sm:hidden text-[10px] text-text-muted">{file.category} · {file.size} · {file.by}</div>
              </div>
            </div>
            <div className="hidden sm:block sm:col-span-2">
              <span className="text-xs text-text-muted bg-bg-primary/50 px-2 py-0.5 rounded">{file.category}</span>
            </div>
            <div className="hidden sm:block sm:col-span-2 text-xs text-text-muted">
              <div>{file.uploaded}</div>
              <div className="text-[10px]">by {file.by}</div>
            </div>
            <div className="hidden sm:block sm:col-span-1 text-xs text-text-muted">{file.size}</div>
            <div className="hidden sm:flex sm:col-span-2 justify-end gap-2">
              <button className="p-1.5 rounded-lg hover:bg-white/[0.05] text-text-muted hover:text-accent transition-colors">
                <Download className="w-3.5 h-3.5" />
              </button>
              {file.by === "You" && (
                <button className="p-1.5 rounded-lg hover:bg-white/[0.05] text-text-muted hover:text-red-400 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Storage info */}
      <div className="flex items-center gap-3 text-xs text-text-muted">
        <FolderOpen className="w-4 h-4" />
        <span>{files.length} files · ~134 MB used</span>
      </div>
    </div>
  );
}
