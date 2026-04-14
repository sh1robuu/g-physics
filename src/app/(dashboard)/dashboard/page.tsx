"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
    Brain,
    Target,
    BookOpen,
    TrendingUp,
    AlertTriangle,
    Clock,
    ArrowRight,
    Flame,
    Trophy,
    Lightbulb,
    BarChart3,
    Library,
} from "lucide-react";

const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
};

// Mock data
const stats = [
    { label: "Phiên học", value: "24", change: "+3 tuần này", icon: Brain, color: "text-indigo-400", bg: "bg-indigo-400/10" },
    { label: "Câu hỏi đã làm", value: "156", change: "+12 hôm nay", icon: Target, color: "text-cyan-400", bg: "bg-cyan-400/10" },
    { label: "Tỉ lệ đúng", value: "78%", change: "+5%", icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Streak", value: "7 ngày", change: "🔥 Tiếp tục!", icon: Flame, color: "text-amber-400", bg: "bg-amber-400/10" },
];

const weakTopics = [
    { name: "Dòng điện xoay chiều", severity: 0.8, count: 5, chapter: "Chương 3" },
    { name: "Giao thoa ánh sáng", severity: 0.65, count: 3, chapter: "Chương 5" },
    { name: "Phản ứng hạt nhân", severity: 0.5, count: 2, chapter: "Chương 7" },
];

const recentSessions = [
    { title: "Con lắc lò xo — Bài tập biên độ", mode: "GUIDED", time: "15 phút trước", result: "✅ Hiểu rõ" },
    { title: "Mạch RLC nối tiếp — Cộng hưởng", mode: "CONCEPT", time: "2 giờ trước", result: "⚡ Cần ôn lại" },
    { title: "Quang phổ vạch — Phân loại", mode: "HINT", time: "Hôm qua", result: "✅ Nắm vững" },
];

const recommendations = [
    { title: "Ôn lại công thức RLC", desc: "Bạn gặp khó khăn 3 lần gần đây", icon: AlertTriangle, color: "text-amber-400" },
    { title: "Luyện đề giao thoa", desc: "5 câu hỏi phù hợp trình độ", icon: Target, color: "text-cyan-400" },
    { title: "Xem lại hạt nhân nguyên tử", desc: "Khái niệm cơ bản cần củng cố", icon: Lightbulb, color: "text-violet-400" },
];

export default function DashboardPage() {
    return (
        <div className="max-w-7xl mx-auto space-y-6 p-6 lg:p-8">
            {/* Welcome */}
            <motion.div {...fadeIn} transition={{ duration: 0.4 }}>
                <h1 className="text-2xl font-bold text-white mb-1">Xin chào, Học sinh! 👋</h1>
                <p className="text-white/50 text-sm">Đây là tổng quan tiến độ học tập của bạn.</p>
            </motion.div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        className="glass-card p-5"
                        {...fadeIn}
                        transition={{ delay: i * 0.05, duration: 0.4 }}
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                            <span className="text-xs text-emerald-400 font-medium">{stat.change}</span>
                        </div>
                        <div className="text-2xl font-bold text-white">{stat.value}</div>
                        <div className="text-sm text-white/40 mt-1">{stat.label}</div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Weak Topics */}
                <motion.div className="glass-panel p-6 lg:col-span-1" {...fadeIn} transition={{ delay: 0.2 }}>
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-base font-semibold text-white flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-400" />
                            Chủ đề cần ôn
                        </h2>
                    </div>
                    <div className="space-y-4">
                        {weakTopics.map((topic) => (
                            <div key={topic.name} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-sm font-medium text-white/80">{topic.name}</div>
                                        <div className="text-xs text-white/30">{topic.chapter} · {topic.count} lỗi</div>
                                    </div>
                                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${topic.severity > 0.7 ? "bg-red-400/10 text-red-400" :
                                        topic.severity > 0.45 ? "bg-amber-400/10 text-amber-400" :
                                            "bg-emerald-400/10 text-emerald-400"
                                        }`}>
                                        {Math.round(topic.severity * 100)}%
                                    </span>
                                </div>
                                <div className="w-full h-1.5 rounded-full bg-white/5">
                                    <div
                                        className={`h-full rounded-full ${topic.severity > 0.7 ? "bg-red-400" :
                                            topic.severity > 0.45 ? "bg-amber-400" : "bg-emerald-400"
                                            }`}
                                        style={{ width: `${topic.severity * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Recent Sessions */}
                <motion.div className="glass-panel p-6 lg:col-span-2" {...fadeIn} transition={{ delay: 0.3 }}>
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-base font-semibold text-white flex items-center gap-2">
                            <Clock className="w-4 h-4 text-indigo-400" />
                            Phiên học gần đây
                        </h2>
                        <Link href="/tutor" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                            Xem tất cả <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {recentSessions.map((session, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold ${session.mode === "GUIDED" ? "bg-emerald-400/10 text-emerald-400" :
                                    session.mode === "CONCEPT" ? "bg-cyan-400/10 text-cyan-400" :
                                        "bg-amber-400/10 text-amber-400"
                                    }`}>
                                    {session.mode.slice(0, 2)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-white/80 truncate">{session.title}</div>
                                    <div className="text-xs text-white/30">{session.time}</div>
                                </div>
                                <div className="text-xs text-white/50">{session.result}</div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Recommendations + Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recommendations */}
                <motion.div className="glass-panel p-6 lg:col-span-2" {...fadeIn} transition={{ delay: 0.35 }}>
                    <h2 className="text-base font-semibold text-white flex items-center gap-2 mb-5">
                        <Lightbulb className="w-4 h-4 text-violet-400" />
                        Đề xuất cho bạn
                    </h2>
                    <div className="space-y-3">
                        {recommendations.map((rec, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer group">
                                <rec.icon className={`w-5 h-5 ${rec.color} shrink-0`} />
                                <div className="flex-1">
                                    <div className="text-sm font-medium text-white/80">{rec.title}</div>
                                    <div className="text-xs text-white/30">{rec.desc}</div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors" />
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div className="glass-panel p-6" {...fadeIn} transition={{ delay: 0.4 }}>
                    <h2 className="text-base font-semibold text-white mb-5">Thao tác nhanh</h2>
                    <div className="space-y-3">
                        <Link href="/tutor" className="flex items-center gap-3 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/15 hover:bg-indigo-500/15 transition-colors">
                            <Brain className="w-5 h-5 text-indigo-400" />
                            <div>
                                <div className="text-sm font-medium text-white">Hỏi Gia sư AI</div>
                                <div className="text-xs text-white/40">Đặt câu hỏi Vật lý</div>
                            </div>
                        </Link>
                        <Link href="/practice" className="flex items-center gap-3 p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/15 hover:bg-cyan-500/15 transition-colors">
                            <Target className="w-5 h-5 text-cyan-400" />
                            <div>
                                <div className="text-sm font-medium text-white">Luyện đề</div>
                                <div className="text-xs text-white/40">Bắt đầu phiên luyện tập</div>
                            </div>
                        </Link>
                        <Link href="/library" className="flex items-center gap-3 p-4 rounded-xl bg-violet-500/10 border border-violet-500/15 hover:bg-violet-500/15 transition-colors">
                            <Library className="w-5 h-5 text-violet-400" />
                            <div>
                                <div className="text-sm font-medium text-white">Thư viện</div>
                                <div className="text-xs text-white/40">Quản lý tài liệu</div>
                            </div>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
