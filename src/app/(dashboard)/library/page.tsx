"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Library,
    Upload,
    Search,
    Filter,
    Grid,
    List,
    FileText,
    Image as ImageIcon,
    File,
    Tag as TagIcon,
    X,
    Plus,
    MoreVertical,
    Download,
    Trash2,
    FolderOpen,
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
    createdAt: Date;
    topic?: string;
}

const mockResources: Resource[] = [
    { id: "1", title: "Đề thi THPT 2024 — Mã đề 201", description: "Đề thi chính thức môn Vật lý", fileType: "pdf", fileSize: 2400000, category: "Đề thi", tags: ["2024", "đề thi chính thức"], createdAt: new Date("2024-12-15"), topic: "Tổng hợp" },
    { id: "2", title: "Tóm tắt công thức Dao động cơ", description: "Các công thức quan trọng chương 1", fileType: "pdf", fileSize: 450000, category: "Tóm tắt", tags: ["công thức", "dao động"], createdAt: new Date("2024-11-20"), topic: "Dao động cơ" },
    { id: "3", title: "Bài tập mạch RLC nâng cao", description: "20 bài tập có lời giải chi tiết", fileType: "docx", fileSize: 1200000, category: "Bài tập", tags: ["RLC", "nâng cao"], createdAt: new Date("2024-12-01"), topic: "Dòng điện xoay chiều" },
    { id: "4", title: "Ghi chú — Lượng tử ánh sáng", description: "Ghi chú bài giảng thầy Hùng", fileType: "pdf", fileSize: 800000, category: "Ghi chú", tags: ["ghi chú", "lượng tử"], createdAt: new Date("2024-12-10"), topic: "Lượng tử ánh sáng" },
    { id: "5", title: "Sơ đồ tư duy Hạt nhân nguyên tử", description: "Mind map toàn bộ chương 7", fileType: "png", fileSize: 3500000, category: "Sơ đồ", tags: ["mind map", "hạt nhân"], createdAt: new Date("2024-12-05"), topic: "Hạt nhân nguyên tử" },
    { id: "6", title: "Đề thi thử lần 3 — Trường THPT Chuyên", fileType: "pdf", fileSize: 1800000, category: "Đề thi", tags: ["đề thử", "trường chuyên"], createdAt: new Date("2024-12-12"), topic: "Tổng hợp" },
];

const categories = ["Tất cả", "Đề thi", "Tóm tắt", "Bài tập", "Ghi chú", "Sơ đồ"];

function formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
}

function FileIcon({ type }: { type: string }) {
    if (type === "pdf") return <FileText className="w-5 h-5 text-red-400" />;
    if (type === "png" || type === "jpg") return <ImageIcon className="w-5 h-5 text-emerald-400" />;
    return <File className="w-5 h-5 text-indigo-400" />;
}

export default function LibraryPage() {
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Tất cả");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [showUpload, setShowUpload] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const filtered = mockResources.filter((r) => {
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
                    <p className="text-white/50 text-sm mt-1">Quản lý tài liệu, đề thi, ghi chú cá nhân</p>
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
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold text-white">Tải lên tài liệu</h2>
                                <button onClick={() => setShowUpload(false)} className="text-white/40 hover:text-white/70">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Drop zone */}
                            <div
                                className={cn(
                                    "border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer",
                                    isDragging ? "border-indigo-400 bg-indigo-400/5" : "border-white/10 hover:border-white/20"
                                )}
                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={(e) => { e.preventDefault(); setIsDragging(false); }}
                            >
                                <Upload className="w-10 h-10 text-white/20 mx-auto mb-3" />
                                <p className="text-sm text-white/50 mb-1">Kéo thả file hoặc click để chọn</p>
                                <p className="text-xs text-white/30">PDF, DOCX, PNG, JPG — Tối đa 10MB</p>
                            </div>

                            <div className="mt-6 space-y-4">
                                <div>
                                    <label className="block text-sm text-white/60 mb-1.5">Tiêu đề</label>
                                    <input className="glass-input" placeholder="Tên tài liệu" />
                                </div>
                                <div>
                                    <label className="block text-sm text-white/60 mb-1.5">Thể loại</label>
                                    <select className="glass-input">
                                        {categories.filter((c) => c !== "Tất cả").map((c) => (
                                            <option key={c} value={c} className="bg-[#161837]">{c}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-white/60 mb-1.5">Tags</label>
                                    <input className="glass-input" placeholder="Nhập tag, phân cách bằng dấu phẩy" />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button onClick={() => setShowUpload(false)} className="btn-secondary flex-1">Hủy</button>
                                <button className="btn-primary flex-1">Tải lên</button>
                            </div>
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
                    <p className="text-white/40">Không tìm thấy tài liệu nào</p>
                </div>
            ) : viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((r, i) => (
                        <motion.div
                            key={r.id}
                            className="glass-card p-5 cursor-pointer group"
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
                                    <p className="text-xs text-white/30 mt-0.5">{r.topic} · {formatFileSize(r.fileSize)}</p>
                                </div>
                            </div>
                            {r.description && (
                                <p className="text-xs text-white/40 line-clamp-2 mb-3">{r.description}</p>
                            )}
                            <div className="flex items-center justify-between">
                                <div className="flex gap-1.5 flex-wrap">
                                    {r.tags.slice(0, 2).map((t) => (
                                        <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-400/10 text-indigo-300/70">{t}</span>
                                    ))}
                                </div>
                                <span className="text-[10px] text-white/20">{r.createdAt.toLocaleDateString("vi-VN")}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="glass-panel overflow-hidden">
                    {filtered.map((r, i) => (
                        <div
                            key={r.id}
                            className={cn(
                                "flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors cursor-pointer",
                                i > 0 && "border-t border-white/5"
                            )}
                        >
                            <FileIcon type={r.fileType} />
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-white/80 truncate">{r.title}</div>
                                <div className="text-xs text-white/30">{r.topic} · {r.category}</div>
                            </div>
                            <div className="hidden sm:flex gap-1.5">
                                {r.tags.slice(0, 2).map((t) => (
                                    <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-400/10 text-indigo-300/70">{t}</span>
                                ))}
                            </div>
                            <span className="text-xs text-white/20 hidden md:block">{formatFileSize(r.fileSize)}</span>
                            <span className="text-xs text-white/20">{r.createdAt.toLocaleDateString("vi-VN")}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
