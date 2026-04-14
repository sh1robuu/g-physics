"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Library,
    Upload,
    Search,
    Grid,
    List,
    FileText,
    Image as ImageIcon,
    File,
    X,
    Plus,
    Download,
    Trash2,
    FolderOpen,
    CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Resource {
    id: string;
    title: string;
    description?: string;
    fileType: string;
    fileSize: number;
    category: string;
    tags: string[];
    createdAt: string;
    dataUrl?: string; // stored in localStorage
}

const STORAGE_KEY = "g-physics-library";

function loadResources(): Resource[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function saveResources(resources: Resource[]) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(resources));
    } catch {
        // storage full — ignore silently
    }
}

const categories = ["Tất cả", "Đề thi", "Tóm tắt", "Bài tập", "Ghi chú", "Sơ đồ"];

function formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
}

function FileIcon({ type }: { type: string }) {
    if (type === "pdf") return <FileText className="w-5 h-5 text-red-400" />;
    if (type === "png" || type === "jpg" || type === "jpeg") return <ImageIcon className="w-5 h-5 text-emerald-400" />;
    return <File className="w-5 h-5 text-indigo-400" />;
}

export default function LibraryPage() {
    const [resources, setResources] = useState<Resource[]>([]);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Tất cả");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [showUpload, setShowUpload] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    // Upload form state
    const [uploadFile, setUploadFile] = useState<{ name: string; type: string; size: number; dataUrl: string } | null>(null);
    const [uploadTitle, setUploadTitle] = useState("");
    const [uploadCategory, setUploadCategory] = useState("Đề thi");
    const [uploadTags, setUploadTags] = useState("");
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Load from localStorage on mount
    useEffect(() => {
        setResources(loadResources());
    }, []);

    const handleFileChange = (files: FileList | null) => {
        if (!files || files.length === 0) return;
        const file = files[0];
        if (file.size > 10 * 1024 * 1024) {
            alert("File quá lớn! Tối đa 10MB.");
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            setUploadFile({
                name: file.name,
                type: file.type,
                size: file.size,
                dataUrl: reader.result as string,
            });
            if (!uploadTitle) setUploadTitle(file.name.replace(/\.[^.]+$/, ""));
        };
        reader.readAsDataURL(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        handleFileChange(e.dataTransfer.files);
    };

    const handleUploadSubmit = () => {
        if (!uploadFile || !uploadTitle.trim()) return;

        const ext = uploadFile.name.split(".").pop()?.toLowerCase() || "file";
        const newResource: Resource = {
            id: Date.now().toString(),
            title: uploadTitle.trim(),
            fileType: ext,
            fileSize: uploadFile.size,
            category: uploadCategory,
            tags: uploadTags.split(",").map((t) => t.trim()).filter(Boolean),
            createdAt: new Date().toISOString(),
            dataUrl: uploadFile.dataUrl,
        };

        const updated = [newResource, ...resources];
        setResources(updated);
        saveResources(updated);

        // Show success then close
        setUploadSuccess(true);
        setTimeout(() => {
            setShowUpload(false);
            setUploadFile(null);
            setUploadTitle("");
            setUploadTags("");
            setUploadCategory("Đề thi");
            setUploadSuccess(false);
        }, 1000);
    };

    const deleteResource = (id: string) => {
        const updated = resources.filter((r) => r.id !== id);
        setResources(updated);
        saveResources(updated);
    };

    const downloadResource = (r: Resource) => {
        if (!r.dataUrl) return;
        const a = document.createElement("a");
        a.href = r.dataUrl;
        a.download = `${r.title}.${r.fileType}`;
        a.click();
    };

    const filtered = resources.filter((r) => {
        if (selectedCategory !== "Tất cả" && r.category !== selectedCategory) return false;
        if (search && !r.title.toLowerCase().includes(search.toLowerCase()) && !r.tags.some((t) => t.includes(search.toLowerCase()))) return false;
        return true;
    });

    return (
        <div className="max-w-7xl mx-auto space-y-6 p-6 lg:p-8">
            {/* Header */}
            <motion.div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Library className="w-6 h-6 text-indigo-400" />
                        Thư viện học tập
                    </h1>
                    <p className="text-white/50 text-sm mt-1">
                        {resources.length > 0 ? `${resources.length} tài liệu` : "Quản lý tài liệu, đề thi, ghi chú cá nhân"}
                    </p>
                </div>
                <button
                    onClick={() => setShowUpload(true)}
                    className="btn-primary flex items-center gap-2 shrink-0"
                >
                    <Plus className="w-4 h-4" /> Tải lên tài liệu
                </button>
            </motion.div>

            {/* Upload Modal */}
            <AnimatePresence>
                {showUpload && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="floating-panel p-8 w-full max-w-lg"
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95 }}
                        >
                            {uploadSuccess ? (
                                <div className="py-10 text-center">
                                    <CheckCircle className="w-14 h-14 text-emerald-400 mx-auto mb-4" />
                                    <p className="text-lg font-semibold text-white">Tải lên thành công!</p>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-lg font-semibold text-white">Tải lên tài liệu</h2>
                                        <button onClick={() => { setShowUpload(false); setUploadFile(null); setUploadTitle(""); setUploadTags(""); }} className="text-white/40 hover:text-white/70">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* Hidden file input */}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.xlsx,.csv"
                                        className="hidden"
                                        onChange={(e) => { handleFileChange(e.target.files); e.target.value = ""; }}
                                    />

                                    {/* Drop zone */}
                                    {uploadFile ? (
                                        <div className="border-2 border-emerald-400/30 bg-emerald-400/5 rounded-2xl p-6 text-center">
                                            <div className="flex items-center justify-center gap-3 mb-2">
                                                <FileIcon type={uploadFile.name.split(".").pop() || ""} />
                                                <span className="text-sm font-medium text-white/80">{uploadFile.name}</span>
                                            </div>
                                            <p className="text-xs text-white/40">{formatFileSize(uploadFile.size)}</p>
                                            <button
                                                onClick={() => setUploadFile(null)}
                                                className="mt-3 text-xs text-red-400 hover:text-red-300"
                                            >
                                                Chọn file khác
                                            </button>
                                        </div>
                                    ) : (
                                        <div
                                            className={cn(
                                                "border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer",
                                                isDragging ? "border-indigo-400 bg-indigo-400/5" : "border-white/10 hover:border-white/20"
                                            )}
                                            onClick={() => fileInputRef.current?.click()}
                                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                            onDragLeave={() => setIsDragging(false)}
                                            onDrop={handleDrop}
                                        >
                                            <Upload className="w-10 h-10 text-white/20 mx-auto mb-3" />
                                            <p className="text-sm text-white/50 mb-1">Kéo thả file hoặc click để chọn</p>
                                            <p className="text-xs text-white/30">PDF, DOCX, PNG, JPG, XLSX — Tối đa 10MB</p>
                                        </div>
                                    )}

                                    <div className="mt-6 space-y-4">
                                        <div>
                                            <label className="block text-sm text-white/60 mb-1.5">Tiêu đề</label>
                                            <input
                                                className="glass-input"
                                                placeholder="Tên tài liệu"
                                                value={uploadTitle}
                                                onChange={(e) => setUploadTitle(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-white/60 mb-1.5">Thể loại</label>
                                            <select
                                                className="glass-input"
                                                value={uploadCategory}
                                                onChange={(e) => setUploadCategory(e.target.value)}
                                            >
                                                {categories.filter((c) => c !== "Tất cả").map((c) => (
                                                    <option key={c} value={c} className="bg-[#161837]">{c}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm text-white/60 mb-1.5">Tags</label>
                                            <input
                                                className="glass-input"
                                                placeholder="Nhập tag, phân cách bằng dấu phẩy"
                                                value={uploadTags}
                                                onChange={(e) => setUploadTags(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-3 mt-6">
                                        <button onClick={() => { setShowUpload(false); setUploadFile(null); setUploadTitle(""); setUploadTags(""); }} className="btn-secondary flex-1">Hủy</button>
                                        <button
                                            onClick={handleUploadSubmit}
                                            disabled={!uploadFile || !uploadTitle.trim()}
                                            className={cn("btn-primary flex-1", (!uploadFile || !uploadTitle.trim()) && "opacity-50 cursor-not-allowed")}
                                        >
                                            Tải lên
                                        </button>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="relative flex-1 w-full sm:max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="glass-input pl-10"
                        placeholder="Tìm kiếm tài liệu..."
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {categories.map((c) => (
                        <button
                            key={c}
                            onClick={() => setSelectedCategory(c)}
                            className={cn(
                                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap",
                                selectedCategory === c
                                    ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/20"
                                    : "text-white/40 hover:text-white/60 bg-white/[0.03]"
                            )}
                        >
                            {c}
                        </button>
                    ))}
                </div>
                <div className="flex gap-1 ml-auto">
                    <button onClick={() => setViewMode("grid")} className={cn("p-2 rounded-lg transition-all", viewMode === "grid" ? "bg-white/10 text-white" : "text-white/30 hover:text-white/60")}>
                        <Grid className="w-4 h-4" />
                    </button>
                    <button onClick={() => setViewMode("list")} className={cn("p-2 rounded-lg transition-all", viewMode === "list" ? "bg-white/10 text-white" : "text-white/30 hover:text-white/60")}>
                        <List className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Resource Grid */}
            {filtered.length === 0 ? (
                <div className="glass-panel p-12 text-center">
                    <FolderOpen className="w-12 h-12 text-white/10 mx-auto mb-3" />
                    <p className="text-white/40 mb-2">{resources.length === 0 ? "Chưa có tài liệu nào" : "Không tìm thấy tài liệu"}</p>
                    {resources.length === 0 && (
                        <button onClick={() => setShowUpload(true)} className="text-sm text-indigo-400 hover:text-indigo-300">
                            Tải lên tài liệu đầu tiên →
                        </button>
                    )}
                </div>
            ) : viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((r, i) => (
                        <motion.div
                            key={r.id}
                            className="glass-card p-5 cursor-pointer group relative"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <div className="flex items-start gap-3 mb-3">
                                <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center shrink-0">
                                    <FileIcon type={r.fileType} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-medium text-white/80 truncate group-hover:text-white transition-colors">{r.title}</h3>
                                    <p className="text-xs text-white/30 mt-0.5">{r.category} · {formatFileSize(r.fileSize)}</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex gap-1.5 flex-wrap">
                                    {r.tags.slice(0, 2).map((t) => (
                                        <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-400/10 text-indigo-300/70">{t}</span>
                                    ))}
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => downloadResource(r)} className="p-1.5 rounded-lg hover:bg-white/5 text-white/30 hover:text-white/70" title="Tải xuống">
                                        <Download className="w-3.5 h-3.5" />
                                    </button>
                                    <button onClick={() => deleteResource(r.id)} className="p-1.5 rounded-lg hover:bg-red-400/10 text-white/30 hover:text-red-400" title="Xóa">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                            <span className="text-[10px] text-white/20 mt-2 block">{new Date(r.createdAt).toLocaleDateString("vi-VN")}</span>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="glass-panel overflow-hidden">
                    {filtered.map((r, i) => (
                        <div
                            key={r.id}
                            className={cn(
                                "flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors group",
                                i > 0 && "border-t border-white/5"
                            )}
                        >
                            <FileIcon type={r.fileType} />
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-white/80 truncate">{r.title}</div>
                                <div className="text-xs text-white/30">{r.category}</div>
                            </div>
                            <div className="hidden sm:flex gap-1.5">
                                {r.tags.slice(0, 2).map((t) => (
                                    <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-400/10 text-indigo-300/70">{t}</span>
                                ))}
                            </div>
                            <span className="text-xs text-white/20 hidden md:block">{formatFileSize(r.fileSize)}</span>
                            <span className="text-xs text-white/20">{new Date(r.createdAt).toLocaleDateString("vi-VN")}</span>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => downloadResource(r)} className="p-1.5 rounded-lg hover:bg-white/5 text-white/30 hover:text-white/70">
                                    <Download className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={() => deleteResource(r.id)} className="p-1.5 rounded-lg hover:bg-red-400/10 text-white/30 hover:text-red-400">
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
