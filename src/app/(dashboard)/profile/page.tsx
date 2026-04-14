"use client";

import { motion } from "framer-motion";
import {
    User,
    BarChart3,
    Target,
    Clock,
    CheckCircle2,
    Brain,
    Award,
    Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function ProfilePage() {
    return (
        <div className="max-w-7xl mx-auto space-y-6 p-6 lg:p-8">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <User className="w-6 h-6 text-indigo-400" />
                    Hồ sơ học tập
                </h1>
                <p className="text-white/50 text-sm mt-1">Theo dõi tiến bộ, điểm yếu, và thành tích</p>
            </motion.div>

            {/* Empty Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Tổng câu hỏi", value: "0", icon: Target, color: "text-indigo-400", bg: "bg-indigo-400/10" },
                    { label: "Tỉ lệ đúng", value: "—", icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-400/10" },
                    { label: "Phiên học", value: "0", icon: Brain, color: "text-cyan-400", bg: "bg-cyan-400/10" },
                    { label: "Thời gian học", value: "0h", icon: Clock, color: "text-violet-400", bg: "bg-violet-400/10" },
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

            {/* Empty state */}
            <motion.div
                className="glass-panel p-10 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-white/10 flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-8 h-8 text-indigo-400" />
                </div>
                <h2 className="text-lg font-semibold text-white mb-2">Chưa có dữ liệu học tập</h2>
                <p className="text-sm text-white/50 max-w-md mx-auto mb-6">
                    Hãy bắt đầu học và luyện đề để hệ thống phân tích điểm mạnh, điểm yếu và tiến bộ của bạn.
                </p>
                <Link
                    href="/tutor"
                    className="btn-primary inline-flex items-center gap-2 px-6 py-3"
                >
                    <Sparkles className="w-4 h-4" />
                    Bắt đầu học
                </Link>
            </motion.div>
        </div>
    );
}
