"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, FileImage, FileText, File, FileVideo, FileArchive,
  Download, Trash2, FolderOpen, Loader2, AlertCircle, Inbox,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ProjectFile {
  id: string;
  name: string;
  file_url: string | null;
  file_type: string | null;
  size_bytes: number | null;
  file_size: number | null;
  storage_path: string | null;
  uploaded_by: string | null;
  uploaded_by_label: string | null;
  category: string | null;
  created_at: string;
}

const BUCKET = "project-files";
const MAX_BYTES = 50 * 1024 * 1024;

function formatBytes(bytes: number | null) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function iconFor(type: string | null, name: string) {
  const lower = (type || name).toLowerCase();
  if (lower.startsWith("image") || /\.(png|jpe?g|gif|svg|webp)$/i.test(name)) return <FileImage className="w-5 h-5 text-accent" />;
  if (lower.includes("pdf") || /\.pdf$/i.test(name)) return <FileText className="w-5 h-5 text-red-400" />;
  if (lower.startsWith("video") || /\.(mp4|mov|webm)$/i.test(name)) return <FileVideo className="w-5 h-5 text-pink-400" />;
  if (/\.(zip|rar|7z|tar|gz)$/i.test(name)) return <FileArchive className="w-5 h-5 text-amber-400" />;
  if (/\.(doc|docx|xls|xlsx|ppt|pptx|fig|sketch)$/i.test(name)) return <FileText className="w-5 h-5 text-violet-300" />;
  return <File className="w-5 h-5 text-text-muted" />;
}

