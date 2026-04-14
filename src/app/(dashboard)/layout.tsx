"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
    Atom,
    LayoutDashboard,
    Brain,
    BookOpen,
    Target,
    User,
    Settings,
    LogOut,
    Menu,
    X,
    Library,
} from "lucide-react";
import { useState } from "react";
import { SmartAssistant } from "@/components/SmartAssistant";

const navItems = [
    { title: "Tổng quan", href: "/dashboard", icon: LayoutDashboard },
    { title: "Gia sư AI", href: "/tutor", icon: Brain },
    { title: "Luyện đề", href: "/practice", icon: Target },
    { title: "Thư viện", href: "/library", icon: Library },
    { title: "Hồ sơ học tập", href: "/profile", icon: User },
];

function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const pathname = usePathname();

    return (
        <>
            {/* Mobile overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed top-0 left-0 h-full w-64 z-50 transition-transform duration-300 lg:translate-x-0",
                    "bg-[#0c0d1f]/90 backdrop-blur-xl border-r border-white/5",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6 flex items-center justify-between">
                        <Link href="/dashboard" className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                                <Atom className="w-5 h-5 text-indigo-400" />
                            </div>
                            <span className="text-lg font-bold text-white">G-Physics</span>
                        </Link>
                        <button onClick={onClose} className="lg:hidden text-white/40 hover:text-white/70">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Nav */}
                    <nav className="flex-1 px-3 space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={onClose}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                                        isActive
                                            ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/20"
                                            : "text-white/50 hover:text-white/80 hover:bg-white/5"
                                    )}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.title}
                                    {isActive && (
                                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Bottom */}
                    <div className="p-3 border-t border-white/5 space-y-1">
                        <Link
                            href="/admin"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/40 hover:text-white/70 hover:bg-white/5 transition-all"
                        >
                            <Settings className="w-5 h-5" />
                            Quản trị
                        </Link>
                        <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/40 hover:text-red-400 hover:bg-red-400/5 transition-all w-full">
                            <LogOut className="w-5 h-5" />
                            Đăng xuất
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#0a0b1a] overflow-hidden flex relative">
            {/* Ambient Background Lights */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] bg-indigo-600/15 rounded-full blur-[120px]" />
                <div className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] bg-violet-600/15 rounded-full blur-[120px]" />
            </div>

            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Workspace Area */}
            <div className="flex-1 flex flex-col lg:ml-64 relative z-10 w-full h-screen overflow-hidden text-white">
                {/* Top bar (Floating) */}
                <header className="flex-none z-30 bg-transparent px-4 lg:px-8 py-5">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <div className="hidden lg:block">
                            <h2 className="text-xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">Không gian học tập</h2>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="stat-badge stat-badge-info glass-panel border border-indigo-500/30 px-3 py-1.5 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                                <Atom className="w-3.5 h-3.5 mr-1 text-indigo-400" />
                                <span className="text-indigo-200">AI Active</span>
                            </div>
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/30 to-violet-500/30 border border-white/10 flex items-center justify-center text-sm font-bold text-white shadow-lg backdrop-blur-md cursor-pointer hover:border-white/20 transition-colors">
                                HS
                            </div>
                        </div>
                    </div>
                </header>

                {/* 3-Column Layout Container */}
                <div className="flex-1 flex overflow-hidden px-4 lg:px-8 pb-6 gap-6">
                    {/* Center Workspace Area */}
                    <main className="flex-1 flex flex-col min-w-0 overflow-y-auto rounded-2xl glass-panel relative shadow-[0_8px_32px_rgba(0,0,0,0.4)] custom-scrollbar">
                        <div className="h-full">
                            {children}
                        </div>
                    </main>

                    {/* Right Assistant Panel */}
                    <aside className="hidden xl:flex w-[320px] 2xl:w-[380px] flex-col shrink-0">
                        {/* We use dynamic import or standard import for SmartAssistant */}
                        {/* But since we just added SmartAssistant, we'll inline requiring it here or add import at top */}
                        <div className="h-full w-full">
                            <SmartAssistant />
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
