"use client";

import { motion } from "framer-motion";
import {
    BookOpen,
    TrendingUp,
    Target,
    Clock,
    Sparkles,
    ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { useTranslation } from "@/lib/i18n";

const fadeIn = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

export default function DashboardPage() {
    const { user } = useAuth();
    const { t } = useTranslation();
    const displayName = user?.name || "";

    return (
        <div className="max-w-7xl mx-auto space-y-6 p-6 lg:p-8">
            {/* Welcome */}
            <motion.div {...fadeIn} transition={{ duration: 0.4 }}>
                <h1 className="text-2xl font-bold text-white mb-1">{t("dashboard.greeting")} {displayName}! 👋</h1>
                <p className="text-white/50 text-sm">{t("dashboard.subtitle")}</p>
            </motion.div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { title: t("dashboard.askAI"), desc: t("dashboard.askAIDesc"), icon: Sparkles, color: "text-indigo-400", bg: "bg-indigo-400/10", href: "/tutor" },
                    { title: t("dashboard.practice"), desc: t("dashboard.practiceDesc"), icon: Target, color: "text-emerald-400", bg: "bg-emerald-400/10", href: "/practice" },
                    { title: t("dashboard.library"), desc: t("dashboard.libraryDesc"), icon: BookOpen, color: "text-cyan-400", bg: "bg-cyan-400/10", href: "/library" },
                    { title: t("dashboard.profile"), desc: t("dashboard.profileDesc"), icon: TrendingUp, color: "text-violet-400", bg: "bg-violet-400/10", href: "/profile" },
                ].map((item, i) => (
                    <motion.div
                        key={item.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                    >
                        <Link
                            href={item.href}
                            className="glass-card p-5 block group hover:scale-[1.02] transition-transform"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center`}>
                                    <item.icon className={`w-5 h-5 ${item.color}`} />
                                </div>
                                <ArrowRight className="w-4 h-4 text-white/20 ml-auto group-hover:text-white/50 transition-colors" />
                            </div>
                            <div className="text-sm font-semibold text-white/90">{item.title}</div>
                            <div className="text-xs text-white/40 mt-1">{item.desc}</div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* Empty state prompt */}
            <motion.div
                className="glass-panel p-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
            >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-white/10 flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-indigo-400" />
                </div>
                <h2 className="text-lg font-semibold text-white mb-2">{t("dashboard.startTitle")}</h2>
                <p className="text-sm text-white/50 max-w-md mx-auto mb-6">
                    {t("dashboard.startDesc")}
                </p>
                <Link
                    href="/tutor"
                    className="btn-primary inline-flex items-center gap-2 px-6 py-3"
                >
                    <Sparkles className="w-4 h-4" />
                    {t("dashboard.startButton")}
                </Link>
            </motion.div>
        </div>
    );
}