export default function FilesPage() {
  const [projectId, setProjectId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load project + files
  const loadFiles = useCallback(async (pid: string) => {
    const { data, error } = await supabase
      .from("project_files")
      .select("*")
      .eq("project_id", pid)
      .order("created_at", { ascending: false });
    if (!error && data) setFiles(data as ProjectFile[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      setUserId(user.id);

      const { data: projects } = await supabase
        .from("projects")
        .select("id")
        .eq("client_profile_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1);
      if (projects && projects.length > 0) {
        const pid = projects[0].id;
        setProjectId(pid);
        await loadFiles(pid);
      } else {
        setLoading(false);
      }
    };
    init();
  }, [loadFiles]);

  const handleUpload = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0 || !projectId || !userId) return;
    setUploadError(null);
    setUploading(true);

    for (const file of Array.from(fileList)) {
      if (file.size > MAX_BYTES) {
        setUploadError(`${file.name} exceeds 50MB`);
        continue;
      }
      const safeName = file.name.replace(/[^\w.\-]+/g, "_");
      const path = `${projectId}/${crypto.randomUUID()}-${safeName}`;

      const { error: uploadErr } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (uploadErr) {
        setUploadError(uploadErr.message);
        continue;
      }

      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);

      const { error: dbErr } = await supabase.from("project_files").insert({
        project_id: projectId,
        name: file.name,
        file_url: urlData.publicUrl,
        file_type: file.type,
        file_size: file.size,
        size_bytes: file.size,
        storage_path: path,
        uploaded_by: userId,
        uploaded_by_profile_id: userId,
        uploaded_by_label: "You",
        category: "References",
      });
      if (dbErr) {
        setUploadError(dbErr.message);
        await supabase.storage.from(BUCKET).remove([path]);
      }
    }

    await loadFiles(projectId);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDelete = async (f: ProjectFile) => {
    if (!projectId) return;
    if (!confirm(`Delete ${f.name}?`)) return;
    if (f.storage_path) {
      await supabase.storage.from(BUCKET).remove([f.storage_path]);
    }
    await supabase.from("project_files").delete().eq("id", f.id);
    await loadFiles(projectId);
  };

  const categories = ["All", ...Array.from(new Set(files.map((f) => f.category).filter(Boolean))) as string[]];
  const visible = activeCategory === "All" ? files : files.filter((f) => f.category === activeCategory);
  const totalBytes = files.reduce((sum, f) => sum + (f.size_bytes || f.file_size || 0), 0);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl sm:text-2xl font-bold mb-1">Files & Uploads</h1>
        <p className="text-text-muted text-sm">
          Upload references, brand assets, and content. Download deliverables from the team.
        </p>
      </motion.div>

      {/* Upload area */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          handleUpload(e.dataTransfer.files);
        }}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`glass-card p-8 text-center border-dashed border-2 transition-all cursor-pointer group ${
          dragActive ? "border-accent/60 bg-accent/[0.03]" : "border-border hover:border-accent/30"
        } ${!projectId && !loading ? "opacity-50 pointer-events-none" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleUpload(e.target.files)}
          disabled={uploading || !projectId}
        />
        {uploading ? (
          <>
            <Loader2 className="w-10 h-10 text-accent mx-auto mb-3 animate-spin" />
            <p className="text-sm font-medium mb-1">Uploading…</p>
            <p className="text-text-muted text-xs">This can take a moment for larger files.</p>
          </>
        ) : (
          <>
            <Upload className={`w-10 h-10 mx-auto mb-3 transition-colors ${dragActive ? "text-accent" : "text-text-muted group-hover:text-accent"}`} />
            <p className="text-sm font-medium mb-1">
              {dragActive ? "Drop to upload" : "Drop files here or click to upload"}
            </p>
            <p className="text-text-muted text-xs">PNG, JPG, PDF, DOCX, ZIP up to 50MB</p>
          </>
        )}
      </motion.div>

      {uploadError && (
        <div className="glass-card p-3 flex items-start gap-2 border-red-400/20 bg-red-400/[0.03]">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-400 text-xs">{uploadError}</p>
        </div>
      )}

      {/* Filter tabs */}
      {files.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeCategory === cat ? "bg-accent/10 text-accent" : "text-text-muted hover:text-text-primary hover:bg-white/[0.03]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* File list / loading / empty */}
      {loading ? (
        <div className="glass-card overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="px-5 py-4 border-b border-border last:border-0 flex items-center gap-3">
              <div className="skeleton w-5 h-5 rounded" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-3 w-40" />
                <div className="skeleton h-2 w-24" />
              </div>
            </div>
          ))}
        </div>
      ) : visible.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card py-14 px-6 text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-accent/[0.08] border border-accent/10 flex items-center justify-center mx-auto mb-4">
            <Inbox className="w-6 h-6 text-accent/80" />
          </div>
          <h3 className="text-sm font-semibold mb-1.5">
            {files.length === 0 ? "No files yet" : `No files in ${activeCategory}`}
          </h3>
          <p className="text-text-muted text-xs max-w-sm mx-auto leading-relaxed">
            {files.length === 0
              ? "Upload brand guidelines, logos, references, or anything that helps us understand your vision."
              : "Try a different filter, or upload new files."}
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card overflow-hidden"
        >
          <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-3 border-b border-border text-xs text-text-muted font-medium">
            <div className="col-span-5">File</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-2">Uploaded</div>
            <div className="col-span-1">Size</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          <AnimatePresence initial={false}>
            {visible.map((f, i) => {
              const sizeBytes = f.size_bytes || f.file_size || 0;
              const uploadedBy = f.uploaded_by_label || (f.uploaded_by === userId ? "You" : "CodeLaunch");
              const canDelete = f.uploaded_by === userId;
              return (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-5 py-3.5 items-center hover:bg-white/[0.02] transition-colors ${
                    i < visible.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <div className="sm:col-span-5 flex items-center gap-3 min-w-0">
                    {iconFor(f.file_type, f.name)}
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{f.name}</div>
                      <div className="sm:hidden text-[10px] text-text-muted truncate">
                        {f.category || "—"} · {formatBytes(sizeBytes)} · {uploadedBy}
                      </div>
                    </div>
                  </div>
                  <div className="hidden sm:block sm:col-span-2">
                    {f.category ? (
                      <span className="text-xs text-text-muted bg-bg-primary/50 px-2 py-0.5 rounded">{f.category}</span>
                    ) : (
                      <span className="text-xs text-text-muted">—</span>
                    )}
                  </div>
                  <div className="hidden sm:block sm:col-span-2 text-xs text-text-muted">
                    <div>{formatDate(f.created_at)}</div>
                    <div className="text-[10px]">by {uploadedBy}</div>
                  </div>
                  <div className="hidden sm:block sm:col-span-1 text-xs text-text-muted">{formatBytes(sizeBytes)}</div>
                  <div className="hidden sm:flex sm:col-span-2 justify-end gap-2">
                    {f.file_url && (
                      <a
                        href={f.file_url}
                        target="_blank"
                        rel="noreferrer"
                        download={f.name}
                        className="p-1.5 rounded-lg hover:bg-white/[0.05] text-text-muted hover:text-accent transition-colors"
                        aria-label={`Download ${f.name}`}
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => handleDelete(f)}
                        className="p-1.5 rounded-lg hover:bg-white/[0.05] text-text-muted hover:text-red-400 transition-colors"
                        aria-label={`Delete ${f.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Storage info */}
      {files.length > 0 && (
        <div className="flex items-center gap-3 text-xs text-text-muted">
          <FolderOpen className="w-4 h-4" />
          <span>{files.length} {files.length === 1 ? "file" : "files"} · {formatBytes(totalBytes)} used</span>
        </div>
      )}
    </div>
  );
}
