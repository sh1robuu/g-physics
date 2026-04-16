"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, BookOpen, Flame, AlertTriangle, Trash2 } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

interface Notification {
    id: string;
    type: "study" | "streak" | "achievement" | "general";
    message: string;
    time: string;
    read: boolean;
}

const ICONS = {
    study: BookOpen,
    streak: Flame,
    achievement: AlertTriangle,
    general: Bell,
};

const COLORS = {
    study: "text-indigo-400 bg-indigo-400/10",
    streak: "text-orange-400 bg-orange-400/10",
    achievement: "text-emerald-400 bg-emerald-400/10",
    general: "text-white/40 bg-white/5",
};

export function NotificationBell() {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        // Load notifications from localStorage
        const saved = localStorage.getItem("g-physics-notifications");
        if (saved) {
            setNotifications(JSON.parse(saved));
        }

        // Generate smart reminders based on user activity
        const streakData = localStorage.getItem("g-physics-streak");
        const today = new Date().toDateString();
        const lastNotifDate = localStorage.getItem("g-physics-last-notif-date");

        if (lastNotifDate !== today) {
            const newNotifs: Notification[] = [];

            if (streakData) {
                const streak = JSON.parse(streakData);
                const lastActive = streak.lastActiveDate ? new Date(streak.lastActiveDate).toDateString() : null;
                if (lastActive && lastActive !== today) {
                    newNotifs.push({
                        id: `streak-${Date.now()}`,
                        type: "streak",
                        message: streak.streak > 3
                            ? t("notification.streakWarning")
                            : t("notification.studyReminder"),
                        time: new Date().toISOString(),
                        read: false,
                    });
                }
            } else {
                newNotifs.push({
                    id: `welcome-${Date.now()}`,
                    type: "study",
                    message: t("notification.studyReminder"),
                    time: new Date().toISOString(),
                    read: false,
                });
            }

            if (newNotifs.length > 0) {
                const merged = [...newNotifs, ...notifications].slice(0, 20);
                setNotifications(merged);
                localStorage.setItem("g-physics-notifications", JSON.stringify(merged));
                localStorage.setItem("g-physics-last-notif-date", today);
            }
        }
    }, []);

    const unreadCount = notifications.filter((n) => !n.read).length;

    const markAllRead = useCallback(() => {
        const updated = notifications.map((n) => ({ ...n, read: true }));
        setNotifications(updated);
        localStorage.setItem("g-physics-notifications", JSON.stringify(updated));
    }, [notifications]);

    const clearAll = useCallback(() => {
        setNotifications([]);
        localStorage.removeItem("g-physics-notifications");
    }, []);

    const formatTime = (iso: string) => {
        const diff = Date.now() - new Date(iso).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return "vừa xong";
        if (mins < 60) return `${mins}m`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}h`;
        return `${Math.floor(hours / 24)}d`;
    };

    return (
        <div className="relative">
            <button
                onClick={() => { setIsOpen(!isOpen); if (!isOpen) markAllRead(); }}
                className="relative p-2 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/5 transition-all"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center font-bold">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-white/10 bg-[#0f1024]/95 backdrop-blur-xl z-50 shadow-2xl overflow-hidden"
                        >
                            <div className="flex items-center justify-between p-3 border-b border-white/5">
                                <h3 className="text-sm font-semibold text-white">{t("notification.title")}</h3>
                                <div className="flex items-center gap-1">
                                    {notifications.length > 0 && (
                                        <button onClick={clearAll} className="p-1 rounded text-white/30 hover:text-red-400 transition-colors">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                    <button onClick={() => setIsOpen(false)} className="p-1 rounded text-white/30 hover:text-white/60 transition-colors">
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                            <div className="max-h-64 overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-6 text-center text-white/30 text-sm">
                                        {t("notification.empty")}
                                    </div>
                                ) : (
                                    notifications.map((n) => {
                                        const Icon = ICONS[n.type];
                                        const colorClass = COLORS[n.type];
                                        return (
                                            <div
                                                key={n.id}
                                                className={`flex items-start gap-3 p-3 border-b border-white/5 transition-colors ${!n.read ? "bg-white/[0.02]" : ""}`}
                                            >
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${colorClass}`}>
                                                    <Icon className="w-4 h-4" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm text-white/70 leading-snug">{n.message}</p>
                                                    <span className="text-xs text-white/20">{formatTime(n.time)}</span>
                                                </div>
                                                {!n.read && <div className="w-2 h-2 rounded-full bg-indigo-400 mt-1.5 shrink-0" />}
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
