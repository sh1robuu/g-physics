"use client";

import { motion } from "framer-motion";
import { Flame, Star, Trophy, Zap } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { useEffect, useState, useCallback } from "react";

interface StreakData {
    streak: number;
    xp: number;
    todayCheckedIn: boolean;
    lastActiveDate: string | null;
}

function getLevel(xp: number) {
    if (xp >= 5000) return { level: 5, badge: "streak.badge.legend" as const, color: "text-amber-400", bg: "bg-amber-400/10", next: Infinity };
    if (xp >= 2000) return { level: 4, badge: "streak.badge.master" as const, color: "text-violet-400", bg: "bg-violet-400/10", next: 5000 };
    if (xp >= 800) return { level: 3, badge: "streak.badge.scholar" as const, color: "text-cyan-400", bg: "bg-cyan-400/10", next: 2000 };
    if (xp >= 200) return { level: 2, badge: "streak.badge.learner" as const, color: "text-emerald-400", bg: "bg-emerald-400/10", next: 800 };
    return { level: 1, badge: "streak.badge.newcomer" as const, color: "text-indigo-400", bg: "bg-indigo-400/10", next: 200 };
}

export function StreakCard() {
    const { t } = useTranslation();
    const [data, setData] = useState<StreakData>({ streak: 0, xp: 0, todayCheckedIn: false, lastActiveDate: null });

    useEffect(() => {
        // Load from localStorage
        const saved = localStorage.getItem("g-physics-streak");
        if (saved) {
            const parsed = JSON.parse(saved);
            const today = new Date().toDateString();
            const lastActive = parsed.lastActiveDate ? new Date(parsed.lastActiveDate).toDateString() : null;

            if (lastActive === today) {
                setData({ ...parsed, todayCheckedIn: true });
            } else if (lastActive === new Date(Date.now() - 86400000).toDateString()) {
                // Yesterday — streak continues but not checked in yet
                setData({ ...parsed, todayCheckedIn: false });
            } else if (lastActive) {
                // Streak broken
                setData({ streak: 0, xp: parsed.xp || 0, todayCheckedIn: false, lastActiveDate: parsed.lastActiveDate });
            }
        }
    }, []);

    const checkIn = useCallback(() => {
        if (data.todayCheckedIn) return;
        const newData: StreakData = {
            streak: data.streak + 1,
            xp: data.xp + 10 + data.streak * 2, // +10 base + bonus per streak day
            todayCheckedIn: true,
            lastActiveDate: new Date().toISOString(),
        };
        setData(newData);
        localStorage.setItem("g-physics-streak", JSON.stringify(newData));
    }, [data]);

    // Auto check-in when ANY page activity happens
    useEffect(() => {
        if (!data.todayCheckedIn) {
            const timeout = setTimeout(checkIn, 2000); // auto check-in after 2s on page
            return () => clearTimeout(timeout);
        }
    }, [data.todayCheckedIn, checkIn]);

    const level = getLevel(data.xp);
    const xpProgress = level.next === Infinity ? 100 : Math.min(100, Math.round((data.xp / level.next) * 100));

    return (
        <motion.div
            className="glass-card p-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-orange-400/10 flex items-center justify-center">
                        <Flame className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                        <div className="text-xl font-bold text-white">{data.streak}</div>
                        <div className="text-xs text-white/40">{t("streak.days")}</div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="flex items-center gap-1 text-sm">
                        <Zap className="w-3.5 h-3.5 text-yellow-400" />
                        <span className="text-white/70 font-medium">{data.xp} XP</span>
                    </div>
                    <div className={`text-xs ${level.color}`}>
                        <Trophy className="w-3 h-3 inline mr-0.5" />
                        {t(level.badge)}
                    </div>
                </div>
            </div>
            {/* XP Progress Bar */}
            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden mb-2">
                <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${xpProgress}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                />
            </div>
            <div className="text-xs text-center">
                {data.todayCheckedIn ? (
                    <span className="text-emerald-400">{t("streak.todayDone")}</span>
                ) : (
                    <span className="text-orange-300/70">{t("streak.todayPending")}</span>
                )}
            </div>
        </motion.div>
    );
}
