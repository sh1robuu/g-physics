"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FolderTree, Plus, Edit, Trash2, ChevronRight, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

const mockTopics = [
    {
        id: "1", name: "Dao động cơ", nameVi: "Dao động cơ", chapter: 1, slug: "dao-dong-co",
        subtopics: [
            { id: "s1", name: "Dao động điều hòa", concepts: ["Phương trình dao động", "Vận tốc, gia tốc", "Năng lượng"] },
            { id: "s2", name: "Con lắc lò xo", concepts: ["Chu kỳ", "Tần số", "Cắt ghép lò xo"] },
            { id: "s3", name: "Con lắc đơn", concepts: ["Chu kỳ", "Dao động nhỏ"] },
        ],
    },
    {
        id: "2", name: "Sóng cơ", nameVi: "Sóng cơ", chapter: 2, slug: "song-co",
        subtopics: [
            { id: "s4", name: "Sóng ngang, sóng dọc", concepts: ["Định nghĩa", "Công thức sóng"] },
            { id: "s5", name: "Giao thoa sóng", concepts: ["Cực đại", "Cực tiểu"] },
            { id: "s6", name: "Sóng dừng", concepts: ["Bụng", "Nút"] },
        ],
    },
    {
        id: "3", name: "Dòng điện xoay chiều", nameVi: "Dòng điện xoay chiều", chapter: 3, slug: "dong-dien-xoay-chieu",
        subtopics: [
            { id: "s7", name: "Mạch RLC", concepts: ["Trở kháng", "Cộng hưởng", "Công suất"] },
            { id: "s8", name: "Máy biến áp", concepts: ["Nguyên lý", "Hiệu suất"] },
        ],
    },
    {
        id: "4", name: "Sóng điện từ", nameVi: "Dao động và sóng điện từ", chapter: 4, slug: "song-dien-tu",
        subtopics: [{ id: "s9", name: "Mạch LC", concepts: ["Tần số riêng", "Năng lượng"] }],
    },
    {
        id: "5", name: "Sóng ánh sáng", nameVi: "Sóng ánh sáng", chapter: 5, slug: "song-anh-sang",
        subtopics: [
            { id: "s10", name: "Tán sắc ánh sáng", concepts: ["Quang phổ"] },
            { id: "s11", name: "Giao thoa ánh sáng", concepts: ["Vân sáng", "Vân tối", "Khoảng vân"] },
        ],
    },
    {
        id: "6", name: "Lượng tử ánh sáng", nameVi: "Lượng tử ánh sáng", chapter: 6, slug: "luong-tu-anh-sang",
        subtopics: [
            { id: "s12", name: "Hiệu ứng quang điện", concepts: ["Công thoát", "Giới hạn quang điện"] },
            { id: "s13", name: "Mẫu nguyên tử Bohr", concepts: ["Quỹ đạo", "Bước sóng phát ra"] },
        ],
    },
    {
        id: "7", name: "Hạt nhân nguyên tử", nameVi: "Hạt nhân nguyên tử", chapter: 7, slug: "hat-nhan-nguyen-tu",
        subtopics: [
            { id: "s14", name: "Phóng xạ", concepts: ["Chu kỳ bán rã", "Định luật phóng xạ"] },
            { id: "s15", name: "Phản ứng hạt nhân", concepts: ["Năng lượng liên kết", "Bảo toàn"] },
        ],
    },
];

export default function AdminTopicsPage() {
    const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set(["1"]));
    const [showForm, setShowForm] = useState(false);

    const toggleTopic = (id: string) => {
        setExpandedTopics((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <FolderTree className="w-5 h-5 text-indigo-400" />
                        Phân loại chủ đề
                    </h1>
                    <p className="text-white/50 text-sm mt-1">Quản lý cây chủ đề Vật lý 12</p>
                </div>
                <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Thêm chủ đề
                </button>
            </div>

            {/* Add Modal */}
            <AnimatePresence>
                {showForm && (
                    <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <motion.div className="floating-panel p-8 w-full max-w-lg" initial={{ scale: 0.95 }} animate={{ scale: 1 }}>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold text-white">Thêm chủ đề</h2>
                                <button onClick={() => setShowForm(false)} className="text-white/40 hover:text-white/70"><X className="w-5 h-5" /></button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-white/60 mb-1.5">Tên chủ đề</label>
                                    <input className="glass-input" placeholder="Tên chủ đề" />
                                </div>
                                <div>
                                    <label className="block text-sm text-white/60 mb-1.5">Tên tiếng Việt</label>
                                    <input className="glass-input" placeholder="Tên tiếng Việt" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-white/60 mb-1.5">Chương</label>
                                        <input className="glass-input" type="number" placeholder="1" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-white/60 mb-1.5">Slug</label>
                                        <input className="glass-input" placeholder="dao-dong-co" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm text-white/60 mb-1.5">Mô tả</label>
                                    <textarea className="glass-input min-h-[60px]" placeholder="Mô tả chủ đề..." />
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button onClick={() => setShowForm(false)} className="btn-secondary flex-1">Hủy</button>
                                <button className="btn-primary flex-1">Lưu</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Topic Tree */}
            <div className="glass-panel p-4 space-y-1">
                {mockTopics.map((topic) => {
                    const isExpanded = expandedTopics.has(topic.id);
                    return (
                        <div key={topic.id}>
                            <button
                                onClick={() => toggleTopic(topic.id)}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/[0.03] transition-colors"
                            >
                                {isExpanded ? <ChevronDown className="w-4 h-4 text-white/30" /> : <ChevronRight className="w-4 h-4 text-white/30" />}
                                <span className="text-xs font-mono text-indigo-400/60">Ch.{topic.chapter}</span>
                                <span className="text-sm font-medium text-white/80 flex-1 text-left">{topic.name}</span>
                                <span className="text-xs text-white/30">{topic.subtopics.length} chủ đề con</span>
                                <div className="flex items-center gap-1 ml-2">
                                    <button className="p-1 rounded hover:bg-white/5 text-white/20 hover:text-white/60"><Edit className="w-3.5 h-3.5" /></button>
                                    <button className="p-1 rounded hover:bg-red-400/10 text-white/20 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                                </div>
                            </button>
                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        className="ml-10 space-y-1 mb-2"
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                    >
                                        {topic.subtopics.map((sub) => (
                                            <div key={sub.id} className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-white/50 hover:bg-white/[0.02] transition-colors">
                                                <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                                                <span className="flex-1">{sub.name}</span>
                                                <div className="flex gap-1 flex-wrap">
                                                    {sub.concepts.slice(0, 2).map((c) => (
                                                        <span key={c} className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.04] text-white/30">{c}</span>
                                                    ))}
                                                    {sub.concepts.length > 2 && (
                                                        <span className="text-[10px] text-white/20">+{sub.concepts.length - 2}</span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
