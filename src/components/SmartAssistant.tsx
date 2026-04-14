"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Brain,
    BookOpen,
    Lightbulb,
    Target,
    Zap,
    Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MathRenderer } from "@/components/MathRenderer";

// Physics formulas reference — real data, not mock
const chapters = [
    {
        chapter: 1,
        title: "Dao động cơ",
        formulas: [
            { name: "Phương trình dao động", formula: "$x = A\\cos(\\omega t + \\varphi)$" },
            { name: "Chu kỳ", formula: "$T = \\frac{2\\pi}{\\omega}$" },
            { name: "Cơ năng", formula: "$E = \\frac{1}{2}kA^2$" },
        ],
    },
    {
        chapter: 2,
        title: "Sóng cơ",
        formulas: [
            { name: "Vận tốc sóng", formula: "$v = \\lambda f = \\frac{\\lambda}{T}$" },
            { name: "Độ lệch pha", formula: "$\\Delta\\varphi = \\frac{2\\pi d}{\\lambda}$" },
        ],
    },
    {
        chapter: 3,
        title: "Dòng điện xoay chiều",
        formulas: [
            { name: "Tổng trở", formula: "$Z = \\sqrt{R^2 + (Z_L - Z_C)^2}$" },
            { name: "Công suất", formula: "$P = UI\\cos\\varphi$" },
        ],
    },
    {
        chapter: 4,
        title: "Sóng điện từ",
        formulas: [
            { name: "Vận tốc", formula: "$c = \\lambda f$" },
            { name: "Tần số riêng", formula: "$f = \\frac{1}{2\\pi\\sqrt{LC}}$" },
        ],
    },
    {
        chapter: 5,
        title: "Sóng ánh sáng",
        formulas: [
            { name: "Vị trí vân sáng", formula: "$x_k = \\frac{k\\lambda D}{a}$" },
            { name: "Khoảng vân", formula: "$\\Delta x = \\frac{\\lambda D}{a}$" },
        ],
    },
    {
        chapter: 6,
        title: "Lượng tử ánh sáng",
        formulas: [
            { name: "Năng lượng photon", formula: "$\\varepsilon = hf$" },
            { name: "Hiệu ứng quang điện", formula: "$eU_h = hf - A$" },
        ],
    },
    {
        chapter: 7,
        title: "Hạt nhân nguyên tử",
        formulas: [
            { name: "Năng lượng liên kết", formula: "$E = \\Delta m \\cdot c^2$" },
            { name: "Phân rã", formula: "$N = N_0 e^{-\\lambda t}$" },
            { name: "Chu kỳ bán rã", formula: "$T_{1/2} = \\frac{\\ln 2}{\\lambda}$" },
        ],
    },
];

export function SmartAssistant() {
    const [activeTab, setActiveTab] = useState<"formulas" | "insights">("formulas");
    const [expandedChapter, setExpandedChapter] = useState<number | null>(1);

    return (
        <div className="glass-panel flex flex-col h-full overflow-hidden relative shadow-2xl border border-white/10">
            {/* Header */}
            <div className="p-4 border-b border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
                        <Brain className="w-5 h-5 text-violet-400" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-white">Smart Assistant</h3>
                        <p className="text-xs text-white/50">Tra cứu công thức nhanh</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex p-2 gap-2 border-b border-white/5 bg-white/[0.01]">
                <button
                    onClick={() => setActiveTab("formulas")}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-lg transition-all",
                        activeTab === "formulas"
                            ? "bg-white/10 text-white shadow-sm"
                            : "text-white/40 hover:bg-white/5 hover:text-white/70"
                    )}
                >
                    <BookOpen className="w-3.5 h-3.5" /> Công thức
                </button>
                <button
                    onClick={() => setActiveTab("insights")}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-lg transition-all",
                        activeTab === "insights"
                            ? "bg-white/10 text-white shadow-sm"
                            : "text-white/40 hover:bg-white/5 hover:text-white/70"
                    )}
                >
                    <Lightbulb className="w-3.5 h-3.5" /> Insights
                </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                <AnimatePresence mode="wait">
                    {activeTab === "formulas" && (
                        <motion.div
                            key="formulas"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-2"
                        >
                            {chapters.map((ch) => (
                                <div key={ch.chapter} className="rounded-xl border border-white/5 overflow-hidden">
                                    <button
                                        onClick={() => setExpandedChapter(expandedChapter === ch.chapter ? null : ch.chapter)}
                                        className="w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-white/[0.03] transition-colors"
                                    >
                                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-400/10 text-indigo-400 font-mono shrink-0">
                                            Ch.{ch.chapter}
                                        </span>
                                        <span className="text-xs font-medium text-white/80 flex-1">{ch.title}</span>
                                        <Zap className={cn(
                                            "w-3 h-3 transition-transform text-white/30",
                                            expandedChapter === ch.chapter && "rotate-90"
                                        )} />
                                    </button>
                                    {expandedChapter === ch.chapter && (
                                        <div className="px-3 pb-3 space-y-1.5">
                                            {ch.formulas.map((f, idx) => (
                                                <div key={idx} className="p-2 rounded-lg bg-indigo-500/5 border border-indigo-500/10">
                                                    <span className="text-[10px] text-white/40 block mb-0.5">{f.name}</span>
                                                    <MathRenderer content={f.formula} className="text-sm text-cyan-200" />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {activeTab === "insights" && (
                        <motion.div
                            key="insights"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex flex-col items-center justify-center py-10 text-center"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-white/10 flex items-center justify-center mb-4">
                                <Sparkles className="w-7 h-7 text-indigo-400" />
                            </div>
                            <h4 className="text-sm font-semibold text-white mb-2">Chưa có dữ liệu phân tích</h4>
                            <p className="text-xs text-white/40 max-w-[200px] leading-relaxed">
                                Hãy bắt đầu chat với AI và luyện đề để hệ thống phân tích điểm mạnh/yếu của bạn.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
