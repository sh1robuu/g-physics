"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Brain,
    BookOpen,
    Lightbulb,
    Target,
    Zap,
    ChevronDown,
    AlertCircle,
    Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock concept cards - these could be managed by global state (Zustand) later based on page context.
const contextData = {
    concept: {
        title: "Sóng cơ bản",
        description: "Dao động cơ học lan truyền trong môi trường vật chất. Gồm 2 loại chính: sóng ngang và sóng dọc.",
        chapter: 2
    },
    formulas: [
        { name: "Vận tốc", formula: "v = λf = λ/T" },
        { name: "Độ lệch pha", formula: "Δφ = 2πd/λ" }
    ],
    insights: [
        "Bạn thường nhầm lẫn giữa T và f trong tuần qua.",
        "Chú ý đơn vị của d: phải cùng đơn vị với λ."
    ]
};

export function SmartAssistant() {
    const [activeTab, setActiveTab] = useState<"insights" | "concepts">("concepts");

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
                        <p className="text-xs text-white/50">Phân tích bối cảnh tự động</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex p-2 gap-2 border-b border-white/5 bg-white/[0.01]">
                <button
                    onClick={() => setActiveTab("concepts")}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-lg transition-all",
                        activeTab === "concepts"
                            ? "bg-white/10 text-white shadow-sm"
                            : "text-white/40 hover:bg-white/5 hover:text-white/70"
                    )}
                >
                    <BookOpen className="w-3.5 h-3.5" /> Thư viện
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
            <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">
                <AnimatePresence mode="wait">
                    {activeTab === "concepts" && (
                        <motion.div
                            key="concepts"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                        >
                            {/* Concept Explanation */}
                            <div>
                                <h4 className="text-xs uppercase font-bold text-white/40 mb-2 flex items-center gap-2">
                                    <Target className="w-3.5 h-3.5" /> Khái niệm hiện tại
                                </h4>
                                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-400/10 text-indigo-400 font-mono">
                                            Ch.{contextData.concept.chapter}
                                        </span>
                                        <span className="text-sm font-semibold text-white/90">{contextData.concept.title}</span>
                                    </div>
                                    <p className="text-xs text-white/60 leading-relaxed">
                                        {contextData.concept.description}
                                    </p>
                                </div>
                            </div>

                            {/* Formulas */}
                            <div>
                                <h4 className="text-xs uppercase font-bold text-white/40 mb-2 flex items-center gap-2">
                                    <Zap className="w-3.5 h-3.5" /> Công thức liên quan
                                </h4>
                                <div className="space-y-2">
                                    {contextData.formulas.map((item, idx) => (
                                        <div key={idx} className="flex flex-col gap-1 p-2.5 rounded-lg bg-indigo-500/5 border border-indigo-500/10">
                                            <span className="text-xs text-white/50">{item.name}</span>
                                            <span className="text-sm font-mono text-cyan-200">{item.formula}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "insights" && (
                        <motion.div
                            key="insights"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                        >
                            {/* Memory & Mistakes */}
                            <div>
                                <h4 className="text-xs uppercase font-bold text-white/40 mb-2 flex items-center gap-2">
                                    <AlertCircle className="w-3.5 h-3.5" /> Phân tích lịch sử học
                                </h4>
                                <div className="space-y-2">
                                    {contextData.insights.map((insight, idx) => (
                                        <div key={idx} className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 flex gap-3 text-sm">
                                            <div className="mt-0.5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                            </div>
                                            <p className="text-amber-200/90 text-xs leading-relaxed">{insight}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Recommendation */}
                            <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 text-center relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full" />
                                <h4 className="text-sm font-bold text-indigo-300 flex items-center justify-center gap-2 mb-2">
                                    <Sparkles className="w-4 h-4" /> Gợi ý tiếp theo
                                </h4>
                                <p className="text-xs text-white/70 mb-3">
                                    Hãy làm 3 bài tập về phương trình sóng để rèn luyện kỹ năng đọc đồ thị.
                                </p>
                                <button className="glass-button text-xs w-full py-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200">
                                    Bắt đầu luyện tập
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
