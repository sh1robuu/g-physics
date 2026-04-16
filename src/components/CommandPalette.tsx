"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Brain,
    Target,
    BookOpen,
    User,
    LayoutDashboard,
    Plus,
    Command,
    ArrowRight,
    CornerDownLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n";
import { useChatStore } from "@/lib/store/chat";

interface CommandItem {
    id: string;
    label: string;
    desc?: string;
    icon: React.ElementType;
    action: () => void;
    shortcut?: string;
    category: string;
}

export function CommandPalette() {
    const { t } = useTranslation();
    const router = useRouter();
    const { createConversation } = useChatStore();
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const commands: CommandItem[] = useMemo(() => [
        {
            id: "dashboard",
            label: t("sidebar.overview"),
            desc: t("dashboard.subtitle"),
            icon: LayoutDashboard,
            action: () => router.push("/dashboard"),
            shortcut: "",
            category: t("nav.features"),
        },
        {
            id: "tutor",
            label: t("sidebar.aiTutor"),
            desc: t("dashboard.askAIDesc"),
            icon: Brain,
            action: () => router.push("/tutor"),
            shortcut: "",
            category: t("nav.features"),
        },
        {
            id: "new-chat",
            label: t("sidebar.newChat"),
            icon: Plus,
            action: () => { createConversation(); router.push("/tutor"); },
            shortcut: "Ctrl+N",
            category: t("nav.features"),
        },
        {
            id: "practice",
            label: t("sidebar.practice"),
            desc: t("dashboard.practiceDesc"),
            icon: Target,
            action: () => router.push("/practice"),
            shortcut: "",
            category: t("nav.features"),
        },
        {
            id: "library",
            label: t("sidebar.library"),
            desc: t("dashboard.libraryDesc"),
            icon: BookOpen,
            action: () => router.push("/library"),
            shortcut: "",
            category: t("nav.features"),
        },
        {
            id: "profile",
            label: t("sidebar.profile"),
            desc: t("dashboard.profileDesc"),
            icon: User,
            action: () => router.push("/profile"),
            shortcut: "",
            category: t("nav.features"),
        },
    ], [t, router, createConversation]);

    const filtered = useMemo(() => {
        if (!query.trim()) return commands;
        const q = query.toLowerCase();
        return commands.filter(
            (c) =>
                c.label.toLowerCase().includes(q) ||
                (c.desc && c.desc.toLowerCase().includes(q))
        );
    }, [query, commands]);

    // Update selected index when filter changes
    useEffect(() => {
        setSelectedIndex(0);
    }, [filtered.length]);

    // Global keyboard listener
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            // Ctrl+K / Cmd+K — Open palette
            if ((e.ctrlKey || e.metaKey) && e.key === "k") {
                e.preventDefault();
                setIsOpen((prev) => !prev);
                setQuery("");
                setSelectedIndex(0);
            }
            // Ctrl+N — New chat
            if ((e.ctrlKey || e.metaKey) && e.key === "n") {
                // Only if not typing in an input
                if (document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
                    e.preventDefault();
                    createConversation();
                    router.push("/tutor");
                }
            }
            // Escape — Close palette
            if (e.key === "Escape" && isOpen) {
                e.preventDefault();
                setIsOpen(false);
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [isOpen, router, createConversation]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    const executeCommand = (cmd: CommandItem) => {
        setIsOpen(false);
        setQuery("");
        cmd.action();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex((i) => Math.max(i - 1, 0));
        } else if (e.key === "Enter" && filtered[selectedIndex]) {
            e.preventDefault();
            executeCommand(filtered[selectedIndex]);
        }
    };

    return (
        <>
            {/* Trigger hint in header */}
            <button
                onClick={() => { setIsOpen(true); setQuery(""); }}
                className="w-full flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/30 text-sm hover:text-white/50 hover:bg-white/10 transition-all cursor-pointer"
            >
                <Search className="w-4 h-4 shrink-0" />
                <span className="flex-1 text-left">{t("common.search")}...</span>
                <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-white/20">
                    ⌘K
                </kbd>
            </button>

            {/* Modal */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="fixed left-1/2 top-[20%] -translate-x-1/2 z-[101] w-full max-w-lg"
                        >
                            <div className="glass-panel overflow-hidden shadow-2xl border border-white/10">
                                {/* Search input */}
                                <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
                                    <Search className="w-4 h-4 text-white/30 shrink-0" />
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder={`${t("common.search")}...`}
                                        className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/20"
                                    />
                                    <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-white/20">
                                        ESC
                                    </kbd>
                                </div>

                                {/* Results */}
                                <div className="max-h-72 overflow-y-auto py-2">
                                    {filtered.length === 0 ? (
                                        <div className="px-4 py-6 text-center text-white/30 text-sm">
                                            No results found
                                        </div>
                                    ) : (
                                        filtered.map((cmd, i) => (
                                            <button
                                                key={cmd.id}
                                                onClick={() => executeCommand(cmd)}
                                                onMouseEnter={() => setSelectedIndex(i)}
                                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${i === selectedIndex
                                                    ? "bg-indigo-500/10 text-white"
                                                    : "text-white/60 hover:bg-white/5"
                                                    }`}
                                            >
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${i === selectedIndex ? "bg-indigo-500/20 text-indigo-400" : "bg-white/5"
                                                    }`}>
                                                    <cmd.icon className="w-4 h-4" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-medium truncate">{cmd.label}</div>
                                                    {cmd.desc && (
                                                        <div className="text-xs text-white/30 truncate">{cmd.desc}</div>
                                                    )}
                                                </div>
                                                {cmd.shortcut ? (
                                                    <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-white/20 shrink-0">
                                                        {cmd.shortcut}
                                                    </kbd>
                                                ) : (
                                                    i === selectedIndex && (
                                                        <CornerDownLeft className="w-3.5 h-3.5 text-white/20 shrink-0" />
                                                    )
                                                )}
                                            </button>
                                        ))
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="px-4 py-2 border-t border-white/5 flex items-center gap-4 text-[10px] text-white/20">
                                    <span className="flex items-center gap-1">
                                        <kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/10">↑↓</kbd> navigate
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/10">↵</kbd> select
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/10">esc</kbd> close
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
