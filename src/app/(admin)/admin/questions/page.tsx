"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Plus, Search, Edit, Trash2, X, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

const mockQuestions = [
    { id: "1", topic: "Dao động cơ", text: "Một con lắc lò xo dao động điều hòa...", difficulty: "MEDIUM", type: "MULTIPLE_CHOICE", source: "Đề THPT 2024" },
    { id: "2", topic: "Sóng cơ", text: "Hai nguồn sóng kết hợp S1, S2...", difficulty: "EASY", type: "MULTIPLE_CHOICE", source: "SGK" },
    { id: "3", topic: "Dòng điện xoay chiều", text: "Cho mạch RLC nối tiếp...", difficulty: "MEDIUM", type: "CALCULATION", source: "Đề THPT 2023" },
    { id: "4", topic: "Lượng tử ánh sáng", text: "Giới hạn quang điện của kim loại kali...", difficulty: "EASY", type: "MULTIPLE_CHOICE", source: "SGK" },
    { id: "5", topic: "Hạt nhân nguyên tử", text: "Chất phóng xạ X có chu kỳ bán rã...", difficulty: "EASY", type: "MULTIPLE_CHOICE", source: "Đề thi thử" },
    { id: "6", topic: "Sóng ánh sáng", text: "Trong thí nghiệm Young...", difficulty: "HARD", type: "CALCULATION", source: "Đề THPT 2024" },
];

export default function AdminQuestionsPage() {
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);

    const filtered = mockQuestions.filter((q) =>
        q.text.toLowerCase().includes(search.toLowerCase()) ||
        q.topic.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <FileText className="w-5 h-5 text-indigo-400" />
                        Ngân hàng câu hỏi
                    </h1>
                    <p className="text-white/50 text-sm mt-1">{mockQuestions.length} câu hỏi</p>
                </div>
                <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2 shrink-0">
                    <Plus className="w-4 h-4" /> Thêm câu hỏi
                </button>
            </div>

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {showForm && (
                    <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <motion.div className="floating-panel p-8 w-full max-w-2xl max-h-[85vh] overflow-y-auto" initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold text-white">Thêm câu hỏi mới</h2>
                                <button onClick={() => setShowForm(false)} className="text-white/40 hover:text-white/70"><X className="w-5 h-5" /></button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-white/60 mb-1.5">Chủ đề</label>
                                    <select className="glass-input"><option className="bg-[#161837]">Dao động cơ</option><option className="bg-[#161837]">Sóng cơ</option><option className="bg-[#161837]">Dòng điện xoay chiều</option></select>
                                </div>
                                <div>
                                    <label className="block text-sm text-white/60 mb-1.5">Nội dung câu hỏi</label>
                                    <textarea className="glass-input min-h-[100px]" placeholder="Nhập nội dung câu hỏi..." />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-white/60 mb-1.5">Độ khó</label>
                                        <select className="glass-input"><option className="bg-[#161837]">EASY</option><option className="bg-[#161837]">MEDIUM</option><option className="bg-[#161837]">HARD</option><option className="bg-[#161837]">EXPERT</option></select>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-white/60 mb-1.5">Loại câu hỏi</label>
                                        <select className="glass-input"><option className="bg-[#161837]">MULTIPLE_CHOICE</option><option className="bg-[#161837]">SHORT_ANSWER</option><option className="bg-[#161837]">CALCULATION</option></select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm text-white/60 mb-1.5">Đáp án A</label>
                                    <input className="glass-input" placeholder="Phương án A" />
                                </div>
                                <div>
                                    <label className="block text-sm text-white/60 mb-1.5">Đáp án B</label>
                                    <input className="glass-input" placeholder="Phương án B" />
                                </div>
                                <div>
                                    <label className="block text-sm text-white/60 mb-1.5">Đáp án C</label>
                                    <input className="glass-input" placeholder="Phương án C" />
                                </div>
                                <div>
                                    <label className="block text-sm text-white/60 mb-1.5">Đáp án D</label>
                                    <input className="glass-input" placeholder="Phương án D" />
                                </div>
                                <div>
                                    <label className="block text-sm text-white/60 mb-1.5">Đáp án đúng</label>
                                    <select className="glass-input"><option className="bg-[#161837]">A</option><option className="bg-[#161837]">B</option><option className="bg-[#161837]">C</option><option className="bg-[#161837]">D</option></select>
                                </div>
                                <div>
                                    <label className="block text-sm text-white/60 mb-1.5">Lời giải</label>
                                    <textarea className="glass-input min-h-[80px]" placeholder="Lời giải chi tiết..." />
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button onClick={() => setShowForm(false)} className="btn-secondary flex-1">Hủy</button>
                                <button className="btn-primary flex-1">Lưu câu hỏi</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Search */}
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} className="glass-input pl-10" placeholder="Tìm câu hỏi..." />
            </div>

            {/* Table */}
            <div className="glass-panel overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left text-xs font-medium text-white/40 uppercase tracking-wider px-5 py-3">ID</th>
                                <th className="text-left text-xs font-medium text-white/40 uppercase tracking-wider px-5 py-3">Nội dung</th>
                                <th className="text-left text-xs font-medium text-white/40 uppercase tracking-wider px-5 py-3">Chủ đề</th>
                                <th className="text-left text-xs font-medium text-white/40 uppercase tracking-wider px-5 py-3">Độ khó</th>
                                <th className="text-left text-xs font-medium text-white/40 uppercase tracking-wider px-5 py-3">Loại</th>
                                <th className="text-left text-xs font-medium text-white/40 uppercase tracking-wider px-5 py-3">Nguồn</th>
                                <th className="text-right text-xs font-medium text-white/40 uppercase tracking-wider px-5 py-3">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((q) => (
                                <tr key={q.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                                    <td className="px-5 py-3 text-sm text-white/30 font-mono">#{q.id}</td>
                                    <td className="px-5 py-3 text-sm text-white/70 max-w-[200px] truncate">{q.text}</td>
                                    <td className="px-5 py-3 text-sm text-white/50">{q.topic}</td>
                                    <td className="px-5 py-3">
                                        <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full border",
                                            q.difficulty === "EASY" ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/20" :
                                                q.difficulty === "MEDIUM" ? "bg-amber-400/10 text-amber-400 border-amber-400/20" :
                                                    "bg-red-400/10 text-red-400 border-red-400/20"
                                        )}>{q.difficulty}</span>
                                    </td>
                                    <td className="px-5 py-3 text-xs text-white/40">{q.type}</td>
                                    <td className="px-5 py-3 text-xs text-white/30">{q.source}</td>
                                    <td className="px-5 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-1.5 rounded-lg hover:bg-white/5 text-white/30 hover:text-white/70"><Edit className="w-3.5 h-3.5" /></button>
                                            <button className="p-1.5 rounded-lg hover:bg-red-400/10 text-white/30 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
