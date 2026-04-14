"use client";

import { motion } from "framer-motion";
import {
    User,
    BarChart3,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    Target,
    Clock,
    CheckCircle2,
    XCircle,
    Brain,
    Lightbulb,
    Settings,
    Award,
    Flame,
    Star,
    Zap,
    ToggleLeft,
    ToggleRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

// Mock learner data
const weaknesses = [
    { topic: "Dòng điện xoay chiều", category: "Tính trở kháng Z", severity: 0.85, occurrences: 8, resolved: false },
    { topic: "Sóng ánh sáng", category: "Giao thoa vân sáng/tối", severity: 0.7, occurrences: 5, resolved: false },
    { topic: "Hạt nhân nguyên tử", category: "Năng lượng liên kết", severity: 0.6, occurrences: 4, resolved: false },
    { topic: "Dao động cơ", category: "Pha ban đầu", severity: 0.45, occurrences: 3, resolved: false },
    { topic: "Lượng tử ánh sáng", category: "Công thoát electron", severity: 0.3, occurrences: 2, resolved: true },
];

const misconceptions = [
    { text: "Nhầm lẫn ZL và ZC khi tính pha", count: 4, category: "Công thức" },
    { text: "Bỏ quên hệ số 2π khi đổi tần số", count: 3, category: "Đơn vị" },
    { text: "Sai dấu pha ban đầu φ", count: 3, category: "Khái niệm" },
    { text: "Nhầm eV và J trong lượng tử", count: 2, category: "Đơn vị" },
];

const attemptHistory = [
    { date: "13/04", total: 15, correct: 12, topic: "Dao động cơ" },
    { date: "12/04", total: 10, correct: 7, topic: "Dòng điện xoay chiều" },
    { date: "11/04", total: 20, correct: 16, topic: "Tổng hợp" },
    { date: "10/04", total: 8, correct: 5, topic: "Sóng ánh sáng" },
    { date: "09/04", total: 12, correct: 10, topic: "Lượng tử ánh sáng" },
    { date: "08/04", total: 15, correct: 11, topic: "Hạt nhân nguyên tử" },
];

const topicMastery = [
    { name: "Dao động cơ", mastery: 82 },
    { name: "Sóng cơ", mastery: 75 },
    { name: "Dòng điện xoay chiều", mastery: 45 },
    { name: "Sóng điện từ", mastery: 70 },
    { name: "Sóng ánh sáng", mastery: 55 },
    { name: "Lượng tử ánh sáng", mastery: 60 },
    { name: "Hạt nhân nguyên tử", mastery: 50 },
];

const badges = [
    { name: "Người mới", icon: Star, earned: true },
    { name: "7 ngày streak", icon: Flame, earned: true },
    { name: "100 câu hỏi", icon: Target, earned: true },
    { name: "Bậc thầy dao động", icon: Award, earned: false },
    { name: "Siêu tốc", icon: Zap, earned: false },
];

export default function ProfilePage() {
    const [gamification, setGamification] = useState(true);

    return (
        <div className="max-w-7xl mx-auto space-y-6 p-6 lg:p-8">
            {/* Header */}
            <motion.div className="flex items-center justify-between" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <User className="w-6 h-6 text-indigo-400" />
                        Hồ sơ học tập
                    </h1>
                    <p className="text-white/50 text-sm mt-1">Theo dõi tiến bộ, điểm yếu, và thành tích</p>
                </div>
                <button
                    onClick={() => setGamification(!gamification)}
                    className={cn("flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all border", gamification ? "bg-indigo-500/10 text-indigo-300 border-indigo-500/20" : "text-white/40 border-white/10")}
                >
                    {gamification ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                    {gamification ? "Gamification ON" : "Gamification OFF"}
                </button>
            </motion.div>

            {/* Overview Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Tổng câu hỏi", value: "156", icon: Target, color: "text-indigo-400", bg: "bg-indigo-400/10" },
                    { label: "Tỉ lệ đúng", value: "78%", icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-400/10" },
                    { label: "Phiên học", value: "24", icon: Brain, color: "text-cyan-400", bg: "bg-cyan-400/10" },
                    { label: "Thời gian học", value: "18h", icon: Clock, color: "text-violet-400", bg: "bg-violet-400/10" },
                ].map((s, i) => (
                    <motion.div key={s.label} className="glass-card p-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                        <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center mb-3", s.bg)}>
                            <s.icon className={cn("w-4 h-4", s.color)} />
                        </div>
                        <div className="text-xl font-bold text-white">{s.value}</div>
                        <div className="text-xs text-white/40">{s.label}</div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Topic Mastery */}
                <motion.div className="glass-panel p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                    <h2 className="text-base font-semibold text-white flex items-center gap-2 mb-5">
                        <BarChart3 className="w-4 h-4 text-indigo-400" />
                        Mức độ thành thạo theo chủ đề
                    </h2>
                    <div className="space-y-4">
                        {topicMastery.map((t) => (
                            <div key={t.name} className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-white/70">{t.name}</span>
                                    <span className={cn("text-xs font-medium", t.mastery >= 70 ? "text-emerald-400" : t.mastery >= 50 ? "text-amber-400" : "text-red-400")}>
                                        {t.mastery}%
                                    </span>
                                </div>
                                <div className="w-full h-2 rounded-full bg-white/5">
                                    <motion.div
                                        className={cn("h-full rounded-full", t.mastery >= 70 ? "bg-emerald-400" : t.mastery >= 50 ? "bg-amber-400" : "bg-red-400")}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${t.mastery}%` }}
                                        transition={{ duration: 0.8, delay: 0.3 }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Weaknesses */}
                <motion.div className="glass-panel p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <h2 className="text-base font-semibold text-white flex items-center gap-2 mb-5">
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        Điểm yếu cần cải thiện
                    </h2>
                    <div className="space-y-3">
                        {weaknesses.map((w) => (
                            <div key={w.category} className={cn(
                                "p-3 rounded-xl bg-white/[0.02] border-l-3",
                                w.resolved ? "opacity-50 border-l-emerald-400" : w.severity > 0.7 ? "border-l-red-400" : w.severity > 0.45 ? "border-l-amber-400" : "border-l-indigo-400"
                            )} style={{ borderLeftWidth: "3px" }}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-sm font-medium text-white/80">{w.category}</div>
                                        <div className="text-xs text-white/30">{w.topic} · {w.occurrences} lần</div>
                                    </div>
                                    {w.resolved ? (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                    ) : (
                                        <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", w.severity > 0.7 ? "bg-red-400/10 text-red-400" : "bg-amber-400/10 text-amber-400")}>
                                            {Math.round(w.severity * 100)}%
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Misconceptions */}
                <motion.div className="glass-panel p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                    <h2 className="text-base font-semibold text-white flex items-center gap-2 mb-5">
                        <Lightbulb className="w-4 h-4 text-violet-400" />
                        Lỗi thường gặp
                    </h2>
                    <div className="space-y-3">
                        {misconceptions.map((m, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02]">
                                <XCircle className="w-4 h-4 text-red-400/60 shrink-0" />
                                <div className="flex-1">
                                    <div className="text-sm text-white/70">{m.text}</div>
                                    <div className="text-xs text-white/30 mt-0.5">{m.category} · {m.count} lần</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Attempt History */}
                <motion.div className="glass-panel p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <h2 className="text-base font-semibold text-white flex items-center gap-2 mb-5">
                        <Clock className="w-4 h-4 text-cyan-400" />
                        Lịch sử luyện tập
                    </h2>
                    <div className="space-y-3">
                        {attemptHistory.map((a, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02]">
                                <span className="text-xs text-white/30 w-12 font-mono">{a.date}</span>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-2 rounded-full bg-white/5">
                                            <div className="h-full rounded-full bg-indigo-400" style={{ width: `${(a.correct / a.total) * 100}%` }} />
                                        </div>
                                        <span className="text-xs text-white/50 w-16 text-right font-mono">
                                            {a.correct}/{a.total}
                                        </span>
                                    </div>
                                    <div className="text-xs text-white/30 mt-1">{a.topic}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Gamification Badges */}
            {gamification && (
                <motion.div className="glass-panel p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                    <h2 className="text-base font-semibold text-white flex items-center gap-2 mb-5">
                        <Award className="w-4 h-4 text-amber-400" />
                        Thành tích
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                        {badges.map((b) => (
                            <div
                                key={b.name}
                                className={cn(
                                    "glass-card p-4 text-center",
                                    !b.earned && "opacity-30 grayscale"
                                )}
                            >
                                <div className={cn(
                                    "w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center",
                                    b.earned ? "bg-amber-400/10 border border-amber-400/20" : "bg-white/5"
                                )}>
                                    <b.icon className={cn("w-6 h-6", b.earned ? "text-amber-400" : "text-white/20")} />
                                </div>
                                <div className="text-xs font-medium text-white/70">{b.name}</div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
}
